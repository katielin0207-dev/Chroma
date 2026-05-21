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

    // Build the base prompt
    let prompt = photoType === 'full' ? ANALYSIS_PROMPT : ANALYSIS_PROMPT_FACE_ONLY

    // Append user profile context first (highest priority for personalization)
    if (userProfile && (userProfile.ageGroup || userProfile.imagePurpose || userProfile.styleGoals?.length)) {
      const parts: string[] = []
      if (userProfile.ageGroup) parts.push(`年龄段：${userProfile.ageGroup}`)
      if (userProfile.imagePurpose) parts.push(`改变形象的目的：${userProfile.imagePurpose}`)
      if (userProfile.styleGoals?.length) parts.push(`期望的风格方向：${userProfile.styleGoals.join('、')}`)
      prompt += `\n\n【用户基本信息】\n${parts.join(' / ')}\n请在分析穿搭风格、场合建议、单品推荐和穿搭公式时，充分考虑用户的年龄段和形象目标，让建议更贴合其真实需求。`
    }

    // Append style context to the prompt if provided
    if (styleDescription?.trim()) {
      prompt += `\n\n【用户风格偏好自述】\n用户本人描述："${styleDescription.trim()}"\n请在判断穿搭风格、场合建议和穿搭公式时，充分参考以上自述，让结果更贴近用户的真实需求和性格。`
    }
    if (styleImageUrls && styleImageUrls.length > 0) {
      prompt += `\n\n【额外参考图说明】\n用户提供了 ${styleImageUrls.length} 张日常穿搭/风格参考图（已在本条消息中作为额外图片发送）。请综合分析这些参考图中的风格偏好、色彩倾向和单品选择，让风格建议更个性化。`
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
