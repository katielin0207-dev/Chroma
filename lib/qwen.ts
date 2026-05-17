const QWEN_API_URL =
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

export const ANALYSIS_PROMPT = `你是一位专业的个人形象顾问，拥有色彩季型分析、脸型分析和穿搭风格建议的专业知识。

请分析这张照片中人物的：
1. 脸型（鹅蛋脸/圆脸/方脸/心形脸/菱形脸/长脸）
2. 色彩季型（基于Carol Jackson十二季型体系：暖春/亮春/浅春/暖秋/深秋/柔秋/冷夏/浅夏/柔夏/冷冬/深冬/亮冬）
3. 身材类型（纤细型/H型/A型梨型/X型沙漏/O型/V型倒三角）
4. 穿搭风格（知性风/清冷风/元气风/御姐风/甜美风/简约风）
5. 场合穿搭建议

请严格按照以下JSON格式返回，不要包含任何JSON以外的文字：

{
  "faceShape": {
    "faceShape": "脸型名称",
    "characteristics": ["特征1", "特征2", "特征3"],
    "hairstyleRecs": ["发型建议1", "发型建议2", "发型建议3"],
    "necklineRecs": [
      {"name": "领型名称", "why": "为什么适合（10字以内）"},
      {"name": "领型名称", "why": "为什么适合（10字以内）"},
      {"name": "领型名称", "why": "为什么适合（10字以内）"}
    ]
  },
  "colorSeason": {
    "season": "季型名称（如：暖秋型）",
    "description": "色彩季型描述（50字以内，说明色温/明度/纯度特征）",
    "bestColors": [
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "适用场合"}
    ],
    "avoidColors": [
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "为何避免"},
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "为何避免"},
      {"name": "颜色名称", "hex": "#RRGGBB", "usage": "为何避免"}
    ],
    "coloringPrinciple": "核心搭配原则（25字以内，具体的搭配逻辑）"
  },
  "bodyShape": {
    "bodyShape": "身材类型名称",
    "description": "身材特征描述（30字以内）",
    "silhouetteRecs": ["推荐廓形1", "推荐廓形2", "推荐廓形3", "推荐廓形4", "推荐廓形5"],
    "avoidSilhouettes": ["避免廓形1", "避免廓形2", "避免廓形3", "避免廓形4"],
    "expertTip": "专业提示（25字以内）"
  },
  "style": {
    "primaryStyle": "主风格名称",
    "styleKeywords": ["关键词1", "关键词2", "关键词3", "关键词4"],
    "outfitRecs": ["单品推荐1", "单品推荐2", "单品推荐3"],
    "brandInspirations": ["品牌灵感1", "品牌灵感2"],
    "outfitFormula": {
      "top": "上衣廓形建议",
      "bottom": "下装廓形建议",
      "material": "材质方向",
      "accessory": "配饰点睛"
    },
    "whyItSuitsYou": "为什么适合你（30字以内，说明季型+脸型+气质的逻辑推导）"
  },
  "occasions": [
    {
      "occasion": "职场",
      "outfit": "具体的穿搭组合（三件单品）",
      "colors": ["#RRGGBB", "#RRGGBB", "#RRGGBB"],
      "tips": "穿搭小贴士",
      "logic": "搭配逻辑（25字以内，说明为何这个组合适合你的类型）"
    },
    {
      "occasion": "约会",
      "outfit": "具体的穿搭组合",
      "colors": ["#RRGGBB", "#RRGGBB"],
      "tips": "穿搭小贴士",
      "logic": "搭配逻辑（25字以内）"
    },
    {
      "occasion": "日常",
      "outfit": "具体的穿搭组合",
      "colors": ["#RRGGBB", "#RRGGBB", "#RRGGBB"],
      "tips": "穿搭小贴士",
      "logic": "搭配逻辑（25字以内）"
    }
  ]
}`

export const OOTD_PROMPT_TEMPLATE = (
  userProfile: { season: string; faceShape: string; bodyShape: string },
  itemCount: number
) => `你是一位专业的个人形象顾问。

用户信息：
- 色彩季型：${userProfile.season}
- 脸型：${userProfile.faceShape}
- 身材类型：${userProfile.bodyShape}

请分析用户上传的第一件衣物（共${itemCount}件中的当前这件）是否适合该用户。

请严格按照以下JSON格式返回，不要包含任何JSON以外的文字：

{
  "itemName": "衣物名称（颜色+款式，如：砖红针织外套）",
  "isCompatible": true或false,
  "reason": "诊断理由（30字以内，具体说明是否与季型/脸型/身材匹配）",
  "alternativeSuggestion": "仅在isCompatible为false时填写，替代建议（20字以内）"
}`

export async function callQwenVL(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const apiKey = process.env.QWEN_API_KEY
  if (!apiKey) throw new Error('QWEN_API_KEY 未配置')

  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'qwen-vl-plus',
      input: {
        messages: [
          {
            role: 'user',
            content: [
              { image: imageUrl },
              { text: prompt },
            ],
          },
        ],
      },
      parameters: { result_format: 'message' },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Qwen API 错误: ${response.status} ${err}`)
  }

  const data = await response.json()
  const content = data?.output?.choices?.[0]?.message?.content

  if (Array.isArray(content)) {
    return content.map((c: { text?: string }) => c.text ?? '').join('')
  }
  if (typeof content === 'string') return content

  throw new Error('Qwen API 返回格式异常')
}
