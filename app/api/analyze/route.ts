import { NextRequest, NextResponse } from 'next/server'
import {
  callQwenVL,
  ANALYSIS_PROMPT,
  ANALYSIS_PROMPT_FACE_ONLY,
  MODE_DAILY_UPGRADE_ADDON,
  MODE_EXPLORE_STYLES_ADDON,
  MODE_SPECIAL_OCCASION_ADDON,
} from '@/lib/qwen'
import { parseAnalysisResult, ParseError } from '@/lib/parse-analysis'
import { SEASON_PALETTES } from '@/lib/season-palettes'
import type { AnalysisMode } from '@/types/analysis'

// Edge runtime: 30s timeout even on Vercel Hobby (vs 10s serverless limit)
export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const {
      imageUrl,
      photoType,
      analysisMode,
      // daily-upgrade
      currentOutfitUrls,
      // special-occasion
      occasionDetails,
      // style supplement
      styleDescription,
      styleImageUrls,
      // user profile
      userProfile,
    } = await req.json() as {
      imageUrl: string
      photoType?: string
      analysisMode?: AnalysisMode
      currentOutfitUrls?: string[]
      occasionDetails?: { eventType: string; dresscode: string; description: string }
      styleDescription?: string
      styleImageUrls?: string[]
      userProfile?: {
        ageGroup?: string
        styleGoals?: string[]
        imagePurpose?: string
      }
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: '请提供图片 URL' }, { status: 400 })
    }

    // ── Build user profile block (injected before JSON schema) ──────────────
    let profileBlock = ''

    if (userProfile && (userProfile.ageGroup || userProfile.imagePurpose || userProfile.styleGoals?.length)) {
      const lines: string[] = ['【用户个人信息 — 以下信息必须贯穿整份分析报告】']
      if (userProfile.ageGroup) {
        lines.push(`· 年龄段：${userProfile.ageGroup} → outfitRecs 和 occasions 的单品推荐必须适合该年龄层`)
      }
      if (userProfile.imagePurpose) {
        lines.push(`· 改变形象的目的：${userProfile.imagePurpose} → occasions 中与该目的最匹配的场合要最详细`)
      }
      if (userProfile.styleGoals?.length) {
        lines.push(`· 期望的风格方向：${userProfile.styleGoals.join('、')}`)
        lines.push(`  → 必须在 style.styleGoalFeedbacks 数组中对每个风格逐一评估，格式如下：`)
        lines.push(`    fit: "perfect"（脸型/季型/身材高度契合）| "partial"（部分元素可用，需选择性融合）| "conflict"（与核心特征有冲突）`)
        lines.push(`    fitLabel: "非常适合" | "可以融合" | "有些冲突"（与 fit 对应）`)
        lines.push(`    reason: 40字以内，具体说明脸型/季型/身材哪些特征导致这个判断`)
        lines.push(`    tip: 40字以内，适合时给最佳实践，不适合时给可行的折中方案（如：保留某风格的色系，但换掉某类廓形）`)
        lines.push(`  → style.primaryStyle 从以上方向中选 fit 最好的，或融合多个；outfitFormula 体现该风格`)
      }
      lines.push('以上用户信息优先级高于通用建议。')
      profileBlock += lines.join('\n')
    }

    if (styleDescription?.trim()) {
      profileBlock += `\n\n【用户风格偏好自述】\n用户本人描述："${styleDescription.trim()}"\n请在判断穿搭风格、场合建议和穿搭公式时，充分参考以上自述。`
    }
    if (styleImageUrls && styleImageUrls.length > 0) {
      profileBlock += `\n\n【额外参考图说明】\n用户提供了 ${styleImageUrls.length} 张日常穿搭/风格参考图（已在本条消息中作为额外图片发送）。请综合分析这些参考图中的风格偏好、色彩倾向和单品选择。`
    }

    // ── Mode-specific addon (also injected before JSON schema) ──────────────
    let modeAddon = ''
    const mode: AnalysisMode = analysisMode ?? 'standard'

    if (mode === 'daily-upgrade') {
      modeAddon = MODE_DAILY_UPGRADE_ADDON
    } else if (mode === 'explore-styles') {
      modeAddon = MODE_EXPLORE_STYLES_ADDON
    } else if (mode === 'special-occasion' && occasionDetails) {
      modeAddon = MODE_SPECIAL_OCCASION_ADDON(occasionDetails)
    }

    // ── Build final prompt ───────────────────────────────────────────────────
    const basePrompt = photoType === 'full' ? ANALYSIS_PROMPT : ANALYSIS_PROMPT_FACE_ONLY
    const injection = [profileBlock, modeAddon].filter(Boolean).join('\n\n')

    let prompt: string
    const jsonMarker = '请严格按照以下JSON格式返回'
    if (injection && basePrompt.includes(jsonMarker)) {
      prompt = basePrompt.replace(jsonMarker, injection + '\n\n' + jsonMarker)
    } else {
      prompt = basePrompt + (injection ? '\n\n' + injection : '')
    }

    // ── All image URLs for this request ─────────────────────────────────────
    // Order: portrait → current outfit refs → style refs
    const extraImageUrls = [
      ...(currentOutfitUrls ?? []).slice(0, 3),
      ...(styleImageUrls ?? []).slice(0, 2),
    ]

    const rawText = await callQwenVL(imageUrl, prompt, extraImageUrls.length ? extraImageUrls : undefined)

    // Check if Qwen refused (non-face image)
    if (
      rawText.includes('无法') ||
      rawText.includes('抱歉') ||
      rawText.includes('不包含人脸') ||
      rawText.includes('无法识别人脸')
    ) {
      return NextResponse.json(
        { error: '请上传包含人脸的清晰照片' },
        { status: 422 }
      )
    }

    const result = parseAnalysisResult(rawText)

    // ── Override color swatches with hardcoded season palettes ───────────────
    // Qwen often hallucinates hex values. We let it determine the SEASON only,
    // then replace bestColors/avoidColors/coloringPrinciple with our curated data.
    const detectedSeason = result.colorSeason?.season
    if (detectedSeason && SEASON_PALETTES[detectedSeason]) {
      const palette = SEASON_PALETTES[detectedSeason]
      result.colorSeason.bestColors = palette.bestColors
      result.colorSeason.avoidColors = palette.avoidColors
      result.colorSeason.coloringPrinciple = palette.coloringPrinciple

      // Also fix occasion color dots: replace Qwen's hallucinated hex values
      // with actual colors from the season palette, cycling through best colors
      if (result.occasions?.length) {
        result.occasions = result.occasions.map((occ, i) => ({
          ...occ,
          colors: palette.bestColors
            .slice(i % 2 === 0 ? 0 : 1, (i % 2 === 0 ? 0 : 1) + 3)
            .map((c) => c.hex),
        }))
      }
    }

    // Force clear bodyShape for face-only photos
    if (photoType !== 'full') {
      result.bodyShape = {
        bodyShape: '',
        description: '',
        silhouetteRecs: [],
        avoidSilhouettes: [],
        expertTip: '',
      }
    }

    // Attach mode to result so the results page knows how to display
    result.analysisMode = mode

    return NextResponse.json({ result })
  } catch (err) {
    if (err instanceof ParseError) {
      return NextResponse.json({ error: err.message }, { status: 422 })
    }
    // Distinguish timeout from other errors so client can retry intelligently
    if (err instanceof Error && err.message === 'TIMEOUT') {
      return NextResponse.json(
        { error: 'AI_TIMEOUT', retryable: true },
        { status: 504 }
      )
    }
    console.error('Analyze route error:', err)
    return NextResponse.json(
      { error: 'AI 分析失败，请重试', retryable: true },
      { status: 500 }
    )
  }
}
