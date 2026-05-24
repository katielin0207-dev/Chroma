import { ColorSwatch as ColorSwatchType } from '@/types/analysis'

interface Props {
  swatch: ColorSwatchType
  /** Dimmed/crossed-out style for "avoid" colors */
  faded?: boolean
  /** Compact mode — smaller swatch for palette strip */
  compact?: boolean
}

export function ColorSwatch({ swatch, faded, compact }: Props) {
  const size = compact ? 'w-8 h-8' : 'w-12 h-12'

  return (
    <div className={`flex flex-col items-center gap-1.5 ${faded ? 'opacity-50' : ''}`}>
      <div
        className={`${size} rounded-xl relative`}
        style={{ backgroundColor: swatch.hex }}
      >
        {faded && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/30">
            <span className="text-white text-xs font-bold drop-shadow">×</span>
          </div>
        )}
      </div>
      <span className={`text-[10px] text-center leading-tight ${faded ? 'text-[var(--warm-gray)]' : 'text-[var(--charcoal)]'} max-w-[3rem]`}>
        {swatch.name}
      </span>
    </div>
  )
}
