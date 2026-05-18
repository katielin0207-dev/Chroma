import { NextRequest, NextResponse } from 'next/server'
import { callQwenVL, ANALYSIS_PROMPT, ANALYSIS_PROMPT_FACE_ONLY } from '@/lib/qwen'
import { parseAnalysisResult, ParseError } from '@/lib/parse-analysis'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, photoType } = await req.json()

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: '请提供图片 URL' }, { status: 400 })
    }

    const prompt = photoType === 'full' ? ANALYSIS_PROMPT : ANALYSIS_PROMPT_FACE_ONLY
    const rawText = await callQwenVL(imageUrl, prompt)

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

    // Force clear bodyShape for face-only photos (Qwen sometimes ignores the empty-schema hint)
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
