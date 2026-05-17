'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { AnalysisResult, OOTDItem, OOTDSet } from '@/types/analysis'
import { Navbar } from '@/components/common/Navbar'
import { Spinner } from '@/components/ui/spinner'

interface UploadedItem {
  file: File
  preview: string
  publicUrl?: string
}

export default function OOTDPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<AnalysisResult | null>(null)
  const [items, setItems] = useState<UploadedItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [itemResults, setItemResults] = useState<OOTDItem[] | null>(null)
  const [ootdSet, setOotdSet] = useState<OOTDSet | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('huanyan_result')
    if (raw) setProfile(JSON.parse(raw))
  }, [])

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const newItems: UploadedItem[] = []
    for (const f of Array.from(files)) {
      if (items.length + newItems.length >= 6) break
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) continue
      newItems.push({ file: f, preview: URL.createObjectURL(f) })
    }
    setItems((prev) => [...prev, ...newItems])
    setItemResults(null)
    setOotdSet(null)
    setError(null)
  }, [items.length])

  const removeItem = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
    setItemResults(null)
  }

  const analyze = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError(null)
    setItemResults(null)
    setOotdSet(null)

    try {
      // Upload each item to Supabase first
      setLoadingMsg('正在上传单品照片...')
      const uploadedUrls: string[] = await Promise.all(
        items.map(async (item) => {
          const form = new FormData()
          form.append('file', item.file)
          const res = await fetch('/api/upload-image', { method: 'POST', body: form })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || '上传失败')
          return data.publicUrl as string
        })
      )

      // AI analyze
      setLoadingMsg(`AI 正在对照你的${profile?.colorSeason.season ?? ''}诊断单品...`)
      const userProfile = {
        season: profile?.colorSeason.season ?? '未知',
        faceShape: profile?.faceShape.faceShape ?? '未知',
        bodyShape: profile?.bodyShape.bodyShape ?? '未知',
      }

      const res = await fetch('/api/ootd-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clothingImageUrls: uploadedUrls, userProfile }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI 诊断失败')

      setItemResults(data.itemResults)
      setOotdSet(data.ootdSet ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '出错了，请重试')
    } finally {
      setLoading(false)
      setLoadingMsg('')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 pb-20 px-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-8 animate-fade-up">
          <div className="text-xs tracking-[3px] text-[var(--terra)] mb-2 uppercase">New Feature</div>
          <h1 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">衣橱诊断</h1>
          <p className="text-sm text-[var(--warm-gray)] leading-relaxed">
            上传你的单品照片<br />
            AI 对照你的{profile ? <strong className="text-[var(--gold)]">{profile.colorSeason.season}</strong> : '季型'}诊断是否合适
          </p>
        </div>

        {/* No profile warning */}
        {!profile && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700 text-center">
            先完成形象分析，AI 才能对照你的季型诊断单品
            <Link href="/upload" className="block mt-2 font-medium text-[var(--gold)] hover:underline">
              去上传照片 →
            </Link>
          </div>
        )}

        {/* Profile badge */}
        {profile && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-[var(--cream)] border border-[var(--border)] rounded-xl text-xs text-[var(--warm-gray)]">
            <span>当前档案：</span>
            <span className="px-2 py-0.5 bg-[var(--gold)] text-white rounded-full">{profile.colorSeason.season}</span>
            <span className="px-2 py-0.5 bg-[var(--ivory)] rounded-full">{profile.faceShape.faceShape}</span>
            <span className="px-2 py-0.5 bg-[var(--ivory)] rounded-full">{profile.bodyShape.bodyShape}</span>
          </div>
        )}

        {/* Upload grid */}
        <div className="p-5 bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card mb-4">
          <div className="text-[10px] tracking-[2px] text-[var(--warm-gray)] mb-3">上传单品照片（最多 6 件）</div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {items.map((item, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.preview} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeItem(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 text-white text-xs rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  ✕
                </button>
              </div>
            ))}
            {items.length < 6 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--gold)] transition-colors text-[var(--warm-gray)] hover:text-[var(--gold)]"
              >
                <span className="text-xl">+</span>
                <span className="text-[10px]">添加单品</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          <button
            onClick={analyze}
            disabled={loading || items.length === 0}
            className={`w-full py-3.5 rounded-2xl text-sm font-medium tracking-wider transition-all flex items-center justify-center gap-2 ${
              items.length > 0 && !loading
                ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--gold)]'
                : 'bg-[var(--border)] text-[var(--warm-gray)] cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><Spinner size={16} />{loadingMsg}</>
            ) : (
              'AI 帮我诊断'
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {itemResults && (
          <div className="space-y-4 animate-fade-up">
            <div className="text-[10px] tracking-[2px] text-[var(--warm-gray)] px-1">单品兼容分析</div>

            {itemResults.map((item, i) => (
              <div key={i} className="p-4 bg-[var(--cream)] rounded-2xl border border-[var(--border)] shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={items[i]?.preview}
                    alt=""
                    className="w-12 h-16 rounded-lg object-cover flex-shrink-0 border border-[var(--border)]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-[var(--charcoal)]">{item.itemName}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] border"
                        style={item.isCompatible
                          ? { background: 'rgba(90,138,96,0.1)', color: 'var(--green-ok)', borderColor: 'rgba(90,138,96,0.3)' }
                          : { background: 'rgba(192,80,64,0.08)', color: 'var(--red-no)', borderColor: 'rgba(192,80,64,0.25)' }
                        }
                      >
                        {item.isCompatible ? '✓ 适合你' : '✗ 不建议'}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="text-xs leading-relaxed px-3 py-2 rounded-lg mb-2"
                  style={{ background: item.isCompatible ? 'rgba(90,138,96,0.05)' : 'rgba(192,80,64,0.04)' }}
                >
                  {item.reason}
                </div>
                {item.alternativeSuggestion && (
                  <div className="text-xs px-3 py-2 bg-[rgba(184,144,96,0.07)] rounded-lg">
                    <span className="text-[var(--gold)] font-medium">→ AI 建议：</span>
                    {item.alternativeSuggestion}
                  </div>
                )}
              </div>
            ))}

            {/* OOTD Set */}
            {ootdSet && (
              <div className="p-4 bg-[var(--cream)] rounded-2xl border border-[var(--gold)] shadow-card" style={{ borderColor: 'rgba(184,144,96,0.35)' }}>
                <div className="text-[10px] tracking-[2px] text-[var(--gold)] mb-2">✦ OOTD 完整搭配方案</div>
                <div className="text-sm font-medium text-[var(--charcoal)] mb-2">{ootdSet.completeOutfit}</div>
                <div className="flex gap-2 mb-3">
                  {ootdSet.colorDots.map((hex, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-[var(--border)]" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <div className="text-xs text-[var(--warm-gray)] leading-relaxed px-3 py-2 bg-white rounded-xl">
                  <span className="text-[var(--gold)] font-medium">搭配逻辑：</span>
                  {ootdSet.outfitLogic}
                </div>
              </div>
            )}

            {/* Back CTA */}
            <Link
              href="/results"
              className="block text-center text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors mt-4"
            >
              ← 返回查看完整报告
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
