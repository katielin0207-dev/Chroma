const QWEN_API_URL =
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

// Carol Jackson 十二色彩季型 — 每个季型的硬性规则
// 用于 OOTD 严格匹配，避免出现"暖秋型适合深蓝"这种矛盾
const SEASON_RULES: Record<string, { temp: string; can: string; cannot: string }> = {
  '暖春型': { temp: '暖', can: '暖黄、珊瑚橘、嫩绿、桃粉、暖米、奶油白', cannot: '纯蓝、海军蓝、冷紫、冷粉、银灰、纯黑、薰衣草紫' },
  '亮春型': { temp: '暖偏中', can: '纯红、宝蓝、鲜亮黄、亮翠绿、桃粉', cannot: '浊色、灰调、深沉色、莫兰迪色' },
  '浅春型': { temp: '暖', can: '奶油白、浅杏、浅卡其、浅桃粉、浅黄', cannot: '深浓色、纯黑、深酒红、墨绿' },
  '暖秋型': { temp: '暖', can: '驼色、焦糖、橄榄绿、砖红、芥末黄、深棕、卡其', cannot: '纯蓝、海军蓝、冷紫、冷粉、纯黑、冷灰、薰衣草紫、宝蓝、玫红' },
  '深秋型': { temp: '暖', can: '深棕、墨绿、深酒红、咖啡色、巧克力色、深橄榄', cannot: '浅淡色、粉嫩色、冷调浅色、薰衣草紫' },
  '柔秋型': { temp: '暖偏中', can: '莫兰迪驼色、雾灰、柔棕、雾绿、烟玫瑰', cannot: '高饱和色、纯黑、纯白、荧光色' },
  '冷夏型': { temp: '冷', can: '薰衣草紫、雾蓝、雾粉、烟灰、藕粉', cannot: '暖橘、驼色、芥末黄、橄榄绿、砖红、焦糖' },
  '浅夏型': { temp: '冷', can: '浅蓝、浅粉、白色、浅灰、浅薰衣草', cannot: '深浓色、暖调色、纯黑、暖橘、驼色' },
  '柔夏型': { temp: '中性偏冷', can: '莫兰迪蓝、灰紫、雾粉、雾蓝灰、烟蓝', cannot: '高饱和色、暖调色、橙色、芥末黄' },
  '冷冬型': { temp: '冷', can: '纯黑、纯白、宝蓝、深紫、正红、玫红、海军蓝', cannot: '驼色、橙黄、暖棕、米黄、芥末黄、橄榄绿' },
  '深冬型': { temp: '冷', can: '黑色、深宝蓝、深紫、墨绿、酒红、纯白', cannot: '浅淡色、暖驼色、芥末黄、米黄' },
  '亮冬型': { temp: '冷', can: '宝蓝、宝石绿、玫红、纯白、纯黑、电光蓝', cannot: '浊色、暖调色、莫兰迪色、驼色' },
}

const COLOR_RULE = `颜色规则：只使用市面上服装品牌（Zara、H&M、优衣库、COS等）实际有售的常见颜色，例如：米白、象牙白、奶油白、浅卡其、深卡其、驼色、焦糖色、砖红、橘红、裸粉、玫瑰粉、薰衣草紫、宝蓝、海军蓝、牛仔蓝、橄榄绿、墨绿、烟灰、炭灰、浅灰、黑色、棕色、巧克力色等。禁止使用荧光色或过于小众的颜色。hex值必须准确（如驼色#C19A6B、砖红#B7410E、宝蓝#0047AB、橄榄绿#708238、烟灰#848482、海军蓝#1F2A44）。`

const SEASON_GUIDE = `【色彩季型判断指南】基于Carol Jackson十二季型体系，从三个维度交叉判断：
- 色温（temperature）：暖（黄底）/ 冷（蓝底）/ 中性
- 明度（brightness）：浅 / 中 / 深
- 纯度（saturation）：清（高饱和透亮）/ 柔（中等饱和柔和）/ 浊（低饱和灰调）

请仔细观察照片中人物的：肤色底调（是偏黄/橄榄/粉/玫瑰）、眼睛颜色深浅、头发颜色、整体气质明暗对比。
不要被妆容/滤镜干扰，要识别真实的肤色底调。如果不确定色温，倾向于判断为"中性"偏向更明显的那一边。`

