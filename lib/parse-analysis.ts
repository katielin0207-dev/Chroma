import { AnalysisResult } from '@/types/analysis'

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

export function parseAnalysisResult(text: string): AnalysisResult {
  // Attempt 1: direct JSON parse
  try {
    const parsed = JSON.parse(text)
    if (parsed && parsed.faceShape && parsed.colorSeason) {
      return parsed as AnalysisResult
    }
  } catch {}

  // Attempt 2: extract from ```json ... ``` fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim())
      if (parsed && parsed.faceShape && parsed.colorSeason) {
        return parsed as AnalysisResult
      }
    } catch {}
  }

  // Attempt 3: find first { ... } block
  const braceMatch = text.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try {
      const parsed = JSON.parse(braceMatch[0])
      if (parsed && parsed.faceShape && parsed.colorSeason) {
        return parsed as AnalysisResult
      }
    } catch {}
  }

  throw new ParseError('无法解析 AI 返回的分析结果，请重试')
}
