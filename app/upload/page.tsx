'use client'

import { useState, useRef, useCallback, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/common/Navbar'
import { LoadingSteps } from '@/components/common/LoadingSteps'
import { Spinner } from '@/components/ui/spinner'

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

      // Step 2: analyze
      setCurrentStep(1)
      const anRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: upData.publicUrl,
          photoType,
          styleDescription: styleMode === 'text' && styleText.trim() ? styleText.trim() : undefined,
          styleImageUrls: styleMode === 'photo' && styleImageUrls.length > 0 ? styleImageUrls : undefined,
        }),
      })
      const anData = await anRes.json()
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
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
              {error}
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
            <a href="/?showLanding=1" className="text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors underline underline-offset-2">
              查看功能介绍
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