const SHARED_JSON_TAIL = `  "style": {
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
      "outfit": "具体的穿搭组合（三件常见单品，用颜色+款式描述）",
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

const COLOR_SEASON_SCHEMA = `"colorSeason": {
    "season": "季型名称（如：暖秋型）",
    "description": "色彩季型描述（50字以内，说明色温/明度/纯度特征）",
    "dimensions": {
      "temperature": "暖 / 冷 / 中性（必须三选一）",
      "brightness": "浅 / 中 / 深（必须三选一）",
      "saturation": "清 / 柔 / 浊（必须三选一）"
    },
    "bestColors": [
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "适用场合"},
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "适用场合"}
    ],
    "avoidColors": [
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "为何避免"},
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "为何避免"},
      {"name": "常见颜色名", "hex": "#RRGGBB", "usage": "为何避免"}
    ],
    "coloringPrinciple": "核心搭配原则（25字以内，具体的搭配逻辑）"
  }`

export const ANALYSIS_PROMPT_FACE_ONLY = `你是一位严格的Carol Jackson色彩季型分析师。

这是一张脸部/半身照片，请分析：
1. 脸型（鹅蛋脸/圆脸/方脸/心形脸/菱形脸/长脸）
2. 色彩季型（必须从这12个中选一个：暖春型/亮春型/浅春型/暖秋型/深秋型/柔秋型/冷夏型/浅夏型/柔夏型/冷冬型/深冬型/亮冬型）
3. 穿搭风格（知性风/清冷风/元气风/御姐风/甜美风/简约风）
4. 场合穿搭建议

${SEASON_GUIDE}

${COLOR_RULE}

【关键】bestColors 和 avoidColors 必须与判定的季型严格一致：
- 暖色季型（暖春/亮春/浅春/暖秋/深秋/柔秋）：bestColors只能是暖色，avoidColors必须包含纯蓝/冷紫/冷粉
- 冷色季型（冷夏/浅夏/柔夏/冷冬/深冬/亮冬）：bestColors只能是冷色，avoidColors必须包含驼色/橙黄/暖棕

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
    ],
    "avoidNecklineRecs": [
      {"name": "领型名称", "why": "为什么不适合（10字以内）"},
      {"name": "领型名称", "why": "为什么不适合（10字以内）"}
    ]
  },
  ${COLOR_SEASON_SCHEMA},
  "bodyShape": {
    "bodyShape": "",
    "description": "",
    "silhouetteRecs": [],
    "avoidSilhouettes": [],
    "expertTip": ""
  },
  ${SHARED_JSON_TAIL}
}`

export const ANALYSIS_PROMPT = `你是一位严格的Carol Jackson色彩季型分析师。

这是一张全身照片，请分析：
1. 脸型（鹅蛋脸/圆脸/方脸/心形脸/菱形脸/长脸）
2. 色彩季型（必须从这12个中选一个：暖春型/亮春型/浅春型/暖秋型/深秋型/柔秋型/冷夏型/浅夏型/柔夏型/冷冬型/深冬型/亮冬型）
3. 身材类型（纤细型/H型/A型梨型/X型沙漏/O型/V型倒三角）
4. 穿搭风格（知性风/清冷风/元气风/御姐风/甜美风/简约风）
5. 场合穿搭建议

${SEASON_GUIDE}

${COLOR_RULE}

