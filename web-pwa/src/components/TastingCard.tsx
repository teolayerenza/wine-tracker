import { Link } from 'react-router-dom'
import { StarRating } from './StarRating'
import type { TastingWithWine } from '../lib/DataContext'

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function TastingCard({ tasting }: { tasting: TastingWithWine }) {
  const { wine } = tasting
  return (
    <Link to={`/historial/${tasting.id}`}>
      <article className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all duration-200 active:scale-[0.99] flex flex-col gap-3">
        <div className="flex gap-space-md">
          <div className="relative w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center p-1">
            {wine.photo_url ? (
              <img className="w-full h-full object-contain" src={wine.photo_url} alt={wine.name} />
            ) : (
              <span className="material-symbols-outlined text-[28px] text-primary-container/40">wine_bar</span>
            )}
            {wine.vintage_year && (
              <div className="absolute top-1 left-1 bg-surface-container-lowest/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-primary">
                {wine.vintage_year}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <div className="flex items-center justify-between gap-1 mb-0.5">
                {wine.winery && (
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant truncate">
                    {wine.winery}
                  </span>
                )}
                <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">
                  {formatDate(tasting.tasted_on)}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface leading-tight truncate">
                {wine.name}
              </h2>
              {wine.region && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[13px] mr-1 text-primary">location_on</span>
                    {wine.region}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-1">
              <StarRating value={tasting.rating} />
            </div>
          </div>
        </div>

        {tasting.comment && (
          <div className="bg-surface-container-low rounded-xl p-2.5 flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">format_quote</span>
            <p className="font-display italic text-body-md text-on-surface-variant line-clamp-2">
              {tasting.comment}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          {tasting.occasion ? (
            <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-secondary">celebration</span>
              {tasting.occasion}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
            Ver detalle
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
