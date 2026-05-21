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

export default function FeaturesPage() {
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

        {/* REPORT PREVIEW */}
        <section className="px-5 py-20 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[3px] text-[var(--gold)] mb-3 uppercase">Report Preview</div>
            <h2 className="font-serif text-2xl font-medium text-[var(--charcoal)] mb-2">你将获得的报告</h2>
            <p className="text-sm text-[var(--warm-gray)]" style={{ textWrap: 'balance' }}>示例：暖秋型 · 鹅蛋脸 · X型身材 · 知性风</p>
          </div>

          <div className="bg-[var(--cream)] rounded-3xl border border-[var(--border)] shadow-card overflow-hidden">
            {/* Report header */}
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--ivory)] flex items-center justify-center text-[var(--gold)] flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--charcoal)]">个人形象诊断报告</div>
                <div className="text-[10px] text-[var(--warm-gray)]">焕颜AI · 专业形象顾问体系</div>
              </div>
              <span className="px-3 py-1 bg-[var(--gold)] text-white text-xs rounded-full flex-shrink-0">暖秋型</span>
            </div>

            {/* Color season block */}
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <div className="text-[10px] tracking-[1px] text-[var(--gold)] mb-1">色彩季型</div>
              <div className="font-serif text-base font-medium text-[var(--charcoal)] mb-2">暖秋 · Warm Autumn</div>
              <p className="text-xs text-[var(--warm-gray)] leading-relaxed mb-3" style={{ textWrap: 'balance' }}>暖色温 · 中等明度 · 柔和纯度。大地色系与你天然共鸣，芥末黄、砖红、橄榄绿是你的高光色。</p>
              <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-2">✦ 专属色板</div>
              <div className="flex gap-3 flex-wrap mb-3">
                {[['#D0A030','芥末黄'],['#C86840','砖红'],['#787840','橄榄绿'],['#D08040','南瓜橙'],['#905830','赤褐'],['#C8A060','驼色']].map(([hex,name]) => (
                  <div key={name} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full shadow-sm" style={{ backgroundColor: hex }} />
                    <span className="text-[9px] text-[var(--warm-gray)]">{name}</span>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 bg-[rgba(184,144,96,0.07)] border-l-2 border-[var(--gold)] rounded-r-lg text-xs text-[var(--warm-gray)] leading-relaxed">
                <span className="text-[var(--gold)] font-medium">搭配原则：</span>驼色打底 + 砖红点缀 — 大地撞色，避免全身银灰或冰感配色
              </div>
            </div>

            {/* Face shape block */}
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <div className="text-[10px] tracking-[1px] text-[var(--gold)] mb-1">脸型分析</div>
              <div className="font-serif text-base font-medium text-[var(--charcoal)] mb-2">鹅蛋脸 · Oval</div>
              <p className="text-xs text-[var(--warm-gray)] leading-relaxed mb-3" style={{ textWrap: 'balance' }}>颅宽与颧宽相近，下颌稍窄，线条柔和均衡。黄金比例脸型，绝大多数领型均适配。</p>
              <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-2">✦ 推荐领型</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[['船领','水平线条强调锁骨'],['V领','纵向引导拉长颈部'],['方领','结构感强知性气场']].map(([name,why]) => (
                  <div key={name} className="p-2.5 bg-[var(--bg)] rounded-xl text-center border border-[var(--border)]">
                    <div className="text-sm font-medium text-[var(--charcoal)] mb-1">{name}</div>
                    <div className="text-[9px] text-[var(--warm-gray)] leading-tight">{why}</div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] tracking-[1px] text-[var(--warm-gray)] mb-2">✦ 发型建议（可点击查看小红书参考）</div>
              <div className="flex flex-wrap gap-2">
                {['中分长直发','锁骨波浪卷','高马尾'].map((h) => (
                  <span key={h} className="px-3 py-1 text-xs bg-[var(--bg)] border border-[var(--border)] rounded-full text-[var(--charcoal)]">{h} ↗</span>
                ))}
              </div>
            </div>

            {/* Style block */}
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <div className="text-[10px] tracking-[1px] text-[var(--gold)] mb-1">穿搭风格</div>
              <div className="font-serif text-base font-medium text-[var(--charcoal)] mb-3">知性风 · Intellectual</div>
              <div className="p-3 bg-[var(--ivory)] rounded-xl border border-[var(--border)] mb-3">
                <div className="text-[10px] tracking-[1px] text-[var(--gold)] mb-2">为什么适合你</div>
                <div className="flex flex-wrap gap-1.5 items-center text-xs">
                  <span className="px-2 py-1 bg-white rounded-lg border border-[var(--border)] text-[var(--charcoal)]">暖调底色</span>
                  <span className="text-[var(--gold)]">+</span>
                  <span className="px-2 py-1 bg-white rounded-lg border border-[var(--border)] text-[var(--charcoal)]">均衡脸型</span>
                  <span className="text-[var(--gold)]">+</span>
                  <span className="px-2 py-1 bg-white rounded-lg border border-[var(--border)] text-[var(--charcoal)]">气质偏成熟</span>
                  <span className="text-[var(--gold)]">→</span>
                  <span className="px-2.5 py-1 bg-[var(--gold)] text-white rounded-lg font-medium">知性风</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[['上衣廓形','结构感·修身不紧绷'],['下装廓形','直筒·微A·铅笔裙'],['材质方向','哑光为主·少光泽感'],['配饰点睛','金色金属·暖调皮革']].map(([label,val]) => (
                  <div key={label} className="p-2.5 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
                    <div className="text-[9px] text-[var(--warm-gray)] mb-1">{label}</div>
                    <div className="text-xs font-medium text-[var(--charcoal)]">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div className="px-5 py-4">
              <div className="text-[10px] tracking-[1px] text-[var(--gold)] mb-3">场合穿搭建议</div>
              <div className="space-y-2">
                {[
                  { occ:'职场', outfit:'驼色羊绒外套 + 白色真丝衬衫 + 深棕直筒裤', dots:['#C8A060','#F0E8D8','#503820'], logic:'大地三色调，暖调无冲突' },
                  { occ:'约会', outfit:'砖红针织 + 米色A字裙 + 棕色细跟鞋', dots:['#C86840','#E0D0B8','#906040'], logic:'高纯度+低纯度，层次自然' },
                  { occ:'日常', outfit:'橄榄绿夹克 + 白T + 深棕锥形裤', dots:['#787840','#F8F4EC','#503820'], logic:'质感层次+留白过渡' },
                ].map(({ occ, outfit, dots, logic }) => (
                  <div key={occ} className="p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium text-[var(--charcoal)]">{occ}</span>
                      <div className="flex gap-1 ml-auto">
                        {dots.map((hex) => <div key={hex} className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: hex }} />)}
                      </div>
                    </div>
                    <div className="text-xs text-[var(--charcoal)] mb-1.5">{outfit}</div>
                    <div className="text-[10px] text-[var(--warm-gray)] px-2 py-1 bg-[rgba(184,144,96,0.06)] rounded-lg">
                      <span className="text-[var(--gold)] font-medium">搭配逻辑：</span>{logic}
                    </div>
                  </div>
                ))}
              </div>
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
