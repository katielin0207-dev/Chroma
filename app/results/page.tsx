'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnalysisResult } from '@/types/analysis'
import { Navbar } from '@/components/common/Navbar'
import { ColorSwatch } from '@/components/results/ColorSwatch'

const ALL_NAV_SECTIONS = ['色彩季型', '脸型分析', '身材分析', '穿搭风格', '场合建议']

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const raw = sessionStorage.getItem('huanyan_result')
    const img = sessionStorage.getItem('huanyan_image')
    if (!raw) { router.push('/upload'); return }
    setResult(JSON.parse(raw))
    setImageUrl(img)
  }, [router])

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = sectionRefs.current.indexOf(entry.target as HTMLElement)
            if (i !== -1) setActiveSection(i)
          }
        })
      },
      { threshold: 0.4 }
    )
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [result])

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Share / download
  const handleShare = async () => {
    if (!result) return
    const { default: html2canvas } = await import('html2canvas')
    const el = document.getElementById('share-card')
    if (!el) return
    const canvas = await html2canvas(el, { backgroundColor: '#FAFAF5', scale: 2 })
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = '焕颜AI形象报告.png'
    a.click()
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--warm-gray)]">
        加载中...
      </div>
    )
  }

  const { colorSeason, faceShape, bodyShape, style, occasions } = result
  const hasBodyShape = !!(bodyShape?.bodyShape && bodyShape.bodyShape.trim() !== '')
  const navSections = hasBodyShape
    ? ALL_NAV_SECTIONS
    : ALL_NAV_SECTIONS.filter((s) => s !== '身材分析')

  return (
    <>
      <Navbar />

      {/* Sticky section nav */}
      <div className="fixed top-[49px] left-0 right-0 z-40 bg-[var(--bg)] border-b border-[var(--border)] overflow-x-auto no-scrollbar">
        <div className="flex items-center px-4 py-2 gap-1 min-w-max">
          {navSections.map((label, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeSection === i
                  ? 'bg-[var(--gold)] text-white'
                  : 'text-[var(--warm-gray)] hover:text-[var(--charcoal)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="pt-[88px] pb-20 px-4 max-w-lg mx-auto space-y-6">
        {/* Header card */}
        <div id="share-card" className="p-5 bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card">
          <div className="flex items-center gap-3 mb-4">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="你的照片" className="w-14 h-14 rounded-full object-cover border-2 border-[var(--gold)]" />
            )}
            <div>
              <div className="font-serif text-base font-medium text-[var(--charcoal)]">个人形象诊断报告</div>
              <div className="text-xs text-[var(--warm-gray)]">焕颜AI · 专业形象顾问体系</div>
            </div>
            <span className="ml-auto px-3 py-1 bg-[var(--gold)] text-white text-xs rounded-full">
              {colorSeason.season}
            </span>
          </div>
          <div className="flex gap-2 text-xs text-[var(--warm-gray)] flex-wrap">
            <span className="px-2 py-0.5 bg-[var(--ivory)] rounded-full">{faceShape.faceShape}</span>
            {hasBodyShape && <span className="px-2 py-0.5 bg-[var(--ivory)] rounded-full">{bodyShape.bodyShape}</span>}
            <span className="px-2 py-0.5 bg-[var(--ivory)] rounded-full">{style.primaryStyle}</span>
          </div>
        </div>

        {/* Section 0: Color Season */}
        <section ref={(el) => { sectionRefs.current[0] = el }} className="p-5 bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card scroll-mt-24">
          <div className="text-[10px] tracking-[2px] text-[var(--gold)] mb-1">色彩季型</div>
          <h2 className="font-serif text-xl font-medium text-[var(--charcoal)] mb-2">{colorSeason.season}</h2>
          <p className="text-sm text-[var(--warm-gray)] leading-relaxed mb-4">{colorSeason.description}</p>

          <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-3">✦ 专属色板 · 最佳色彩</div>
          <div className="flex flex-wrap gap-4 mb-4">
            {colorSeason.bestColors.map((c) => <ColorSwatch key={c.name} swatch={c} />)}
          </div>

          <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-3">✗ 需要回避</div>
          <div className="flex flex-wrap gap-4 mb-4">
            {colorSeason.avoidColors.map((c) => <ColorSwatch key={c.name} swatch={c} faded />)}
          </div>

          {colorSeason.coloringPrinciple && (
            <div className="px-4 py-3 bg-white rounded-xl border-l-2 border-[var(--gold)] text-xs text-[var(--warm-gray)] leading-relaxed">
              <span className="text-[var(--gold)] font-medium">搭配原则：</span>{colorSeason.coloringPrinciple}
            </div>
          )}
        </section>

        {/* Section 1: Face Shape */}
        <section ref={(el) => { sectionRefs.current[1] = el }} className="p-5 bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card scroll-mt-24">
          <div className="text-[10px] tracking-[2px] text-[var(--gold)] mb-1">脸型分析</div>
          <h2 className="font-serif text-xl font-medium text-[var(--charcoal)] mb-2">{faceShape.faceShape}</h2>
          <ul className="text-sm text-[var(--warm-gray)] mb-4 space-y-1">
            {faceShape.characteristics.map((c) => <li key={c}>· {c}</li>)}
          </ul>

          <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-3">✦ 推荐领型</div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {faceShape.necklineRecs.map((n) => (
              <div key={n.name} className="p-3 bg-white rounded-xl text-center border border-[var(--border)]">
                <div className="font-medium text-sm text-[var(--charcoal)] mb-1">{n.name}</div>
                <div className="text-[10px] text-[var(--warm-gray)] leading-tight">{n.why}</div>
              </div>
            ))}
          </div>

          <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-3">✦ 发型建议</div>
          <div className="flex flex-wrap gap-2">
            {faceShape.hairstyleRecs.map((h) => (
              <span key={h} className="px-3 py-1.5 text-xs bg-white border border-[var(--border)] rounded-full text-[var(--charcoal)]">
                {h}
              </span>
            ))}
          </div>
        </section>

        {/* Section 2: Body Shape — only shown when full-body photo was analyzed */}
        {hasBodyShape && (
          <section ref={(el) => { sectionRefs.current[2] = el }} className="p-5 bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card scroll-mt-24">
            <div className="text-[10px] tracking-[2px] text-[var(--gold)] mb-1">身材分析</div>
            <h2 className="font-serif text-xl font-medium text-[var(--charcoal)] mb-2">{bodyShape.bodyShape}</h2>
            <p className="text-sm text-[var(--warm-gray)] mb-4 leading-relaxed">{bodyShape.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl border bg-white border-[var(--border)]" style={{ borderColor: 'rgba(90,138,96,0.2)', background: 'rgba(90,138,96,0.04)' }}>
                <div className="text-[10px] tracking-[1px] mb-2" style={{ color: 'var(--green-ok)' }}>✓ 推荐廓形</div>
                <ul className="space-y-1 text-xs text-[var(--charcoal)]">
                  {bodyShape.silhouetteRecs.map((s) => <li key={s}>· {s}</li>)}
                </ul>
              </div>
              <div className="p-3 rounded-xl border" style={{ borderColor: 'rgba(192,80,64,0.15)', background: 'rgba(192,80,64,0.04)' }}>
                <div className="text-[10px] tracking-[1px] mb-2" style={{ color: 'var(--red-no)' }}>✗ 避免廓形</div>
                <ul className="space-y-1 text-xs text-[var(--charcoal)]">
                  {bodyShape.avoidSilhouettes.map((s) => <li key={s}>· {s}</li>)}
                </ul>
              </div>
            </div>

            {bodyShape.expertTip && (
              <div className="px-4 py-3 bg-white rounded-xl border-l-2 border-[var(--gold)] text-xs text-[var(--warm-gray)] leading-relaxed">
                <span className="text-[var(--gold)] font-medium">专业提示：</span>{bodyShape.expertTip}
              </div>
            )}
          </section>
        )}

        {/* Section 3: Style */}
        <section ref={(el) => { sectionRefs.current[3] = el }} className="p-5 bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card scroll-mt-24">
          <div className="text-[10px] tracking-[2px] text-[var(--gold)] mb-1">穿搭风格</div>
          <h2 className="font-serif text-xl font-medium text-[var(--charcoal)] mb-3">{style.primaryStyle}</h2>

          {/* Why */}
          <div className="p-3 bg-white rounded-xl border border-[var(--border)] mb-4 text-xs text-[var(--warm-gray)] leading-relaxed">
            <div className="text-[var(--gold)] text-[10px] tracking-[1px] mb-1.5">为什么适合你</div>
            {style.whyItSuitsYou}
          </div>

          {/* Outfit formula */}
          <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-3">✦ 专属穿搭公式</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(style.outfitFormula).map(([key, val]) => {
              const labels: Record<string, string> = { top: '上衣廓形', bottom: '下装廓形', material: '材质方向', accessory: '配饰点睛' }
              return (
                <div key={key} className="p-3 bg-white rounded-xl border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--warm-gray)] mb-1">{labels[key]}</div>
                  <div className="text-xs font-medium text-[var(--charcoal)]">{val}</div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {style.styleKeywords.map((k) => (
              <span key={k} className="px-3 py-1.5 text-xs bg-[var(--gold)] text-white rounded-full">{k}</span>
            ))}
          </div>
        </section>

        {/* Section 4: Occasions */}
        <section ref={(el) => { sectionRefs.current[4] = el }} className="p-5 bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card scroll-mt-24">
          <div className="text-[10px] tracking-[2px] text-[var(--gold)] mb-1">场合建议</div>
          <h2 className="font-serif text-xl font-medium text-[var(--charcoal)] mb-4">场合穿搭建议</h2>

          <div className="space-y-3">
            {occasions.map((occ) => (
              <div key={occ.occasion} className="p-4 bg-white rounded-2xl border border-[var(--border)]">
                <div className="text-xs font-medium text-[var(--charcoal)] mb-1.5">
                  {occ.occasion === '职场' ? '💼' : occ.occasion === '约会' ? '🌸' : '☀️'} {occ.occasion}
                </div>
                <div className="text-sm text-[var(--charcoal)] mb-2">{occ.outfit}</div>
                <div className="flex gap-2 mb-2">
                  {occ.colors.map((hex, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-[var(--border)]" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                {occ.logic && (
                  <div className="text-[10.5px] text-[var(--warm-gray)] leading-relaxed px-3 py-2 bg-[rgba(184,144,96,0.06)] rounded-lg">
                    <span className="text-[var(--gold)] font-medium">搭配逻辑：</span>{occ.logic}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="w-full py-4 bg-[var(--charcoal)] text-white rounded-2xl text-sm font-medium tracking-wider hover:bg-[var(--gold)] transition-colors"
          >
            保存报告图片
          </button>
          <Link
            href="/ootd"
            className="w-full py-4 bg-[var(--cream)] text-[var(--charcoal)] border border-[var(--border)] rounded-2xl text-sm font-medium tracking-wider text-center hover:border-[var(--gold)] transition-colors"
          >
            ✦ 诊断我的衣橱 → OOTD 搭配
          </Link>
          <Link
            href="/upload"
            className="text-center text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors"
          >
            重新上传照片
          </Link>
        </div>
      </main>
    </>
  )
}
