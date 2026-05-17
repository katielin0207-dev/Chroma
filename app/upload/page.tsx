'use client'

import { useState, useRef, useCallback, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/common/Navbar'
import { LoadingSteps } from '@/components/common/LoadingSteps'
import { Spinner } from '@/components/ui/spinner'

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [photoType, setPhotoType] = useState<'face' | 'full'>('face')

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

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      // Step 1: upload
      setCurrentStep(0)
      const form = new FormData()
      form.append('file', file)
      const upRes = await fetch('/api/upload-image', { method: 'POST', body: form })
      const upData = await upRes.json()
      if (!upRes.ok) throw new Error(upData.error || '上传失败')

      // Step 2: analyze
      setCurrentStep(1)
      const anRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: upData.publicUrl, photoType }),
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
            <h1 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">
              上传你的照片
            </h1>
            <p className="text-sm text-[var(--warm-gray)] leading-relaxed">
              AI 将自动识别脸型、色彩季型和穿搭风格
            </p>
          </div>

          {/* Photo type selector */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setPhotoType('face')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                photoType === 'face'
                  ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.06)]'
                  : 'border-[var(--border)] bg-[var(--cream)]'
              }`}
            >
              <svg className="mb-2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{color: photoType === 'face' ? 'var(--gold)' : 'var(--charcoal)'}}>
                <circle cx="12" cy="9" r="4"/>
                <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
              </svg>
              <div className={`text-sm font-medium mb-1 ${photoType === 'face' ? 'text-[var(--gold)]' : 'text-[var(--charcoal)]'}`}>
                脸部照片
              </div>
              <div className="text-[11px] text-[var(--warm-gray)] leading-relaxed">
                分析色彩季型、脸型、穿搭风格
              </div>
            </button>
            <button
              onClick={() => setPhotoType('full')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                photoType === 'full'
                  ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.06)]'
                  : 'border-[var(--border)] bg-[var(--cream)]'
              }`}
            >
              <svg className="mb-2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{color: photoType === 'full' ? 'var(--gold)' : 'var(--charcoal)'}}>
                <circle cx="12" cy="4" r="2.5"/>
                <line x1="12" y1="7" x2="12" y2="16"/>
                <line x1="7" y1="10" x2="17" y2="10"/>
                <line x1="12" y1="16" x2="9" y2="22"/>
                <line x1="12" y1="16" x2="15" y2="22"/>
              </svg>
              <div className={`text-sm font-medium mb-1 ${photoType === 'full' ? 'text-[var(--gold)]' : 'text-[var(--charcoal)]'}`}>
                全身照片
              </div>
              <div className="text-[11px] text-[var(--warm-gray)] leading-relaxed">
                额外分析身材类型与廓形建议
              </div>
            </button>
          </div>

          {/* Drop zone */}
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
              dragging
                ? 'border-[var(--gold)] bg-[rgba(184,144,96,0.06)]'
                : preview
                ? 'border-[var(--border)]'
                : 'border-[var(--border)] hover:border-[var(--gold)] hover:bg-[rgba(184,144,96,0.03)]'
            }`}
            style={{ minHeight: 260 }}
            onClick={() => !preview && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {preview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="预览"
                  className="w-full object-cover rounded-2xl"
                  style={{ maxHeight: 340 }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreview(null)
                    setFile(null)
                    setError(null)
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--gold)]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h4l2-3h6l2 3h4v13H3z"/>
                    <circle cx="12" cy="13" r="3.5"/>
                  </svg>
                </div>
                <div className="text-sm font-medium text-[var(--charcoal)]">
                  拖放照片到这里
                </div>
                <div className="text-xs text-[var(--warm-gray)]">或点击选择文件</div>
                <div className="text-xs text-[var(--border)] mt-1">JPG · PNG · WebP · 最大 10MB</div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onInputChange}
          />

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
              className={`w-full mt-5 py-4 rounded-2xl text-sm font-medium tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                preview
                  ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--gold)] shadow-card'
                  : 'bg-[var(--cream)] text-[var(--warm-gray)] border border-[var(--border)]'
              }`}
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
            {[
              { icon: '✓', text: '面部清晰可见' },
              { icon: '✓', text: '光线均匀自然' },
              { icon: '✓', text: '正面或轻微侧面' },
            ].map((tip) => (
              <div key={tip.text} className="text-xs text-[var(--warm-gray)] leading-relaxed">
                <span className="text-[var(--green-ok)]">{tip.icon}</span> {tip.text}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
