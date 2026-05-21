import { NextRequest, NextResponse } from 'next/server'
import { callQwenVL, ANALYSIS_PROMPT, ANALYSIS_PROMPT_FACE_ONLY } from '@/lib/qwen'
import { parseAnalysisResult, ParseError } from '@/lib/parse-analysis'

// Edge runtime: 30s timeout even on Vercel Hobby (vs 10s serverless limit)
// Qwen VL typically takes 15–25s — serverless was silently timing out at 10s
export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, photoType, styleDescription, styleImageUrls, userProfile } = await req.json() as {
      imageUrl: string
      photoType?: string
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

    // Build user profile context block — injected BEFORE the JSON schema
    // so Qwen reads it as constraints when generating each field
    let profileBlock = ''
    if (userProfile && (userProfile.ageGroup || userProfile.imagePurpose || userProfile.styleGoals?.length)) {
      const lines: string[] = ['【用户个人信息 — 以下信息必须贯穿整份分析报告】']
      if (userProfile.ageGroup) {
        lines.push(`· 年龄段：${userProfile.ageGroup} → outfitRecs 和 occasions 的单品推荐必须适合该年龄层（避免过于学生气或过于老气的款式）`)
      }
      if (userProfile.imagePurpose) {
        lines.push(`· 改变形象的目的：${userProfile.imagePurpose} → occasions 数组中与该目的最匹配的场合描述要最详细，logic 字段要说明与该目的的关联`)
      }
      if (userProfile.styleGoals?.length) {
        lines.push(`· 期望的风格方向：${userProfile.styleGoals.join('、')} → style.primaryStyle 必须从以上方向中选择或融合；style.whyItSuitsYou 要结合用户目标解释为什么适合；outfitFormula 的廓形和材质方向要体现该风格`)
      }
      lines.push('以上用户信息优先级高于通用建议，请确保每一条输出都与用户的形象目标高度相关。')
      profileBlock = lines.join('\n')
    }

    if (styleDescription?.trim()) {
      profileBlock += `\n\n【用户风格偏好自述】\n用户本人描述："${styleDescription.trim()}"\n请在判断穿搭风格、场合建议和穿搭公式时，充分参考以上自述，让结果更贴近用户的真实需求和性格。`
    }
    if (styleImageUrls && styleImageUrls.length > 0) {
      profileBlock += `\n\n【额外参考图说明】\n用户提供了 ${styleImageUrls.length} 张日常穿搭/风格参考图（已在本条消息中作为额外图片发送）。请综合分析这些参考图中的风格偏好、色彩倾向和单品选择，让风格建议更个性化。`
    }

    // Build the base prompt — inject profile block BEFORE the JSON schema section
    const basePrompt = photoType === 'full' ? ANALYSIS_PROMPT : ANALYSIS_PROMPT_FACE_ONLY
    // Insert profile context just before "请严格按照以下JSON格式返回"
    const jsonMarker = '请严格按照以下JSON格式返回'
    let prompt: string
    if (profileBlock && basePrompt.includes(jsonMarker)) {
      prompt = basePrompt.replace(jsonMarker, profileBlock + '\n\n' + jsonMarker)
    } else {
      prompt = basePrompt + (profileBlock ? '\n\n' + profileBlock : '')
    }

    const rawText = await callQwenVL(imageUrl, prompt, styleImageUrls)

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

    return NextResponse.json({ result })
  } catch (err) {
    if (err instanceof ParseError) {
      return NextResponse.json({ error: err.message }, { status: 422 })
    }
    console.error('Analyze route error:', err)
    return NextResponse.json({ error: 'AI 分析失败，请重试' }, { status: 500 })
  }
}
