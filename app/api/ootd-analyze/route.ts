import { NextRequest, NextResponse } from 'next/server'
import { callQwenVL, OOTD_PROMPT_TEMPLATE } from '@/lib/qwen'
import { OOTDItem, OOTDSet } from '@/types/analysis'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { clothingImageUrls, userProfile } = await req.json() as {
      clothingImageUrls: string[]
      userProfile: { season: string; faceShape: string; bodyShape: string }
    }

    if (!clothingImageUrls?.length || clothingImageUrls.length > 6) {
      return NextResponse.json(
        { error: '请上传 1–6 件单品图片' },
        { status: 400 }
      )
    }

    // Analyze each item individually
    const itemResults: OOTDItem[] = await Promise.all(
      clothingImageUrls.map(async (url) => {
        const prompt = OOTD_PROMPT_TEMPLATE(userProfile, clothingImageUrls.length)
        const raw = await callQwenVL(url, prompt)

        // Extract JSON
        let parsed: Omit<OOTDItem, 'imageUrl'>
        try {
          const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
          const brace = raw.match(/\{[\s\S]*\}/)
          const json = fence?.[1]?.trim() ?? brace?.[0] ?? raw
          parsed = JSON.parse(json)
        } catch {
          parsed = {
            itemName: '未知单品',
            isCompatible: false,
            reason: '无法解析 AI 返回结果',
          }
        }

        return { imageUrl: url, ...parsed }
      })
    )

    // Build an OOTD set from compatible items
    let ootdSet: OOTDSet | undefined
    const compatible = itemResults.filter((i) => i.isCompatible)
    if (compatible.length >= 2) {
      const names = compatible.map((i) => i.itemName).join(' + ')
      const colors = compatible
        .flatMap(() => ['#C8A060', '#F0EBE0', '#503820'])
        .slice(0, compatible.length + 1)

      ootdSet = {
        items: compatible,
        completeOutfit: names,
        outfitLogic: `以上${compatible.length}件均与你的${userProfile.season}匹配，色调协调可直接搭配穿着`,
        colorDots: colors,
      }
    }

    return NextResponse.json({ itemResults, ootdSet })
  } catch (err) {
    console.error('OOTD analyze error:', err)
    return NextResponse.json({ error: 'AI 诊断失败，请重试' }, { status: 500 })
  }
}
