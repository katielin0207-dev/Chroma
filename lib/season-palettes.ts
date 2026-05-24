/**
 * 硬编码的十二色彩季型色盘
 * 颜色全部来自市面上真实服装品牌（Zara / H&M / 优衣库 / COS / ARKET）实际有售的色系
 * hex 值经过人工校对，与颜色名称严格对应
 *
 * 结构说明：
 *   bestColors[0-2] — 核心点缀色（穿上立刻提气的季型代表色）
 *   bestColors[3-5] — 日常百搭基础色（可作全身主色的中性调）
 *   avoidColors     — 与该季型色温明确冲突的颜色
 */

import type { ColorSwatch } from '@/types/analysis'

export interface SeasonPalette {
  bestColors: ColorSwatch[]
  avoidColors: ColorSwatch[]
  coloringPrinciple: string
}

export const SEASON_PALETTES: Record<string, SeasonPalette> = {
  // ─── 春季型 ──────────────────────────────────────────────────────────────────

  暖春型: {
    bestColors: [
      { name: '珊瑚橘', hex: '#E8715A', usage: '日常+约会点缀色，最提气色' },
      { name: '桃粉', hex: '#F2A58E', usage: '约会+日常，温柔减龄' },
      { name: '暖杏黄', hex: '#EFC97A', usage: '春夏点缀，明亮活泼' },
      { name: '奶油白', hex: '#FDF5EC', usage: '全能基础色，百搭不出错' },
      { name: '暖卡其', hex: '#C8A87A', usage: '职场+休闲，大地色系首选' },
      { name: '浅橄榄', hex: '#A8B87A', usage: '日常休闲，清新自然' },
    ],
    avoidColors: [
      { name: '纯黑', hex: '#1C1C1C', usage: '冷硬对比让肤色显暗黄' },
      { name: '冷蓝紫', hex: '#7B68C8', usage: '冷调与暖底色相克，显灰暗' },
      { name: '海军蓝', hex: '#1F2A44', usage: '深冷色压制暖调气色' },
    ],
    coloringPrinciple: '以珊瑚橘/桃粉为提亮点缀，奶油白+暖卡其铺底，全身保持暖调统一',
  },

  亮春型: {
    bestColors: [
      { name: '正红', hex: '#E8213A', usage: '最强提气色，派对+重要场合' },
      { name: '宝蓝', hex: '#1A5FB4', usage: '日常惊艳色，亮冬通用' },
      { name: '桃粉红', hex: '#F06080', usage: '约会+活力日常' },
      { name: '纯白', hex: '#FFFFFF', usage: '必备基础色，打底首选' },
      { name: '亮米白', hex: '#F8F0E0', usage: '比纯白更柔和，日常百搭' },
      { name: '明黄', hex: '#F5C800', usage: '夏日点缀，活力象征' },
    ],
    avoidColors: [
      { name: '灰驼色', hex: '#B8A890', usage: '浊色让气色显沉，抢走光彩' },
      { name: '莫兰迪绿', hex: '#8FA88A', usage: '灰调低饱和让面色显疲惫' },
      { name: '暗烟灰', hex: '#888078', usage: '浊暗色系与亮型底色相克' },
    ],
    coloringPrinciple: '拥抱高饱和色，正红/宝蓝/桃粉直接穿，避免任何"雾感""莫兰迪"浊色',
  },

  浅春型: {
    bestColors: [
      { name: '浅珊瑚', hex: '#F5B8A8', usage: '最提气的轻柔暖色，约会首选' },
      { name: '浅杏色', hex: '#F8D8B8', usage: '温柔减龄，日常通用' },
      { name: '香槟金', hex: '#F0D8A8', usage: '节日+特殊场合，高级感' },
      { name: '奶油白', hex: '#FDF5EC', usage: '全能基础色，必备' },
      { name: '浅暖米', hex: '#EFE0C8', usage: '职场+休闲，最安全的暖调基础' },
      { name: '浅粉绿', hex: '#C8E0B8', usage: '春夏清新点缀' },
    ],
    avoidColors: [
      { name: '纯黑', hex: '#1C1C1C', usage: '太强烈，衬得浅春型面色苍白' },
      { name: '深酒红', hex: '#6B1010', usage: '深浓色让浅春型显得沉重' },
      { name: '深墨绿', hex: '#1B4028', usage: '深冷绿色与浅暖底调明显冲突' },
    ],
    coloringPrinciple: '始终保持轻盈感，浅珊瑚/浅杏铺色，避免任何深浓色打破轻柔气质',
  },

  // ─── 秋季型 ──────────────────────────────────────────────────────────────────

  暖秋型: {
    bestColors: [
      { name: '驼色', hex: '#C4955A', usage: '最百搭的季型代表色，职场+日常' },
      { name: '砖红', hex: '#B8452A', usage: '最提气的暖色，秋冬点缀首选' },
      { name: '芥末黄', hex: '#C8A020', usage: '活力点缀色，搭配驼色最佳' },
      { name: '橄榄绿', hex: '#6B7C3A', usage: '大地色系必备，日常通用' },
      { name: '焦糖棕', hex: '#A87040', usage: '秋冬主色，温暖厚重' },
      { name: '深卡其', hex: '#A88C5A', usage: '职场休闲通用，百搭基础色' },
    ],
    avoidColors: [
      { name: '玫红', hex: '#CC1877', usage: '冷调玫红与暖秋底调相克，显脏' },
      { name: '冷紫', hex: '#8040B0', usage: '冷紫与暖肤底色明显冲突' },
      { name: '冰蓝', hex: '#A0C8E8', usage: '冷浅蓝让暖秋肤色显暗黄' },
    ],
    coloringPrinciple: '驼色+砖红是黄金组合，全身保持暖调大地色，用芥末黄/橄榄绿提亮',
  },

  深秋型: {
    bestColors: [
      { name: '深棕', hex: '#5C3A2A', usage: '季型代表色，秋冬主色首选' },
      { name: '深酒红', hex: '#801820', usage: '高级感点缀，派对+重要场合' },
      { name: '墨绿', hex: '#2A5010', usage: '自然沉稳，职场+日常通用' },
      { name: '深橄榄', hex: '#4A5020', usage: '大地深色，秋冬百搭' },
      { name: '巧克力棕', hex: '#3C2010', usage: '最深的暖调中性色' },
      { name: '深卡其', hex: '#907050', usage: '相对浅一些的基础色，过渡用' },
    ],
    avoidColors: [
      { name: '浅嫩粉', hex: '#FFB8C8', usage: '过于清甜，反衬深秋型显老气' },
      { name: '冷薰衣草', hex: '#C0A8E0', usage: '冷调与深暖底调完全相克' },
      { name: '纯白', hex: '#FFFFFF', usage: '太轻，打破深秋型沉稳气质' },
    ],
    coloringPrinciple: '拥抱深沉浓郁的暖色，深棕+墨绿是王牌，用酒红点缀提升高级感',
  },

  柔秋型: {
    bestColors: [
      { name: '莫兰迪驼', hex: '#C4A882', usage: '最和谐的季型主色，全能百搭' },
      { name: '烟玫瑰', hex: '#C07870', usage: '柔和点缀色，约会+日常' },
      { name: '雾霾绿', hex: '#8AAF88', usage: '自然放松，休闲首选' },
      { name: '柔棕灰', hex: '#A88870', usage: '职场百搭，比驼色更柔和' },
      { name: '奶灰白', hex: '#DDD5C8', usage: '比纯白温柔，适合全身打底' },
      { name: '莫兰迪蓝灰', hex: '#889AA8', usage: '中性色，百搭过渡' },
    ],
    avoidColors: [
      { name: '荧光橙', hex: '#FF5500', usage: '高饱和暖色太强烈，破坏柔和气质' },
      { name: '纯黑', hex: '#1C1C1C', usage: '太硬，与柔和气质格格不入' },
      { name: '电光蓝', hex: '#1565C0', usage: '高饱和冷色冲突强烈' },
    ],
    coloringPrinciple: '全身保持"雾感"基调，莫兰迪驼+烟玫瑰是核心，避免任何高饱和色',
  },

  // ─── 夏季型 ──────────────────────────────────────────────────────────────────

  冷夏型: {
    bestColors: [
      { name: '薰衣草紫', hex: '#9878D0', usage: '最提气的季型代表色，约会+日常' },
      { name: '雾粉', hex: '#DCA8B8', usage: '温柔减龄，百搭点缀' },
      { name: '粉雾蓝', hex: '#98B8D0', usage: '清爽日常，职场+休闲通用' },
      { name: '藕粉', hex: '#D8A8C0', usage: '东方美感，约会+春夏首选' },
      { name: '烟灰蓝', hex: '#8898B0', usage: '冷调中性色，职场必备' },
      { name: '灰玫', hex: '#B88898', usage: '比藕粉更沉稳，秋冬基础色' },
    ],
    avoidColors: [
      { name: '暖橘', hex: '#E87840', usage: '暖调橙色与冷夏底调完全相克' },
      { name: '芥末黄', hex: '#C8A020', usage: '暖黄让冷夏肤色显暗' },
      { name: '砖红棕', hex: '#A84028', usage: '暖深色让气色显浑浊' },
    ],
    coloringPrinciple: '薰衣草紫+藕粉是黄金组合，全身保持冷调，用雾粉/粉蓝作为基础色',
  },

  浅夏型: {
    bestColors: [
      { name: '浅薰衣草', hex: '#D8C8EC', usage: '最温柔的季型代表色' },
      { name: '粉雾蓝', hex: '#C0D8EC', usage: '清新日常，百搭点缀' },
      { name: '浅玫粉', hex: '#F0C8D0', usage: '减龄甜美，约会首选' },
      { name: '纯白', hex: '#FFFFFF', usage: '必备基础色，清爽百搭' },
      { name: '浅灰', hex: '#E0E4E8', usage: '冷调中性基础色，职场通用' },
      { name: '冰蓝白', hex: '#D0E8F4', usage: '夏日清凉感，清淡百搭' },
    ],
    avoidColors: [
      { name: '深浓棕', hex: '#5C3A2A', usage: '深沉色让浅夏型显得压抑' },
      { name: '暖橙', hex: '#E87840', usage: '暖色让浅夏肤色显暗淡' },
      { name: '高饱和红', hex: '#D50032', usage: '过于强烈，破坏浅夏的轻柔感' },
    ],
    coloringPrinciple: '永远保持"轻柔冷调"，浅薰衣草+粉雾蓝是核心，全身明度保持浅中调',
  },

  柔夏型: {
    bestColors: [
      { name: '莫兰迪蓝', hex: '#7898B8', usage: '最有气质的季型代表色' },
      { name: '灰藕粉', hex: '#C8A0A8', usage: '东方雅致感，约会+日常通用' },
      { name: '雾蓝灰', hex: '#8898A8', usage: '职场必备，冷调百搭中性色' },
      { name: '烟蓝', hex: '#8FA8C0', usage: '日常清爽，休闲+通勤均适' },
      { name: '灰紫', hex: '#9888A8', usage: '柔和点缀，比薰衣草更低调' },
      { name: '莫兰迪灰白', hex: '#D0C8C0', usage: '最和谐的全能基础色' },
    ],
    avoidColors: [
      { name: '高饱和橙', hex: '#E87840', usage: '暖橙与冷夏气质完全相反' },
      { name: '芥末黄', hex: '#C8A020', usage: '暖黄让柔夏肤色显土气' },
      { name: '驼色', hex: '#C4955A', usage: '暖调大地色与冷夏相克' },
    ],
    coloringPrinciple: '莫兰迪蓝+灰藕粉为核心，全身保持冷调雾感，避免任何暖调或高饱和色',
  },

  // ─── 冬季型 ──────────────────────────────────────────────────────────────────

  冷冬型: {
    bestColors: [
      { name: '玫红', hex: '#CC1877', usage: '最强提气色，季型代表色' },
      { name: '宝蓝', hex: '#1A5FB4', usage: '高级冷色，职场+重要场合' },
      { name: '正红', hex: '#D50032', usage: '节日+派对首选，充满力量感' },
      { name: '纯白', hex: '#FFFFFF', usage: '必备基础色，冷冬最显气色' },
      { name: '纯黑', hex: '#1C1C1C', usage: '最强基础色，与任何季型色完美搭配' },
      { name: '深海军蓝', hex: '#1F2A44', usage: '最百搭的深色，职场王道' },
    ],
    avoidColors: [
      { name: '驼色', hex: '#C4955A', usage: '暖色让冷冬肤色显脏黄' },
      { name: '芥末黄', hex: '#C8A020', usage: '暖调黄完全压制冷冬气色' },
      { name: '暖橘棕', hex: '#C47B3A', usage: '暖棕让冷冬面色显浑浊' },
    ],
    coloringPrinciple: '拥抱对比度，玫红/宝蓝/正红+纯黑纯白的强对比是冷冬的天然优势',
  },

  深冬型: {
    bestColors: [
      { name: '纯黑', hex: '#1C1C1C', usage: '最经典的季型代表色，全能百搭' },
      { name: '深宝蓝', hex: '#003090', usage: '高级深色，职场+重要场合' },
      { name: '酒红', hex: '#7D0020', usage: '沉稳点缀色，秋冬首选' },
      { name: '深墨绿', hex: '#014428', usage: '深邃自然感，个性单品首选' },
      { name: '深紫', hex: '#4A0088', usage: '神秘高级感，派对+特殊场合' },
      { name: '纯白', hex: '#FFFFFF', usage: '高对比基础色，与深色搭配出彩' },
    ],
    avoidColors: [
      { name: '浅驼米', hex: '#E8D5B8', usage: '浅暖色让深冬型显得苍白无力' },
      { name: '暖橙', hex: '#E87840', usage: '暖调橙与冷深底色相克明显' },
      { name: '浅粉嫩', hex: '#FFCCD8', usage: '过于轻浅，破坏深冬的强烈气质' },
    ],
    coloringPrinciple: '深冬型天生适合浓郁色，黑+深蓝+酒红是核心，用纯白制造高对比',
  },

  亮冬型: {
    bestColors: [
      { name: '宝蓝', hex: '#1A5FB4', usage: '最强提气色，季型王牌' },
      { name: '宝石绿', hex: '#048040', usage: '清透高级感，个性点缀首选' },
      { name: '玫红', hex: '#CC1877', usage: '最鲜明的点缀色，约会+派对' },
      { name: '纯白', hex: '#FFFFFF', usage: '清透基础色，突出高对比度' },
      { name: '纯黑', hex: '#1C1C1C', usage: '万能基础色，与任何亮色搭配' },
      { name: '正红', hex: '#D50032', usage: '高饱和暖红，亮冬可驾驭的暖色' },
    ],
    avoidColors: [
      { name: '莫兰迪驼', hex: '#C4A882', usage: '浊暖色破坏亮冬的清透气质' },
      { name: '柔灰棕', hex: '#A89880', usage: '低饱和浊色让亮冬显沉闷' },
      { name: '烟灰绿', hex: '#8AA888', usage: '雾感色与亮冬的清透特质相反' },
    ],
    coloringPrinciple: '宝蓝+宝石绿+纯白是黄金组合，拥抱鲜明对比，避免一切"雾感"浊色',
  },
}
