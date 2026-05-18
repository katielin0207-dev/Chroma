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

export interface AnalysisResult {
  faceShape: FaceShapeAnalysis
  colorSeason: ColorSeasonAnalysis
  style: StyleAnalysis
  bodyShape: BodyShapeAnalysis
  occasions: OccasionSet[]
}

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
