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

const SEASON_GUIDE = `【色彩季型判断 — 请按以下步骤推理，最终选出最匹配的一个季型】

步骤1 · 判断色温（最重要，决定春秋 vs 夏冬）
  观察颈部/下颌未被妆容遮盖的皮肤：
  → 偏黄调、蜜色、橄榄色、桃黄色 = 暖调（春型或秋型）
  → 偏粉调、玫瑰色、偏白/冷象牙 = 冷调（夏型或冬型）
  → 难以判断时：看静脉颜色（如能看到）蓝绿=冷，蓝紫=暖

步骤2 · 判断明度对比（决定型内分类）
  看肤色、头发、眼睛三者整体对比强弱：
  → 对比度强（黑发+白皮，或深发+浅肤明显不同）= 深型或亮型
  → 对比度弱（发色肤色接近，整体柔和）= 浅型或柔型
  → 对比度中等 = 标准型

步骤3 · 判断纯度/清浊（细化分型）
  看整体气质和肤色质感：
  → 清透明亮，眼神有神，整体有光感 = 清型（春/亮冬）
  → 柔和雾感，轮廓柔，整体有"朦胧感" = 柔型（柔秋/柔夏）
  → 沉稳厚重，肤色深，整体色彩饱满 = 深型（深秋/深冬）

步骤4 · 对照特征选出季型：
  暖春型：肤色亮黄调、清透、中等对比度，穿橘/桃粉显气色
  亮春型：肤色中等暖调、眼神清亮、颜色对比鲜明，穿纯色提气
  浅春型：肤色浅暖米黄，轻柔整体感，穿深色显重
  暖秋型：肤色黄/橄榄/金褐调、整体偏沉，穿驼色/砖红最和谐
  深秋型：肤色深暖、发色深棕或黑棕、整体深沉厚重
  柔秋型：肤色中等暖调偏浊，轮廓柔和，穿莫兰迪色最和谐
  冷夏型：肤色偏粉/玫瑰调，整体柔和冷感，穿薰衣草/藕粉最提气
  浅夏型：肤色浅粉白或冷象牙，轻柔，穿深色显重
  柔夏型：肤色中等冷调偏灰，柔和，穿莫兰迪蓝/灰紫最和谐
  冷冬型：肤色偏粉白/冷白、对比度强、眼神清冷，穿黑白+玫红最提气
  深冬型：肤色深冷，发色深，整体深邃有对比度，穿黑+深蓝最有力量
  亮冬型：肤色中等冷调、清透明亮、颜色对比明显，穿宝蓝/玫红最惊艳

⚠️ 重要提醒：不要被妆容/美颜滤镜干扰，要识别皮肤本身的底调。中国女性中暖秋型和冷夏型最常见。`

