import Link from 'next/link'
import { Navbar } from '@/components/common/Navbar'

const SEASONS = [
  { name: '暖春', color: '#E8A870', desc: '明亮 · 温暖' },
  { name: '亮春', color: '#F0C040', desc: '鲜亮 · 清新' },
  { name: '浅春', color: '#F5D8B0', desc: '浅淡 · 柔和' },
  { name: '暖秋', color: '#A07840', desc: '厚重 · 大地' },
  { name: '深秋', color: '#7A4828', desc: '深沉 · 复古' },
  { name: '柔秋', color: '#C09870', desc: '柔和 · 雾感' },
  { name: '冷夏', color: '#8898C0', desc: '清冷 · 梦幻' },
  { name: '浅夏', color: '#C0C8E0', desc: '浅淡 · 优雅' },
  { name: '柔夏', color: '#A0A8B8', desc: '柔灰 · 莫兰迪' },
  { name: '冷冬', color: '#6080B8', desc: '清冽 · 利落' },
  { name: '深冬', color: '#483860', desc: '深邃 · 戏剧' },
  { name: '亮冬', color: '#2040A8', desc: '鲜明 · 力量' },
]

const FACE_SHAPES = [
  { name: '鹅蛋脸', desc: '比例均衡 · 百搭脸型' },
  { name: '圆脸', desc: '柔和饱满 · 减龄亲和' },
  { name: '方脸', desc: '轮廓利落 · 高级感强' },
  { name: '心形脸', desc: '上宽下窄 · 灵动甜美' },
  { name: '菱形脸', desc: '颧骨突出 · 立体精致' },
  { name: '长脸', desc: '修长优雅 · 气质成熟' },
]

const BODY_SHAPES = [
  { name: 'X 型', desc: '腰部明显 · 强调腰线' },
  { name: 'A 型', desc: '下身丰满 · 上身扩张' },
  { name: 'H 型', desc: '直线型 · 营造曲线' },
  { name: 'V 型', desc: '肩宽臀窄 · 平衡下身' },
  { name: 'O 型', desc: '腰腹丰满 · 纵向延伸' },
]

