import { ColorSwatch as ColorSwatchType } from '@/types/analysis'

export function ColorSwatch({ swatch, faded }: { swatch: ColorSwatchType; faded?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 ${faded ? 'opacity-50' : ''}`}>
      <div
        className="w-10 h-10 rounded-full border"
        style={{
          backgroundColor: swatch.hex,
          borderColor: faded ? '#ccc' : 'transparent',
          borderStyle: faded ? 'dashed' : 'solid',
          borderWidth: faded ? 1.5 : 0,
        }}
      />
      <span className="text-[10px] text-[var(--warm-gray)] text-center leading-tight">
        {swatch.name}
      </span>
    </div>
  )
}
