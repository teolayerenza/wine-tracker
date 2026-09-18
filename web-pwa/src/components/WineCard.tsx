import { Link } from 'react-router-dom'
import type { WineWithStats } from '../types'

export function WineCard({ wine }: { wine: WineWithStats }) {
  return (
    <Link to={`/mis-vinos/${wine.id}`}>
      <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform">
        <div className="relative w-full aspect-[3/4] bg-surface-container flex items-center justify-center p-2">
          {wine.photo_url ? (
            <img className="w-full h-full object-contain" src={wine.photo_url} alt={wine.name} />
          ) : (
            <span className="material-symbols-outlined text-[36px] text-primary-container/40">wine_bar</span>
          )}
          <span className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold text-primary-container">
            {wine.tastingCount} {wine.tastingCount === 1 ? 'vez' : 'veces'}
          </span>
        </div>
        <div className="p-space-sm flex flex-col gap-0.5">
          {wine.winery && (
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant truncate">
              {wine.winery}
            </span>
          )}
          <h3 className="font-headline-md text-headline-md text-on-surface leading-tight truncate">{wine.name}</h3>
          <div className="flex items-center gap-1 text-secondary-container">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {wine.avgRating.toFixed(1)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
