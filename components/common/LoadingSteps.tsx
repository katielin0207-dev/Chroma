'use client'

const STEPS = [
  { label: '正在上传照片...', sub: '安全传输中' },
  { label: 'AI 正在分析...', sub: '色彩季型 · 脸型 · 身材' },
  { label: '生成专属报告...', sub: '即将完成' },
]

export function LoadingSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {STEPS.map((step, i) => {
        const done = i < currentStep
        const active = i === currentStep
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
            <div>
              <div className="text-sm font-medium text-[var(--charcoal)]">{step.label}</div>
              <div className="text-xs text-[var(--warm-gray)]">{step.sub}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