const SHARED_JSON_TAIL = `  "style": {
    "primaryStyle": "主风格名称（如：都市知性风 / 法式温柔风 / 帅气中性风）",
    "styleKeywords": ["关键词1（如：高级感）", "关键词2（如：精致利落）", "关键词3", "关键词4"],
    "outfitRecs": [
      "单品1：颜色+款式+搭配建议，例：驼色羊绒V领针织衫，搭深棕直筒裤",
      "单品2：颜色+款式，例：砖红A字半裙，搭奶白衬衫",
      "单品3：颜色+款式，例：橄榄绿风衣，内搭芥末黄针织"
    ],
    "brandInspirations": ["国内品牌（如：ICICLE之禾 / CROQUIS速写）", "国际品牌（如：COS / Massimo Dutti）"],
    "outfitFormula": {
      "top": "上衣廓形建议（如：宽松oversize / 收腰合体 / 略宽松H型）",
      "bottom": "下装廓形建议（如：高腰直筒 / A字裙 / 微喇裤）",
      "material": "材质方向（如：羊绒/棉麻/真丝 — 哑光质感优先）",
      "accessory": "配饰点睛（如：金色细链 / 暖棕皮带 / 简约耳钉）"
    },
    "whyItSuitsYou": "为什么适合你（35字以内，必须包含季型名称，说明颜色+廓形+气质的逻辑，例：暖秋型的黄调肤底与驼色天然共鸣，V领拉长脸型比例，整体呈现知性成熟气场）"
  },
  "occasions": [
    {
      "occasion": "职场",
      "outfit": "三件具体单品：颜色+款式+材质，形成完整LOOK（例：驼色羊绒针织衫+深棕高腰直筒裤+棕色小皮鞋）",
      "colors": ["季型推荐色hex1", "季型推荐色hex2", "季型推荐色hex3"],
      "tips": "一个具体的穿搭技巧（例：在领口加一条金色细链，打破商务感增添女人味）",
      "logic": "搭配逻辑（25字以内，说明颜色选择与季型的关联，例：驼色+深棕同色系叠加，完美呼应暖秋型大地调）"
    },
    {
      "occasion": "约会",
      "outfit": "三件具体单品：颜色+款式，形成完整LOOK",
      "colors": ["季型推荐色hex1", "季型推荐色hex2"],
      "tips": "一个具体的穿搭技巧",
      "logic": "搭配逻辑（25字以内）"
    },
    {
      "occasion": "日常休闲",
      "outfit": "三件具体单品：颜色+款式，形成完整LOOK",
      "colors": ["季型推荐色hex1", "季型推荐色hex2", "季型推荐色hex3"],
      "tips": "一个具体的穿搭技巧",
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

// ── Mode-specific prompt addons ──────────────────────────────────────────────
// Each addon is injected BEFORE the JSON schema so Qwen respects it

/** 日常穿搭升级：对用户现有穿搭给保留/调整/替换建议 */
export const MODE_DAILY_UPGRADE_ADDON = `
【模式：日常穿搭升级】
用户上传了自己目前的穿搭照片作为参考。请在完成标准分析后，在 JSON 末尾额外输出 "wardrobeAdvice" 字段，对照用户季型/脸型/身材，分析用户现有穿搭：
"wardrobeAdvice": {
  "keep": ["值得保留的具体单品/颜色/风格元素，说明为什么适合她的类型"],
  "adjust": ["稍作调整就能更好的部分，给出具体改法（如：换掉冷调蓝改为暖棕色同款）"],
  "replace": ["与季型/脸型明显冲突的单品，说明冲突原因和替换方向"],
  "summary": "整体升级思路（50字以内，正向引导，给出最简单有效的一步改变）"
}
注意：keep/adjust/replace 每项至少 2 条，要具体（有颜色+款式描述），不要泛泛而谈。`

/** 尝试不同风格：基于脸型+身材推荐 3 种不同风格方向 */
export const MODE_EXPLORE_STYLES_ADDON = `
【模式：多风格探索】
用户想探索不同风格的可能性。请在完成标准分析后，在 JSON 末尾额外输出 "styleOptions" 数组，基于用户的脸型、色彩季型和身材，推荐 3 种截然不同但都适合她的风格方向：
"styleOptions": [
  {
    "name": "风格名称（如：都市知性风）",
    "tagline": "一句话描述该风格的核心气质（15字以内）",
    "keywords": ["关键词1", "关键词2", "关键词3"],
    "outfitFormula": {"top": "上衣廓形建议", "bottom": "下装廓形建议", "material": "材质方向", "accessory": "配饰点睛"},
    "outfitRecs": ["具体单品1（颜色+款式，可搜索）", "具体单品2", "具体单品3"],
    "whyItWorks": "为什么这个风格特别适合你（20字以内，结合脸型/季型/身材）"
  }
]
请确保 3 种风格差异明显（如：清冷职场风 vs 温柔法式风 vs 帅气中性风），每种都与用户的色彩季型和脸型相符。`

/** 为特殊场合准备：针对具体活动的完整着装方案 */
export const MODE_SPECIAL_OCCASION_ADDON = (details: {
  eventType: string
  dresscode: string
  description: string
}) => `
【模式：特殊场合准备】
场合信息：活动类型：${details.eventType} / 着装级别：${details.dresscode} / 用户描述："${details.description}"
请在完成标准分析后，在 JSON 末尾额外输出 "occasionAdvice" 字段，专门针对这个场合：
"occasionAdvice": {
  "eventType": "${details.eventType}",
  "mainOutfit": "主推穿搭（详细描述每件单品的颜色+款式+材质，形成完整LOOK）",
  "dresscode": "对这次场合着装规范的具体解读（结合用户季型）",
  "colorSuggestion": "针对该场合的颜色建议（结合用户季型说明为什么选这个颜色）",
  "colors": ["#RRGGBB", "#RRGGBB", "#RRGGBB"],
  "tips": ["注意点1（如：避免过于抢眼）", "注意点2", "注意点3"],
  "alternativeOption": "如果主推不适合，备选穿搭方案（简短描述）"
}
颜色必须与用户的色彩季型一致，不能与季型规则冲突。`

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