const FEATURES = [
  { title: '十二色彩季型', desc: '基于 Carol Jackson 专业体系，精准判断色温、明度、纯度，给出专属色板' },
  { title: '六大脸型诊断', desc: '识别鹅蛋·圆·方·心形·菱形·长脸，给出专属领型与发型方案' },
  { title: '身材比例分析', desc: '判断 X / A / H / V / O 型，推荐最扬长避短的廓形搭配' },
  { title: 'OOTD 衣橱诊断', desc: '上传你的单品，AI 逐件判断是否适合你的季型，并组合成完整穿搭方案' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-12">
        {/* HERO */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 min-h-[92vh]">
          <div className="text-[10px] tracking-[4px] text-[var(--gold)] mb-5 uppercase">AI 个人形象顾问</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[var(--charcoal)] leading-tight mb-5 max-w-sm" style={{ textWrap: 'balance' }}>
            找到属于你的<br /><em className="not-italic text-[var(--gold)]">专属色彩</em>
          </h1>
          <p className="text-base text-[var(--warm-gray)] leading-relaxed mb-12 max-w-xs" style={{ textWrap: 'balance' }}>
            一张照片，30 秒<br />季型 · 脸型 · 身材 · 穿搭，一次说清
          </p>

          {/* Scroll prompt instead of CTA */}
          <a href="#features" className="group flex flex-col items-center gap-2 text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors duration-300">
            <span className="text-[10px] tracking-[3px] uppercase">下滑发现更多</span>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.2" className="animate-bounce-slow">
              <path d="M8 2 L8 16 M3 11 L8 16 L13 11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="absolute bottom-6 text-[10px] text-[var(--warm-gray)] tracking-wider">
            无需注册 · 照片仅用于分析不存储
          </div>
        </section>

        {/* 12 SEASONS */}
        <section id="features" className="px-5 py-20 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3 uppercase">Colour Analysis</div>
            <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">十二色彩季型</h2>
            <p className="text-sm text-[var(--warm-gray)]" style={{ textWrap: 'balance' }}>色温 × 明度 × 纯度 — 三维交叉确定专属季型</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {SEASONS.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-2 p-3 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
                <div className="w-10 h-10 rounded-full shadow-card" style={{ backgroundColor: s.color }} />
                <div className="text-center">
                  <div className="text-sm font-medium text-[var(--charcoal)]">{s.name}</div>
                  <div className="text-[9px] text-[var(--warm-gray)] mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6 FACE SHAPES */}
        <section className="px-5 py-20 bg-[var(--cream)]">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3 uppercase">Face Shape</div>
              <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">六大脸型诊断</h2>
              <p className="text-sm text-[var(--warm-gray)]" style={{ textWrap: 'balance' }}>识别脸型 · 推荐领型 · 匹配发型</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FACE_SHAPES.map((f) => (
                <div key={f.name} className="flex flex-col items-center gap-3 p-4 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                  <FaceIcon shape={f.name} />
                  <div className="text-center">
                    <div className="text-sm font-medium text-[var(--charcoal)]">{f.name}</div>
                    <div className="text-[10px] text-[var(--warm-gray)] mt-1 leading-relaxed" style={{ textWrap: 'balance' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 BODY SHAPES */}
        <section className="px-5 py-20 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3 uppercase">Body Shape</div>
            <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">五大身材类型</h2>
            <p className="text-sm text-[var(--warm-gray)]" style={{ textWrap: 'balance' }}>识别比例 · 推荐廓形 · 扬长避短</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {BODY_SHAPES.map((b) => (
              <div key={b.name} className="flex flex-col items-center gap-3 p-4 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
                <BodyIcon shape={b.name} />
                <div className="text-center">
                  <div className="text-sm font-medium text-[var(--charcoal)]">{b.name}</div>
                  <div className="text-[10px] text-[var(--warm-gray)] mt-1 leading-relaxed" style={{ textWrap: 'balance' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OOTD PREVIEW */}
        <section className="px-5 py-20 bg-[var(--cream)]">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3 uppercase">OOTD · 衣橱诊断</div>
              <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">上传单品 · AI 直接判断</h2>
              <p className="text-sm text-[var(--warm-gray)]" style={{ textWrap: 'balance' }}>对照你的季型、脸型、身材，逐件给出穿不穿的理由</p>
            </div>

            {/* Mockup cards */}
            <div className="space-y-3">
              {/* Compatible item */}
              <div className="flex gap-3 p-4 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-[#A07840] to-[#7A4828] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 text-[10px] tracking-wider bg-[var(--green-ok)]/10 text-[var(--green-ok)] rounded-full border border-[var(--green-ok)]/20">✓ 适合你</span>
                  </div>
                  <div className="text-xs text-[var(--charcoal)] leading-relaxed mb-1">驼色羊绒外套</div>
                  <div className="text-[11px] text-[var(--warm-gray)] leading-relaxed" style={{ textWrap: 'balance' }}>
                    暖调大地色，与你的暖秋型肤色完美呼应
                  </div>
                </div>
              </div>

              {/* Not compatible item */}
              <div className="flex gap-3 p-4 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-[#D8A8C8] to-[#A878A0] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 text-[10px] tracking-wider bg-[var(--red-no)]/10 text-[var(--red-no)] rounded-full border border-[var(--red-no)]/20">× 不建议</span>
                  </div>
                  <div className="text-xs text-[var(--charcoal)] leading-relaxed mb-1">冷调粉紫针织</div>
                  <div className="text-[11px] text-[var(--warm-gray)] leading-relaxed mb-2" style={{ textWrap: 'balance' }}>
                    冷色调会让你的暖肤色显暗，气色不通透
                  </div>
                  <div className="text-[11px] text-[var(--gold)] leading-relaxed pt-2 border-t border-[var(--border)]" style={{ textWrap: 'balance' }}>
                    建议替换为：杏色 / 暖米色同款
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-[10px] text-[var(--warm-gray)] tracking-wider uppercase">
              基于你的专属档案，绝不模糊判断
            </div>
          </div>
        </section>

        {/* 4 FEATURES OVERVIEW */}
        <section className="px-5 py-20">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3 uppercase">What You Get</div>
              <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)]">四维形象诊断</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="p-5 bg-[var(--cream)] rounded-2xl border border-[var(--border)]">
                  <div className="font-serif text-[var(--gold)] text-sm mb-3 tracking-widest">0{i + 1}</div>
                  <div className="font-medium text-sm text-[var(--charcoal)] mb-2">{f.title}</div>
                  <div className="text-xs text-[var(--warm-gray)] leading-relaxed" style={{ textWrap: 'balance' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 STEPS */}
        <section className="px-5 py-20 max-w-lg mx-auto bg-[var(--cream)]">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3 uppercase">How It Works</div>
            <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)]">三步获得专属报告</h2>
          </div>
          <div className="space-y-4">
            {[
              { n: '01', title: '上传正面照片', desc: '选择一张光线均匀、面部清晰的照片' },
              { n: '02', title: 'AI 多维分析', desc: '通义千问视觉模型分析色彩季型、脸型、身材比例' },
              { n: '03', title: '获得专属方案', desc: '完整报告 + 可直接穿的 OOTD 搭配建议' },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 items-start p-4 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                <div className="font-serif text-2xl text-[var(--gold)] opacity-60 w-8 flex-shrink-0 leading-none pt-1">{step.n}</div>
                <div>
                  <div className="font-medium text-sm text-[var(--charcoal)] mb-1">{step.title}</div>
                  <div className="text-xs text-[var(--warm-gray)] leading-relaxed" style={{ textWrap: 'balance' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 py-24 text-center bg-[var(--charcoal)]">
          <div className="text-[10px] tracking-[4px] text-[var(--gold)] mb-5 uppercase">开始你的形象之旅</div>
          <h2 className="font-serif text-3xl font-medium text-white mb-4 leading-tight" style={{ textWrap: 'balance' }}>
            让每一件单品<br />都物尽其用
          </h2>
          <p className="text-sm text-white/50 mb-10 leading-relaxed" style={{ textWrap: 'balance' }}>
            十二色彩季型 · 六大脸型 · 身材分析<br />衣橱诊断 · OOTD 搭配方案
          </p>
          <Link href="/upload" className="inline-block px-12 py-4 bg-[var(--gold)] text-white text-sm font-medium tracking-widest rounded-full hover:bg-[var(--gold-lt)] transition-colors duration-300">
            免费开始测试
          </Link>
          <div className="mt-5 text-xs text-white/30 tracking-wider">无需注册 · 基于 Carol Jackson 色彩体系</div>
        </section>

        <footer className="text-center py-8 text-xs text-[var(--warm-gray)] border-t border-[var(--border)]">
          焕颜AI © 2026 — 基于十二色彩季型理论的 AI 形象诊断
        </footer>
      </main>
    </>
  )
}

// ===== Inline icon components =====

function FaceIcon({ shape }: { shape: string }) {
  const stroke = 'var(--charcoal)'
  const fill = 'var(--cream)'
  // Different ellipse/rect proportions per shape
  const paths: Record<string, JSX.Element> = {
    鹅蛋脸: <ellipse cx="24" cy="26" rx="13" ry="17" />,
    圆脸: <ellipse cx="24" cy="26" rx="15" ry="15" />,
    方脸: <rect x="10" y="12" width="28" height="28" rx="6" />,
    心形脸: <path d="M10 18 Q10 10 18 10 Q24 10 24 14 Q24 10 30 10 Q38 10 38 18 Q38 32 24 42 Q10 32 10 18 Z" />,
    菱形脸: <path d="M24 9 L40 26 L24 43 L8 26 Z" />,
    长脸: <ellipse cx="24" cy="26" rx="11" ry="19" />,
  }
  return (
    <svg width="48" height="52" viewBox="0 0 48 52" fill={fill} stroke={stroke} strokeWidth="1.5">
      {paths[shape]}
    </svg>
  )
}

function BodyIcon({ shape }: { shape: string }) {
  const stroke = 'var(--charcoal)'
  const fill = 'var(--cream)'
  const paths: Record<string, JSX.Element> = {
    'X 型': <path d="M14 8 L34 8 L26 26 L34 44 L14 44 L22 26 Z" />,
    'A 型': <path d="M18 8 L30 8 L30 22 L38 44 L10 44 L18 22 Z" />,
    'H 型': <path d="M14 8 L34 8 L34 44 L14 44 Z" />,
    'V 型': <path d="M10 8 L38 8 L30 22 L30 44 L18 44 L18 22 Z" />,
    'O 型': <ellipse cx="24" cy="26" rx="14" ry="18" />,
  }
  return (
    <svg width="48" height="52" viewBox="0 0 48 52" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
      {paths[shape]}
    </svg>
  )
}
