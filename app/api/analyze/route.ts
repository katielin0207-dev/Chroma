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
        lines.push(`· 期望的风格方向：${userProfile.styleGoals.join('、')} → style.primaryStyle 必须从以上方向选择或融合；whyItSuitsYou 要结合用户目标；outfitFormula 要体现该风格`)
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
    console.error('Analyze route error:', err)
    return NextResponse.json({ error: 'AI 分析失败，请重试' }, { status: 500 })
  }
}