【关键】bestColors 和 avoidColors 必须与判定的季型严格一致：
- 暖色季型：bestColors只能是暖色，avoidColors必须包含冷色（纯蓝/冷紫/冷粉）
- 冷色季型：bestColors只能是冷色，avoidColors必须包含暖色（驼色/橙黄/暖棕）

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
    ],
    "avoidNecklineRecs": [
      {"name": "领型名称", "why": "为什么不适合（10字以内）"},
      {"name": "领型名称", "why": "为什么不适合（10字以内）"}
    ]
  },
  ${COLOR_SEASON_SCHEMA},
  "bodyShape": {
    "bodyShape": "身材类型名称",
    "description": "身材特征描述（30字以内）",
    "silhouetteRecs": ["推荐廓形1", "推荐廓形2", "推荐廓形3", "推荐廓形4", "推荐廓形5"],
    "avoidSilhouettes": ["避免廓形1", "避免廓形2", "避免廓形3", "避免廓形4"],
    "expertTip": "专业提示（25字以内）"
  },
  ${SHARED_JSON_TAIL}
}`

// 中性色 — 任何季型都可以穿（rating: "ok"）
// 黑白灰在色彩理论中属于无彩色，虽非最优，但无明显冲突
const UNIVERSAL_NEUTRALS = '黑色、纯白、浅灰、中灰、炭灰、深灰、米白（接近白色的极浅米）'

// OOTD 单品三档诊断：最适合 / 可以穿 / 不建议
export const OOTD_PROMPT_TEMPLATE = (
  userProfile: { season: string; faceShape: string; bodyShape: string },
  itemCount: number
) => {
  const rules = SEASON_RULES[userProfile.season] || {
    temp: '未知',
    can: '依据该季型理论判断',
    cannot: '与该季型色温相反的颜色',
  }
  return `你是 Carol Jackson 十二色彩季型顾问，给出专业且实用的三档判断。

【用户色彩季型】${userProfile.season}
【季型色温】${rules.temp}调
【最适合的颜色】${rules.can}
【不建议的颜色】${rules.cannot}
【任何季型均可穿的中性色】${UNIVERSAL_NEUTRALS}

【三档判断标准 — 必须严格执行】
- rating: "best" → 颜色在"最适合"清单内，与季型完美契合
- rating: "ok"   → 颜色是上方"中性色"之一（黑白灰等无彩色），不冲突但非最优
- rating: "avoid"→ 颜色在"不建议"清单内，与季型色温明确冲突

【判断步骤】
1. 识别衣物主色名称
2. 判断是否属于中性色（黑/白/灰）→ 如是，rating = "ok"
3. 否则，对比季型的适合/不建议清单 → 判定 "best" 或 "avoid"
4. 色温相反的颜色（暖季型遇冷色、冷季型遇暖色）→ 必须 "avoid"

【reason 写法要求】
- "best"：说明为何与季型契合（如：暖调砖红与你的暖秋肤底完美呼应）
- "ok"：说明是中性色可穿，但提示季型色会更加分（如：黑色属中性色可穿，但你的柔夏型穿雾蓝灰会更提气色）
- "avoid"：说明色温冲突（如：冷调宝蓝与你的暖秋底调相斥，会让肤色显暗）

【次要参考】脸型：${userProfile.faceShape} / 身材：${userProfile.bodyShape || '未提供'} / 共 ${itemCount} 件

请严格按以下JSON返回，不要包含任何JSON以外的文字：

{
  "itemName": "衣物名称（颜色+款式，如：宝蓝棉麻衬衫）",
  "rating": "best" 或 "ok" 或 "avoid",
  "reason": "诊断理由（40字以内）",
  "alternativeSuggestion": "仅 rating=avoid 时填写，推荐同款替代色（20字内）"
}`
}

export async function callQwenVL(
  imageUrl: string,
  prompt: string,
  /** Optional extra images (style refs, outfit photos). Max 2. */
  extraImageUrls?: string[]
): Promise<string> {
  const apiKey = process.env.QWEN_API_KEY
  if (!apiKey) throw new Error('QWEN_API_KEY 未配置')

  // Build the content array: main image first, then extra refs, then the prompt text
  const content: Array<{ image: string } | { text: string }> = [
    { image: imageUrl },
    ...(extraImageUrls ?? []).slice(0, 2).map((u) => ({ image: u })),
    { text: prompt },
  ]

  // Hard 27s timeout — fires before Vercel Edge's 30s wall-clock limit
  // so we get a clean error rather than a silent 504
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 27000)

  let response: Response
  try {
    response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-vl-plus',
        input: {
          messages: [{ role: 'user', content }],
        },
        parameters: { result_format: 'message' },
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('AI 分析超时，请重试（建议使用 WiFi 或减少参考图）')
    }
    throw err
  }
  clearTimeout(timeoutId)

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Qwen API 错误: ${response.status} ${err}`)
  }

  const data = await response.json()
  const responseContent = data?.output?.choices?.[0]?.message?.content

  if (Array.isArray(responseContent)) {
    return responseContent.map((c: { text?: string }) => c.text ?? '').join('')
  }
  if (typeof responseContent === 'string') return responseContent

  throw new Error('Qwen API 返回格式异常')
}
