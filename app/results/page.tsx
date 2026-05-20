'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnalysisResult } from '@/types/analysis'
import { Navbar } from '@/components/common/Navbar'
import { ColorSwatch } from '@/components/results/ColorSwatch'

const ALL_NAV_SECTIONS = ['色彩季型', '脸型分析', '身材分析', '穿搭风格', '场合建议']

// ---------------------------------------------------------------------------
// Off-screen summary card — designed for html2canvas capture
// ---------------------------------------------------------------------------
function SummaryShareCard({ result, imageUrl }: { result: AnalysisResult; imageUrl: string | null }) {
  const { colorSeason, faceShape, style, bodyShape, occasions } = result
  const hasBody = !!(bodyShape?.bodyShape?.trim())

  return (
    <div
      id="summary-share-card"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        opacity: 0,
        width: 360,
        background: '#FAFAF5',
        fontFamily: "'Noto Sans SC', sans-serif",
        color: '#1C1814',
      }}
    >
      {/* Header */}
      <div style={{ background: '#1C1814', padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 18, color: '#FAFAF5', fontWeight: 500 }}>
          焕颜<span style={{ color: '#B89060' }}>AI</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>个人形象诊断报告</div>
      </div>

      {/* User + season */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #B89060' }} crossOrigin="anonymous" />
        ) : (
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#F2EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✦</div>
        )}
        <div>
          <div style={{ fontSize: 11, color: '#8C7E72', letterSpacing: 1, marginBottom: 4 }}>COLOR SEASON</div>
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 22, fontWeight: 500, color: '#1C1814' }}>{colorSeason.season}</div>
          {colorSeason.dimensions && (
            <div style={{ fontSize: 10, color: '#8C7E72', marginTop: 3 }}>
              {colorSeason.dimensions.temperature} · {colorSeason.dimensions.brightness} · {colorSeason.dimensions.saturation}
            </div>
          )}
        </div>
      </div>

      {/* Color swatches */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #DDD4C5' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#8C7E72', marginBottom: 10 }}>✦ 专属色板</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {colorSeason.bestColors.slice(0, 6).map((c) => (
            <div key={c.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.hex }} />
              <span style={{ fontSize: 9, color: '#8C7E72' }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Face shape + necklines */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #DDD4C5' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#B89060', marginBottom: 6 }}>脸型分析</div>
        <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{faceShape.faceShape}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {faceShape.necklineRecs.slice(0, 3).map((n) => (
            <div key={n.name} style={{ flex: 1, padding: '8px 6px', background: '#F2EBE0', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 500 }}>{n.name}</div>
              <div style={{ fontSize: 9, color: '#8C7E72', marginTop: 2, lineHeight: 1.4 }}>{n.why}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body shape (if available) */}
      {hasBody && (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #DDD4C5' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: '#B89060', marginBottom: 6 }}>身材分析</div>
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{bodyShape.bodyShape}</div>
          <div style={{ fontSize: 11, color: '#8C7E72', lineHeight: 1.6 }}>
            推荐：{bodyShape.silhouetteRecs.slice(0, 3).join(' · ')}
          </div>
        </div>
      )}

      {/* Style + keywords */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #DDD4C5' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#B89060', marginBottom: 6 }}>穿搭风格</div>
        <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{style.primaryStyle}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {style.styleKeywords.map((k) => (
            <span key={k} style={{ padding: '3px 10px', background: '#B89060', color: '#fff', borderRadius: 20, fontSize: 10 }}>{k}</span>
          ))}
        </div>
        {style.whyItSuitsYou && (
          <div style={{ marginTop: 8, fontSize: 10, color: '#8C7E72', lineHeight: 1.6, padding: '8px 10px', background: '#F2EBE0', borderRadius: 8 }}>
            {style.whyItSuitsYou}
          </div>
        )}
      </div>

      {/* Occasions */}
      <div style={{ padding: '14px 20px' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#B89060', marginBottom: 10 }}>场合穿搭建议</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {occasions.map((occ) => (
            <div key={occ.occasion} style={{ padding: '10px 12px', background: '#F2EBE0', borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4 }}>{occ.occasion}</div>
              <div style={{ fontSize: 11, color: '#1C1814', marginBottom: 4 }}>{occ.outfit}</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 4 }}>
                {occ.colors.map((hex, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: hex }} />
                ))}
              </div>
              {occ.logic && (
                <div style={{ fontSize: 10, color: '#8C7E72' }}>{occ.logic}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#F2EBE0', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 13, color: '#8C7E72' }}>焕颜AI</div>
        <div style={{ fontSize: 9, color: '#8C7E72', letterSpacing: 1 }}>chroma-flax.vercel.app</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function OccasionIcon({ occasion }: { occasion: string }) {
  const common = {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.3,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  if (occasion === '职场') {
    return (
      <svg {...common}>
        <rect x="3" y="8" width="18" height="12" rx="1"/>
        <path d="M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2"/>
        <line x1="3" y1="13" x2="21" y2="13"/>
      </svg>
    )
  }
  if (occasion === '约会') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 5c-2 0-3 1.5-3 3s1 3 3 3 3-1.5 3-3-1-3-3-3z"/>
        <path d="M19 12c0-2-1.5-3-3-3s-3 1-3 3 1.5 3 3 3 3-1 3-3z"/>
        <path d="M12 19c2 0 3-1.5 3-3s-1-3-3-3-3 1.5-3 3 1 3 3 3z"/>
        <path d="M5 12c0 2 1.5 3 3 3s3-1 3-3-1.5-3-3-3-3 1-3 3z"/>
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/>
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/>
      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/>
    </svg>
  )
}

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

  // Share / download — captures the off-screen full summary card
  const handleShare = async () => {
    if (!result) return
    const { default: html2canvas } = await import('html2canvas')
    // Use the dedicated off-screen summary card, not the small header
    const el = document.getElementById('summary-share-card')
    if (!el) return
    // Temporarily make it visible for capture
    el.style.left = '0'
    el.style.opacity = '1'
    await new Promise((r) => setTimeout(r, 50)) // let paint flush
    const canvas = await html2canvas(el, {
      backgroundColor: '#FAFAF5',
      scale: 2,
      useCORS: true,
      logging: false,
    })
    el.style.left = '-9999px'
    el.style.opacity = '0'
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

          {/* Three-dimensional features — Carol Jackson theory transparency */}
          {colorSeason.dimensions && (
            <div className="mb-4 p-3 bg-white rounded-xl border border-[var(--border)]">
              <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-2">判断依据 · 三维特征</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-[10px] text-[var(--warm-gray)] mb-0.5">色温</div>
                  <div className="text-sm font-medium text-[var(--charcoal)]">{colorSeason.dimensions.temperature}</div>
                </div>
                <div className="text-center border-x border-[var(--border)]">
                  <div className="text-[10px] text-[var(--warm-gray)] mb-0.5">明度</div>
                  <div className="text-sm font-medium text-[var(--charcoal)]">{colorSeason.dimensions.brightness}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-[var(--warm-gray)] mb-0.5">纯度</div>
                  <div className="text-sm font-medium text-[var(--charcoal)]">{colorSeason.dimensions.saturation}</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-[var(--warm-gray)] text-center leading-relaxed">
                基于 Carol Jackson 十二色彩季型体系
              </div>
            </div>
          )}

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

          {faceShape.avoidNecklineRecs && faceShape.avoidNecklineRecs.length > 0 && (
            <>
              <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-3">✗ 不适合的领型</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {faceShape.avoidNecklineRecs.map((n) => (
                  <div key={n.name} className="p-3 bg-white rounded-xl text-center border" style={{ borderColor: 'rgba(192,80,64,0.2)', background: 'rgba(192,80,64,0.03)' }}>
                    <div className="font-medium text-sm text-[var(--charcoal)] mb-1">{n.name}</div>
                    <div className="text-[10px] leading-tight" style={{ color: 'var(--red-no)', opacity: 0.8 }}>{n.why}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-2">✦ 发型建议</div>
          <div className="text-[10px] text-[var(--warm-gray)] mb-3 leading-relaxed">
            点击发型名称可在小红书查看图片参考
          </div>
          <div className="flex flex-wrap gap-2">
            {faceShape.hairstyleRecs.map((h) => (
              <a
                key={h}
                href={`https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(h + ' 发型')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-[var(--border)] rounded-full text-[var(--charcoal)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                {h}
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 10L10 2M10 2H5M10 2V7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
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

          {/* Outfit recs — Taobao links */}
          {style.outfitRecs && style.outfitRecs.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-2">✦ 单品推荐 · 点击去京东搜索</div>
              <div className="flex flex-wrap gap-2">
                {style.outfitRecs.map((item) => (
                  <a
                    key={item}
                    href={`https://search.jd.com/Search?keyword=${encodeURIComponent(item)}&enc=utf-8`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-[var(--border)] rounded-full text-[var(--charcoal)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 flex-shrink-0"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          )}

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
                <div className="text-xs font-medium text-[var(--charcoal)] mb-1.5 flex items-center gap-1.5">
                  <OccasionIcon occasion={occ.occasion} />
                  {occ.occasion}
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

        {/* Off-screen full summary card — captured by html2canvas */}
        <SummaryShareCard
          result={result}
          imageUrl={imageUrl}
        />

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
