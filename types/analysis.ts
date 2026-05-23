export interface ColorSwatch {
  name: string
  hex: string
  usage: string
}

export interface NecklineRec {
  name: string
  why: string
}

export interface FaceShapeAnalysis {
  faceShape: string
  characteristics: string[]
  hairstyleRecs: string[]
  necklineRecs: NecklineRec[]
  avoidNecklineRecs?: NecklineRec[]
}

export interface ColorDimensions {
  temperature: string  // 暖 / 冷 / 中性
  brightness: string   // 浅 / 中 / 深
  saturation: string   // 清 / 柔 / 浊
}

export interface ColorSeasonAnalysis {
  season: string
  description: string
  dimensions?: ColorDimensions
  bestColors: ColorSwatch[]
  avoidColors: ColorSwatch[]
  coloringPrinciple: string
}

export interface OutfitFormula {
  top: string
  bottom: string
  material: string
  accessory: string
}

export interface StyleAnalysis {
  primaryStyle: string
  styleKeywords: string[]
  outfitRecs: string[]
  brandInspirations: string[]
  outfitFormula: OutfitFormula
  whyItSuitsYou: string
}

export interface OccasionSet {
  occasion: string
  outfit: string
  colors: string[]
  tips: string
  logic: string
}

export interface BodyShapeAnalysis {
  bodyShape: string
  description: string
  silhouetteRecs: string[]
  avoidSilhouettes: string[]
  expertTip: string
}

// ── Mode-specific result types ────────────────────────────────────────────────

export type AnalysisMode = 'standard' | 'daily-upgrade' | 'explore-styles' | 'special-occasion'

/** 日常穿搭升级 — 对用户上传的现有穿搭给出保留/调整/替换建议 */
export interface WardrobeAdvice {
  keep: string[]    // 值得保留的单品/颜色/元素
  adjust: string[]  // 稍作调整就能更好的部分
  replace: string[] // 建议替换，并说明方向
  summary: string   // 整体升级思路（50字以内）
}

/** 尝试不同风格 — 推荐 3 种截然不同但都适合的风格方向 */
export interface StyleOption {
  name: string
  tagline: string          // 一句话气质描述
  keywords: string[]
  outfitFormula: OutfitFormula
  outfitRecs: string[]     // 具体单品关键词（可复制搜索）
  whyItWorks: string       // 为什么适合你（20字以内）
}

/** 为特殊场合准备 — 针对具体活动的完整着装方案 */
export interface OccasionAdvice {
  eventType: string
  mainOutfit: string       // 主推穿搭（详细描述每件单品）
  dresscode: string        // 着装规范解读
  colorSuggestion: string  // 结合季型的颜色建议
  colors: string[]         // hex 色值
  tips: string[]           // 注意事项
  alternativeOption: string // 备选方案
}

// ── Core result ───────────────────────────────────────────────────────────────

export interface AnalysisResult {
  faceShape: FaceShapeAnalysis
  colorSeason: ColorSeasonAnalysis
  style: StyleAnalysis
  bodyShape: BodyShapeAnalysis
  occasions: OccasionSet[]
  // Mode-specific fields (only present when relevant mode was used)
  analysisMode?: AnalysisMode
  wardrobeAdvice?: WardrobeAdvice
  styleOptions?: StyleOption[]
  occasionAdvice?: OccasionAdvice
}

// ── OOTD types ────────────────────────────────────────────────────────────────

/** 三档判断：最适合 / 可以穿 / 不建议 */
export type OOTDRating = 'best' | 'ok' | 'avoid'

export interface OOTDItem {
  imageUrl: string
  itemName: string
  /** @deprecated use rating */
  isCompatible?: boolean
  rating: OOTDRating
  reason: string
  alternativeSuggestion?: string
}

export interface OOTDSet {
  items: OOTDItem[]
  completeOutfit: string
  outfitLogic: string
  colorDots: string[]
}

export interface OOTDAnalysisResult {
  itemResults: OOTDItem[]
  ootdSet?: OOTDSet
}
