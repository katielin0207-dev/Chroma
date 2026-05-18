'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  { label: '正在上传照片...', sub: '安全传输中' },
  { label: 'AI 正在分析...', sub: '' },
  { label: '生成专属报告...', sub: '即将完成' },
]

// Rotating sub-messages shown during the AI analysis step (step index 1)
const AI_STATUS = [
  '识别脸型轮廓...',
  '分析肤色底调与色温...',
  '匹配 Carol Jackson 十二季型...',
  '计算最适合的颜色方案...',
  '分析身材类型与廓形...',
  '生成场合穿搭建议...',
  '整理专属风格标签...',
  '完善穿搭公式...',
]

export function LoadingSteps({ currentStep }: { currentStep: number }) {
  const [aiStatusIdx, setAiStatusIdx] = useState(0)

  // Rotate the AI status message every 3.5 seconds while on step 1
  useEffect(() => {
    if (currentStep !== 1) return
    const timer = setInterval(() => {
      setAiStatusIdx((prev) => (prev + 1) % AI_STATUS.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [currentStep])

  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {STEPS.map((step, i) => {
        const done = i < currentStep
        const active = i === currentStep
        const sub = i === 1 ? AI_STATUS[aiStatusIdx] : step.sub

        return (
          <div
            key={i}
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              i > currentStep ? 'opacity-30' : 'opacity-100'
            }`}
          >
            {/* indicator */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs transition-colors duration-300 ${
                done
                  ? 'bg-[var(--green-ok)] text-white'
                  : active
                  ? 'bg-[var(--gold)] text-white animate-pulse'
                  : 'bg-[var(--border)] text-[var(--warm-gray)]'
              }`}
            >
              {done ? '✓' : i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-[var(--charcoal)]">{step.label}</div>
              {sub && (
                <div
                  key={i === 1 ? aiStatusIdx : sub}
                  className="text-xs text-[var(--warm-gray)] animate-fade-in"
                >
                  {sub}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Progress hint during AI analysis */}
      {currentStep === 1 && (
        <div className="pt-1">
          <div className="text-[10px] text-[var(--warm-gray)] text-center">
            AI 分析通常需要 15–25 秒，请耐心等待 ✨
          </div>
          <div className="mt-2 h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--gold)] rounded-full animate-progress-bar" />
          </div>
        </div>
      )}
    </div>
  )
}
