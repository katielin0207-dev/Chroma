'use client'

import { useState, useRef, useCallback, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/common/Navbar'
import { LoadingSteps } from '@/components/common/LoadingSteps'
import { Spinner } from '@/components/ui/spinner'

// ── user profile options ─────────────────────────────────────────────────────
const AGE_GROUPS = ['18–25岁', '26–35岁', '36–45岁', '45岁以上']

const STYLE_GOALS = [
  '知性优雅', '简约高级', '甜美可爱', '帅气中性',
  '日系清新', '欧美大气', '复古文艺', '运动休闲',
]

const IMAGE_PURPOSES = [
  { id: 'daily-upgrade', label: '日常穿搭升级', desc: 'AI 分析你现有的穿搭，告诉你哪些可以保留、哪里需要调整' },
  { id: 'explore-styles', label: '尝试不同的风格', desc: 'AI 基于你的脸型和身材，推荐 3 种截然不同的风格方向' },
  { id: 'special-occasion', label: '为特殊场合准备', desc: '告诉 AI 你的活动详情，获得专属着装方案' },
] as const

const OCCASION_EVENT_TYPES = ['婚礼 / 婚宴', '商务晚宴', '毕业典礼', '年会 / 颁奖礼', '面试', '派对', '约会', '其他']
const OCCASION_DRESSCODES = ['正式 (Black Tie)', '半正式 (Smart Casual)', '休闲 (Casual)', '无特别要求']

type ImagePurposeId = 'daily-upgrade' | 'explore-styles' | 'special-occasion' | ''

// ── style prompt template chips ──────────────────────────────────────────────
const STYLE_CHIPS = [
  '简约高级感',
  '日常休闲为主',
  '偏欧美大气',
  '喜欢甜美可爱',
  '职场精英感',
  '运动休闲混搭',
  '偏韩系清新',
  '复古文艺感',
  '不喜欢太甜的风格',
  '希望显得成熟知性',
  '想要减龄感',
  '偏中性帅气',
]

const STYLE_PLACEHOLDER =
  '例如：日常以休闲简约为主，希望给人知性有品味的感觉，不喜欢太甜美的风格，偏爱欧美大气的穿搭…'

// ─────────────────────────────────────────────────────────────────────────────

function AcceptedImageFile(f: File) {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 10 * 1024 * 1024
}

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const styleFileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [photoType, setPhotoType] = useState<'face' | 'full'>('face')

  // user profile state
  const [ageGroup, setAgeGroup] = useState<string>('')
  const [styleGoals, setStyleGoals] = useState<string[]>([])
  const [imagePurpose, setImagePurpose] = useState<ImagePurposeId>('')

  // daily-upgrade: current outfit photos
  const currentOutfitInputRef = useRef<HTMLInputElement>(null)
  const [currentOutfitFiles, setCurrentOutfitFiles] = useState<Array<{ file: File; preview: string }>>([])

  // special-occasion: event details
  const [occasionEventType, setOccasionEventType] = useState('')
  const [occasionDresscode, setOccasionDresscode] = useState('')
  const [occasionDescription, setOccasionDescription] = useState('')

  // style supplement state
  const [styleMode, setStyleMode] = useState<'none' | 'text' | 'photo'>('none')
  const [styleText, setStyleText] = useState('')
  const [styleFiles, setStyleFiles] = useState<Array<{ file: File; preview: string }>>([])

  const handleFile = useCallback((f: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('请上传 JPG、PNG 或 WebP 格式图片')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB')
      return
    }
    setError(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const addStyleFiles = (files: FileList | null) => {
    if (!files) return
    const next = [...styleFiles]
    for (const f of Array.from(files)) {
      if (next.length >= 2) break
      if (!AcceptedImageFile(f)) continue
      next.push({ file: f, preview: URL.createObjectURL(f) })
    }
    setStyleFiles(next)
  }

  const appendChip = (chip: string) => {
    setStyleText((prev) => {
      const trimmed = prev.trimEnd()
      if (!trimmed) return chip + '，'
      if (trimmed.endsWith('，') || trimmed.endsWith('。') || trimmed.endsWith('、')) return prev + chip + '，'
      return prev + '，' + chip + '，'
    })
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      // Step 1: upload main photo
      setCurrentStep(0)
      const form = new FormData()
      form.append('file', file)
      const upRes = await fetch('/api/upload-image', { method: 'POST', body: form })
      const upData = await upRes.json()
      if (!upRes.ok) throw new Error(upData.error || '上传失败')

      // Upload current outfit photos (daily-upgrade mode)
      let currentOutfitUrls: string[] = []
      if (imagePurpose === 'daily-upgrade' && currentOutfitFiles.length > 0) {
        currentOutfitUrls = await Promise.all(
          currentOutfitFiles.map(async ({ file: sf }) => {
            const sf_form = new FormData()
            sf_form.append('file', sf)
            const r = await fetch('/api/upload-image', { method: 'POST', body: sf_form })
            const d = await r.json()
            if (!r.ok) throw new Error(d.error || '穿搭照片上传失败')
            return d.publicUrl as string
          })
        )
      }

      // Upload style reference photos (if any)
      let styleImageUrls: string[] = []
      if (styleMode === 'photo' && styleFiles.length > 0) {
        styleImageUrls = await Promise.all(
          styleFiles.map(async ({ file: sf }) => {
            const sf_form = new FormData()
            sf_form.append('file', sf)
            const r = await fetch('/api/upload-image', { method: 'POST', body: sf_form })
            const d = await r.json()
            if (!r.ok) throw new Error(d.error || '参考图上传失败')
            return d.publicUrl as string
          })
        )
      }

      // Step 2: analyze — 35s client timeout to prevent infinite spinner
      setCurrentStep(1)
      const analyzeController = new AbortController()
      const analyzeTimeout = setTimeout(() => analyzeController.abort(), 35000)

      let anRes: Response
      try {
        anRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: upData.publicUrl,
            photoType,
            analysisMode: imagePurpose || 'standard',
            currentOutfitUrls: currentOutfitUrls.length > 0 ? currentOutfitUrls : undefined,
            occasionDetails: imagePurpose === 'special-occasion' ? {
              eventType: occasionEventType || '未指定',
              dresscode: occasionDresscode || '无特别要求',
              description: occasionDescription.trim() || '无',
            } : undefined,
            styleDescription: styleMode === 'text' && styleText.trim() ? styleText.trim() : undefined,
            styleImageUrls: styleMode === 'photo' && styleImageUrls.length > 0 ? styleImageUrls : undefined,
            userProfile: {
              ageGroup: ageGroup || undefined,
              styleGoals: styleGoals.length > 0 ? styleGoals : undefined,
              imagePurpose: imagePurpose || undefined,
            },
          }),
          signal: analyzeController.signal,
        })
      } catch (fetchErr) {
        clearTimeout(analyzeTimeout)
        if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
          throw new Error('AI 分析超时（超过 35 秒），请重试。建议使用清晰的正面照片。')
        }
        throw fetchErr
      }
      clearTimeout(analyzeTimeout)

      // Handle non-JSON responses (e.g. Vercel 504 HTML error pages)
      let anData: { result?: unknown; error?: string }
      try {
        anData = await anRes.json()
      } catch {
        throw new Error(`服务器错误 (${anRes.status})，请稍后重试`)
      }
      if (!anRes.ok) throw new Error(anData.error || 'AI 分析失败')

      // Step 3: navigate
      setCurrentStep(2)
      sessionStorage.setItem('huanyan_result', JSON.stringify(anData.result))
      sessionStorage.setItem('huanyan_image', upData.publicUrl)
      await new Promise((r) => setTimeout(r, 600))
      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : '出错了，请重试')
      setLoading(false)
      setCurrentStep(0)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 pb-12 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-up">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-xs tracking-[3px] text-[var(--gold)] mb-3 uppercase">Step 1</div>
            <h1 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">上传你的照片</h1>
            <p className="text-sm text-[var(--warm-gray)] leading-relaxed">AI 将自动识别脸型、色彩季型和穿搭风格</p>
          </div>

          {/* Photo type selector */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {(['face', 'full'] as const).map((type) => {
              const active = photoType === type
              return (
                <button
                  key={type}
                  onClick={() => setPhotoType(type)}
                  className={`p-4 rounded-2xl border text-left transition-all ${active ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.06)]' : 'border-[var(--border)] bg-[var(--cream)]'}`}
                >
                  {type === 'face' ? (
                    <svg className="mb-2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ color: active ? 'var(--gold)' : 'var(--charcoal)' }}>
                      <circle cx="12" cy="9" r="4"/><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                    </svg>
                  ) : (
                    <svg className="mb-2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ color: active ? 'var(--gold)' : 'var(--charcoal)' }}>
                      <circle cx="12" cy="4" r="2.5"/><line x1="12" y1="7" x2="12" y2="16"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="12" y1="16" x2="9" y2="22"/><line x1="12" y1="16" x2="15" y2="22"/>
                    </svg>
                  )}
                  <div className={`text-sm font-medium mb-1 ${active ? 'text-[var(--gold)]' : 'text-[var(--charcoal)]'}`}>
                    {type === 'face' ? '脸部照片' : '全身照片'}
                  </div>
                  <div className="text-[11px] text-[var(--warm-gray)] leading-relaxed">
                    {type === 'face' ? '分析色彩季型、脸型、穿搭风格' : '额外分析身材类型与廓形建议'}
                  </div>
                </button>
              )
            })}
          </div>

          {/* ── User Profile: age / style goal / purpose ── */}
          <div className="mb-5 p-4 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
            <div className="text-xs font-medium text-[var(--charcoal)] mb-0.5">告诉我更多关于你</div>
            <div className="text-[10px] text-[var(--warm-gray)] mb-4">帮助 AI 给出更贴合你需求的建议</div>

            {/* Age group */}
            <div className="mb-3.5">
              <div className="text-[10px] text-[var(--warm-gray)] mb-1.5 tracking-[0.5px]">年龄段</div>
              <div className="flex flex-wrap gap-1.5">
                {AGE_GROUPS.map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeGroup(ageGroup === age ? '' : age)}
                    className={`px-3 py-1.5 rounded-full text-[11px] border transition-all ${
                      ageGroup === age
                        ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                        : 'bg-white border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--gold)]'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Image purpose — 3 cards */}
            <div className="mb-3.5">
              <div className="text-[10px] text-[var(--warm-gray)] mb-2 tracking-[0.5px]">这次分析的目的</div>
              <div className="space-y-2">
                {IMAGE_PURPOSES.map((p) => {
                  const active = imagePurpose === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => setImagePurpose(active ? '' : p.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        active
                          ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.07)]'
                          : 'border-[var(--border)] bg-white hover:border-[var(--gold)]'
                      }`}
                    >
                      <div className={`text-xs font-medium mb-0.5 ${active ? 'text-[var(--gold)]' : 'text-[var(--charcoal)]'}`}>
                        {p.label}
                      </div>
                      <div className="text-[10px] text-[var(--warm-gray)] leading-relaxed">{p.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Conditional UI per mode ── */}

            {/* daily-upgrade: upload current outfit photos */}
            {imagePurpose === 'daily-upgrade' && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-[var(--border)]">
                <div className="text-[10px] font-medium text-[var(--charcoal)] mb-0.5">上传你目前的穿搭照</div>
                <div className="text-[9.5px] text-[var(--warm-gray)] mb-2.5">最多 3 张 · 可选，有照片建议更精准</div>
                <div className="grid grid-cols-3 gap-2">
                  {currentOutfitFiles.map((f, i) => (
                    <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.preview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setCurrentOutfitFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white text-[10px] rounded-full flex items-center justify-center"
                      >✕</button>
                    </div>
                  ))}
                  {currentOutfitFiles.length < 3 && (
                    <button
                      onClick={() => currentOutfitInputRef.current?.click()}
                      className="aspect-[3/4] rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--gold)] transition-colors text-[var(--warm-gray)] hover:text-[var(--gold)]"
                    >
                      <span className="text-lg">+</span>
                      <span className="text-[9px]">添加</span>
                    </button>
                  )}
                </div>
                <input
                  ref={currentOutfitInputRef}
                  type="file" multiple accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return
                    const next = [...currentOutfitFiles]
                    for (const f of Array.from(e.target.files)) {
                      if (next.length >= 3) break
                      if (!['image/jpeg','image/png','image/webp'].includes(f.type)) continue
                      next.push({ file: f, preview: URL.createObjectURL(f) })
                    }
                    setCurrentOutfitFiles(next)
                  }}
                />
              </div>
            )}

            {/* explore-styles: informational only */}
            {imagePurpose === 'explore-styles' && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-[var(--border)] text-[10px] text-[var(--warm-gray)] leading-relaxed">
                ✦ AI 将基于你的脸型、色彩季型和身材，推荐 <span className="text-[var(--charcoal)] font-medium">3 种截然不同</span> 的风格方向，每种都附带完整穿搭公式和单品搜索词。
              </div>
            )}

            {/* special-occasion: event details form */}
            {imagePurpose === 'special-occasion' && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-[var(--border)] space-y-3">
                <div>
                  <div className="text-[10px] text-[var(--warm-gray)] mb-1.5">活动类型</div>
                  <div className="flex flex-wrap gap-1.5">
                    {OCCASION_EVENT_TYPES.map((t) => (
                      <button key={t} onClick={() => setOccasionEventType(occasionEventType === t ? '' : t)}
                        className={`px-2.5 py-1 rounded-full text-[10px] border transition-all ${occasionEventType === t ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]' : 'bg-[var(--cream)] border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--gold)]'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--warm-gray)] mb-1.5">着装要求</div>
                  <div className="flex flex-wrap gap-1.5">
                    {OCCASION_DRESSCODES.map((d) => (
                      <button key={d} onClick={() => setOccasionDresscode(occasionDresscode === d ? '' : d)}
                        className={`px-2.5 py-1 rounded-full text-[10px] border transition-all ${occasionDresscode === d ? 'bg-[var(--gold)] text-white border-[var(--gold)]' : 'bg-[var(--cream)] border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--gold)]'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--warm-gray)] mb-1.5">详细描述 <span className="opacity-60">（时间 / 地点 / 特殊要求等）</span></div>
                  <textarea
                    value={occasionDescription}
                    onChange={(e) => setOccasionDescription(e.target.value)}
                    placeholder="例如：周六下午的户外婚礼，需要全程站立，不能抢新娘风头，最好不穿全白或全黑…"
                    rows={3}
                    maxLength={200}
                    className="w-full p-2.5 bg-[var(--cream)] border border-[var(--border)] rounded-xl text-xs text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Style goals — multi select (shown when no specific mode or explore-styles) */}
            {(imagePurpose === '' || imagePurpose === 'explore-styles') && (
              <div className="mt-3">
                <div className="text-[10px] text-[var(--warm-gray)] mb-1.5 tracking-[0.5px]">想要的风格方向 <span className="opacity-60">（可多选）</span></div>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_GOALS.map((s) => {
                    const selected = styleGoals.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() =>
                          setStyleGoals(selected ? styleGoals.filter((x) => x !== s) : [...styleGoals, s])
                        }
                        className={`px-3 py-1.5 rounded-full text-[11px] border transition-all ${
                          selected
                            ? 'bg-[var(--nude)] text-[var(--charcoal)] border-[var(--gold)]'
                            : 'bg-white border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--gold)]'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Photo reference guide */}
          <div className="mb-5">
            <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-2.5 text-center">
              参考示例 · 什么样的照片效果最好？
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {/* Good: clear face */}
              <div className="flex-shrink-0 w-[88px] bg-[var(--cream)] border border-[#C8E6C9] rounded-2xl p-2.5 flex flex-col items-center gap-1.5">
                <svg width="52" height="64" viewBox="0 0 52 64" fill="none">
                  <rect x="4" y="2" width="44" height="60" rx="6" fill="#F5F0E8" stroke="#E8D8B0" strokeWidth="1"/>
                  <ellipse cx="26" cy="30" rx="13" ry="16" fill="#F5D5B0" stroke="#C9A84C" strokeWidth="1"/>
                  <ellipse cx="21" cy="27" rx="2" ry="2.5" fill="#4A3520"/>
                  <ellipse cx="31" cy="27" rx="2" ry="2.5" fill="#4A3520"/>
                  <path d="M19.5 23.5 Q21 22 22.5 23.5" stroke="#7A5C3A" strokeWidth="0.8" fill="none"/>
                  <path d="M29.5 23.5 Q31 22 32.5 23.5" stroke="#7A5C3A" strokeWidth="0.8" fill="none"/>
                  <ellipse cx="26" cy="31" rx="1.2" ry="1.5" fill="#D4A882"/>
                  <path d="M22 36 Q26 39 30 36" stroke="#C06040" strokeWidth="1" fill="none"/>
                  <rect x="23" y="45" width="6" height="7" rx="1.5" fill="#F5D5B0"/>
                  <path d="M10 57 Q14 51 23 51 L29 51 Q38 51 42 57" fill="#E8C8A0" stroke="#C9A84C" strokeWidth="0.6"/>
                  {/* focus lines */}
                  <line x1="4" y1="2" x2="10" y2="2" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4" y1="2" x2="4" y2="8" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="48" y1="2" x2="42" y2="2" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="48" y1="2" x2="48" y2="8" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4" y1="62" x2="10" y2="62" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4" y1="62" x2="4" y2="56" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="48" y1="62" x2="42" y2="62" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="48" y1="62" x2="48" y2="56" stroke="#5A8A60" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-[#5A8A60]">✓</span>
                  <span className="text-[9.5px] text-[var(--charcoal)] font-medium">正脸清晰</span>
                </div>
                <div className="text-[8.5px] text-[var(--warm-gray)] text-center leading-relaxed">面部居中<br/>表情自然</div>
              </div>

              {/* Good: even lighting */}
              <div className="flex-shrink-0 w-[88px] bg-[var(--cream)] border border-[#C8E6C9] rounded-2xl p-2.5 flex flex-col items-center gap-1.5">
                <svg width="52" height="64" viewBox="0 0 52 64" fill="none">
                  <rect x="4" y="2" width="44" height="60" rx="6" fill="#FFF8F0" stroke="#E8D8B0" strokeWidth="1"/>
                  {/* sun/light source */}
                  <circle cx="26" cy="10" r="5" fill="#F5C040" opacity="0.7"/>
                  <line x1="26" y1="3" x2="26" y2="1" stroke="#F5C040" strokeWidth="1.2"/>
                  <line x1="32" y1="5" x2="33.5" y2="3.5" stroke="#F5C040" strokeWidth="1.2"/>
                  <line x1="20" y1="5" x2="18.5" y2="3.5" stroke="#F5C040" strokeWidth="1.2"/>
                  {/* light rays on face */}
                  <ellipse cx="26" cy="35" rx="13" ry="16" fill="#F5D5B0" stroke="#C9A84C" strokeWidth="1"/>
                  <ellipse cx="21" cy="32" rx="2" ry="2.5" fill="#4A3520"/>
                  <ellipse cx="31" cy="32" rx="2" ry="2.5" fill="#4A3520"/>
                  <path d="M22 41 Q26 44 30 41" stroke="#C06040" strokeWidth="1" fill="none"/>
                  <rect x="23" y="50" width="6" height="6" rx="1.5" fill="#F5D5B0"/>
                  {/* soft glow */}
                  <ellipse cx="26" cy="35" rx="16" ry="19" fill="none" stroke="#F5D8A0" strokeWidth="2" opacity="0.5"/>
                </svg>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-[#5A8A60]">✓</span>
                  <span className="text-[9.5px] text-[var(--charcoal)] font-medium">光线均匀</span>
                </div>
                <div className="text-[8.5px] text-[var(--warm-gray)] text-center leading-relaxed">自然光照<br/>避免阴影</div>
              </div>

              {/* Good: full body */}
              <div className="flex-shrink-0 w-[88px] bg-[var(--cream)] border border-[#C8E6C9] rounded-2xl p-2.5 flex flex-col items-center gap-1.5">
                <svg width="52" height="64" viewBox="0 0 52 64" fill="none">
                  <rect x="4" y="2" width="44" height="60" rx="6" fill="#F5F0E8" stroke="#E8D8B0" strokeWidth="1"/>
                  {/* full body figure */}
                  <circle cx="26" cy="14" r="7" fill="#F5D5B0" stroke="#C9A84C" strokeWidth="0.8"/>
                  <ellipse cx="21.5" cy="13" rx="1.5" ry="1.8" fill="#4A3520"/>
                  <ellipse cx="30.5" cy="13" rx="1.5" ry="1.8" fill="#4A3520"/>
                  <path d="M23 18 Q26 20.5 29 18" stroke="#C06040" strokeWidth="0.9" fill="none"/>
                  {/* torso */}
                  <path d="M17 22 Q14 24 13 35 L18 35 L18 46 L24 46 L24 35 L28 35 L28 46 L34 46 L34 35 L39 35 Q38 24 35 22 Q30 20 26 21 Q22 20 17 22Z" fill="#E8C8A8" stroke="#C9A84C" strokeWidth="0.7"/>
                  {/* legs */}
                  <rect x="18" y="45" width="7" height="15" rx="3" fill="#C8A878"/>
                  <rect x="27" y="45" width="7" height="15" rx="3" fill="#C8A878"/>
                  {/* arms */}
                  <path d="M17 23 Q11 28 12 36" stroke="#F5D5B0" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M35 23 Q41 28 40 36" stroke="#F5D5B0" strokeWidth="4" strokeLinecap="round"/>
                  {/* bracket lines */}
                  <line x1="6" y1="6" x2="6" y2="60" stroke="#5A8A60" strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
                  <line x1="46" y1="6" x2="46" y2="60" stroke="#5A8A60" strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
                </svg>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-[#5A8A60]">✓</span>
                  <span className="text-[9.5px] text-[var(--charcoal)] font-medium">全身站姿</span>
                </div>
                <div className="text-[8.5px] text-[var(--warm-gray)] text-center leading-relaxed">整体可见<br/>站直居中</div>
              </div>

              {/* Bad: backlit / covered */}
              <div className="flex-shrink-0 w-[88px] bg-[#FFF5F5] border border-[#FFCCCC] rounded-2xl p-2.5 flex flex-col items-center gap-1.5">
                <svg width="52" height="64" viewBox="0 0 52 64" fill="none">
                  <rect x="4" y="2" width="44" height="60" rx="6" fill="#F8E8E8" stroke="#E8C0C0" strokeWidth="1"/>
                  {/* bright window behind = backlit */}
                  <rect x="10" y="8" width="32" height="26" rx="3" fill="#FFF8D0" stroke="#F0D080" strokeWidth="0.5"/>
                  {/* dark silhouette face */}
                  <ellipse cx="26" cy="36" rx="13" ry="16" fill="#4A3520"/>
                  {/* mask / cover overlay */}
                  <rect x="15" y="36" width="22" height="12" rx="5" fill="#2D2D2D" opacity="0.7"/>
                  {/* sunglasses */}
                  <rect x="16" y="27" width="8" height="6" rx="3" fill="#2D2D2D"/>
                  <rect x="28" y="27" width="8" height="6" rx="3" fill="#2D2D2D"/>
                  <line x1="24" y1="30" x2="28" y2="30" stroke="#2D2D2D" strokeWidth="1.5"/>
                  {/* X marks */}
                  <line x1="14" y1="54" x2="20" y2="60" stroke="#C05040" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="54" x2="14" y2="60" stroke="#C05040" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="32" y1="54" x2="38" y2="60" stroke="#C05040" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="38" y1="54" x2="32" y2="60" stroke="#C05040" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-[#C05040]">✗</span>
                  <span className="text-[9.5px] text-[var(--charcoal)] font-medium">请避免</span>
                </div>
                <div className="text-[8.5px] text-[#C05040] text-center leading-relaxed">背光/遮挡<br/>墨镜/口罩</div>
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${dragging ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.06)]' : preview ? 'border-[var(--border)]' : 'border-[var(--border)] hover:border-[var(--gold)] hover:bg-[rgba(184,144,96,0.03)]'}`}
            style={{ minHeight: 220 }}
            onClick={() => !preview && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {preview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="预览" className="w-full object-cover rounded-2xl" style={{ maxHeight: 280 }} />
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); setError(null) }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
                >✕</button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--gold)]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3.5"/>
                  </svg>
                </div>
                <div className="text-sm font-medium text-[var(--charcoal)]">拖放照片到这里</div>
                <div className="text-xs text-[var(--warm-gray)]">或点击选择文件</div>
                <div className="text-xs text-[var(--border)] mt-1">JPG · PNG · WebP · 最大 10MB</div>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onInputChange} />

          {/* ── Style supplement (shown after photo selected) ── */}
          {preview && !loading && (
            <div className="mt-5 p-4 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-medium text-[var(--charcoal)]">补充你的风格偏好</div>
                  <div className="text-[10px] text-[var(--warm-gray)] mt-0.5">可选 · 让 AI 给出更个性化的建议</div>
                </div>
                <button
                  onClick={() => setStyleMode('none')}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${styleMode === 'none' ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-[var(--border)] text-[var(--warm-gray)]'}`}
                >
                  跳过
                </button>
              </div>

              {/* Mode toggle */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setStyleMode(styleMode === 'text' ? 'none' : 'text')}
                  className={`py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${styleMode === 'text' ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.08)] text-[var(--gold)]' : 'border-[var(--border)] text-[var(--warm-gray)]'}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="13" x2="16" y2="13"/><line x1="4" y1="18" x2="12" y2="18"/>
                  </svg>
                  文字描述
                </button>
                <button
                  onClick={() => setStyleMode(styleMode === 'photo' ? 'none' : 'photo')}
                  className={`py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${styleMode === 'photo' ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.08)] text-[var(--gold)]' : 'border-[var(--border)] text-[var(--warm-gray)]'}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3"/>
                  </svg>
                  上传参考图
                </button>
              </div>

              {/* Text mode */}
              {styleMode === 'text' && (
                <div>
                  <textarea
                    value={styleText}
                    onChange={(e) => setStyleText(e.target.value)}
                    placeholder={STYLE_PLACEHOLDER}
                    rows={3}
                    maxLength={300}
                    className="w-full p-3 bg-white border border-[var(--border)] rounded-xl text-xs text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] resize-none mb-3"
                  />
                  <div className="text-[10px] text-[var(--warm-gray)] mb-2">点击快速填入：</div>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => appendChip(chip)}
                        className="px-2.5 py-1 text-[10px] bg-white border border-[var(--border)] rounded-full text-[var(--charcoal)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo mode */}
              {styleMode === 'photo' && (
                <div>
                  <div className="text-[10px] text-[var(--warm-gray)] mb-2">上传日常穿搭照或喜欢的风格参考图（最多 2 张）</div>
                  <div className="grid grid-cols-3 gap-2">
                    {styleFiles.map((sf, i) => (
                      <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sf.preview} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setStyleFiles((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white text-[10px] rounded-full flex items-center justify-center"
                        >✕</button>
                      </div>
                    ))}
                    {styleFiles.length < 2 && (
                      <button
                        onClick={() => styleFileInputRef.current?.click()}
                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--gold)] transition-colors text-[var(--warm-gray)] hover:text-[var(--gold)]"
                      >
                        <span className="text-lg">+</span>
                        <span className="text-[9px]">添加</span>
                      </button>
                    )}
                  </div>
                  <input
                    ref={styleFileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => addStyleFiles(e.target.files)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center space-y-2">
              <div>{error}</div>
              {(error.includes('超时') || error.includes('失败') || error.includes('服务器')) && (
                <button
                  onClick={analyze}
                  className="mt-1 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                >
                  重新分析 →
                </button>
              )}
            </div>
          )}

          {/* Loading steps */}
          {loading && (
            <div className="mt-6 p-5 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
              <LoadingSteps currentStep={currentStep} />
            </div>
          )}

          {/* CTA */}
          {!loading && (
            <button
              onClick={preview ? analyze : () => fileInputRef.current?.click()}
              disabled={loading}
              className={`w-full mt-5 py-4 rounded-2xl text-sm font-medium tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${preview ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--gold)] shadow-card' : 'bg-[var(--cream)] text-[var(--warm-gray)] border border-[var(--border)]'}`}
            >
              {preview ? '开始分析 →' : '选择照片'}
            </button>
          )}

          {loading && (
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[var(--warm-gray)]">
              <Spinner size={16} />
              <span>AI 正在分析，预计需要 20–30 秒...</span>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[{ icon: '✓', text: '面部清晰可见' }, { icon: '✓', text: '光线均匀自然' }, { icon: '✓', text: '正面或轻微侧面' }].map((tip) => (
              <div key={tip.text} className="text-xs text-[var(--warm-gray)] leading-relaxed">
                <span className="text-[var(--green-ok)]">{tip.icon}</span> {tip.text}
              </div>
            ))}
          </div>

          {/* Back to landing */}
          <div className="mt-8 text-center">
            <a href="/features" className="text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors underline underline-offset-2">
              查看功能介绍
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
