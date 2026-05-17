import Link from 'next/link'
import { Navbar } from '@/components/common/Navbar'

const SEASONS = [
  { name: '暖春', color: '#E8A870', desc: '明亮·温暖·活力' },
  { name: '亮春', color: '#F0C040', desc: '鲜亮·清新·明快' },
  { name: '浅春', color: '#F5D8B0', desc: '浅淡·柔和·轻盈' },
  { name: '暖秋', color: '#A07840', desc: '厚重·大地·温润' },
  { name: '深秋', color: '#7A4828', desc: '深沉·复古·醇厚' },
  { name: '柔秋', color: '#C09870', desc: '柔和·哑光·雾感' },
  { name: '冷夏', color: '#8898C0', desc: '清冷·薰衣草·梦幻' },
  { name: '浅夏', color: '#C0C8E0', desc: '浅淡·粉雾·优雅' },
  { name: '柔夏', color: '#A0A8B8', desc: '柔灰·莫兰迪·从容' },
  { name: '冷冬', color: '#6080B8', desc: '清冽·纯净·利落' },
  { name: '深冬', color: '#483860', desc: '深邃·戏剧·高级' },
  { name: '亮冬', color: '#2040A8', desc: '鲜明·对比·力量' },
]

const FEATURES = [
  { icon: '🎨', title: '十二色彩季型', desc: '基于 Carol Jackson 专业体系，精准判断色温、明度、纯度，给出专属色板' },
  { icon: '◎', title: '六大脸型诊断', desc: '识别鹅蛋·圆·方·心形·菱形·长脸，给出专属领型与妆容方案' },
  { icon: '◈', title: '身材比例分析', desc: '判断 X / A / H / V / O / 纤细型，推荐最扬长避短的廓形搭配' },
  { icon: '✦', title: 'OOTD 衣橱诊断', desc: '上传你的单品，AI 逐件判断是否适合你的季型，并组合成完整穿搭方案' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-12">
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 min-h-[88vh]">
          <div className="text-[10px] tracking-[4px] text-[var(--gold)] mb-5 uppercase">AI 个人形象顾问</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[var(--charcoal)] leading-tight mb-5 max-w-sm">
            找到属于你的<br /><em className="not-italic text-[var(--gold)]">专属色彩</em>
          </h1>
          <p className="text-base text-[var(--warm-gray)] leading-relaxed mb-10 max-w-xs">
            上传一张照片<br />AI 30秒分析你的季型、脸型、身材<br />给出可直接穿的穿搭方案
          </p>
          <Link href="/upload" className="px-10 py-4 bg-[var(--charcoal)] text-white text-sm font-medium tracking-widest rounded-full hover:bg-[var(--gold)] transition-colors duration-300">
            免费开始测试
          </Link>
          <div className="mt-5 text-xs text-[var(--warm-gray)]">无需注册 · 照片仅用于分析不存储</div>
        </section>

        <section className="px-5 py-16 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3">COLOUR ANALYSIS</div>
            <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">十二色彩季型</h2>
            <p className="text-sm text-[var(--warm-gray)]">色温 × 明度 × 纯度 — 三维交叉确定你的专属季型</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {SEASONS.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-2 p-3 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: s.color }} />
                <div className="text-center">
                  <div className="text-sm font-medium text-[var(--charcoal)]">{s.name}</div>
                  <div className="text-[9px] text-[var(--warm-gray)] mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 bg-[var(--cream)]">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3">WHAT YOU GET</div>
              <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)]">四维形象诊断</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="p-5 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <div className="font-medium text-sm text-[var(--charcoal)] mb-1.5">{f.title}</div>
                  <div className="text-xs text-[var(--warm-gray)] leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 max-w-lg mx-auto">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3">HOW IT WORKS</div>
            <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)]">三步获得专属报告</h2>
          </div>
          <div className="space-y-4">
            {[
              { n: '01', title: '上传正面照片', desc: '选择一张光线均匀、面部清晰的照片' },
              { n: '02', title: 'AI 多维分析', desc: '通义千问视觉模型分析色彩季型、脸型、身材比例' },
              { n: '03', title: '获得专属方案', desc: '完整报告 + 可直接穿的 OOTD 搭配建议' },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 items-start p-4 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
                <div className="font-serif text-2xl text-[var(--gold)] opacity-60 w-8 flex-shrink-0 leading-none pt-1">{step.n}</div>
                <div>
                  <div className="font-medium text-sm text-[var(--charcoal)] mb-1">{step.title}</div>
                  <div className="text-xs text-[var(--warm-gray)] leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 text-center bg-[var(--charcoal)]">
          <div className="text-[10px] tracking-[4px] text-[var(--gold)] mb-5">开始你的形象之旅</div>
          <h2 className="font-serif text-3xl font-medium text-white mb-4 leading-tight">让每一件单品<br />都物尽其用</h2>
          <p className="text-sm text-white/50 mb-8 leading-relaxed">十二色彩季型 · 六大脸型 · 身材分析<br />衣橱诊断 · OOTD 搭配方案</p>
          <Link href="/upload" className="inline-block px-10 py-4 bg-[var(--gold)] text-white text-sm font-medium tracking-widest rounded-full hover:bg-[var(--gold-lt)] transition-colors duration-300">
            免费开始测试
          </Link>
          <div className="mt-5 text-xs text-white/30">无需注册 · 基于 Carol Jackson 色彩体系 · 通义千问视觉模型</div>
        </section>

        <footer className="text-center py-8 text-xs text-[var(--warm-gray)] border-t border-[var(--border)]">
          焕颜AI © 2024 — 基于十二色彩季型理论的 AI 形象诊断
        </footer>
      </main>
    </>
  )
}
