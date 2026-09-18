import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { StarRating } from '../components/StarRating'
import { useWineData } from '../lib/DataContext'

function formatLongDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function TastingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getTasting, getWine, deleteTasting } = useWineData()

  const tasting = id ? getTasting(id) : undefined
  if (!tasting) {
    return (
      <>
        <Header title="Detalle de Cata" showBack />
        <main className="pt-24 px-margin text-on-surface-variant">No se encontró esta cata.</main>
      </>
    )
  }

  const { wine } = tasting
  const stats = getWine(wine.id)

  async function handleDelete() {
    if (!confirm('¿Borrar esta cata? No se puede deshacer.')) return
    await deleteTasting(tasting!.id)
    navigate('/historial')
  }

  return (
    <>
      <Header title="Detalle de Cata" showBack />
      <main className="pt-header pb-24 bg-surface min-h-screen">
        <div className="px-margin pb-space-lg space-y-space-lg pt-space-sm">
          {/* Hero */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-row items-center gap-space-md">
            <div className="relative w-24 h-32 flex-shrink-0 bg-surface-container rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-1">
              {wine.photo_url ? (
                <img className="w-full h-full object-contain" src={wine.photo_url} alt={wine.name} />
              ) : (
                <span className="material-symbols-outlined text-[32px] text-primary-container/40">wine_bar</span>
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              {wine.region && (
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                  {wine.region}
                </span>
              )}
              <h2 className="font-headline-md text-headline-md text-on-surface leading-tight mt-0.5">{wine.name}</h2>
              {wine.winery && <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-medium">{wine.winery}</p>}
              {(wine.vintage_year || wine.style) && (
                <div className="mt-2 flex items-center gap-space-xs flex-wrap">
                  {wine.vintage_year && (
                    <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
                      {wine.vintage_year}
                    </span>
                  )}
                  {wine.style && (
                    <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                      {wine.style}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ficha de la ocasión */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  calendar_today
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Fecha de Cata
                </span>
              </div>
              <span className="font-body-md text-body-md text-on-surface font-semibold capitalize">
                {formatLongDate(tasting.tasted_on)}
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col items-center justify-center text-center space-y-1.5">
              <StarRating value={tasting.rating} size={28} />
              <p className="font-headline-sm text-headline-sm text-primary-container font-bold">
                {tasting.rating.toFixed(1)} / 5
              </p>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Calificación de esta vez</span>
            </div>

            {tasting.occasion && (
              <div className="flex items-start gap-space-sm bg-surface-container-low p-space-md rounded-xl">
                <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center flex-shrink-0 text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    celebration
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-bold">
                    Ocasión
                  </span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">{tasting.occasion}</span>
                </div>
              </div>
            )}

            {tasting.comment && (
              <div>
                <div className="flex items-center gap-2 mb-space-xs">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">stylus_note</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Notas de esta vez</h3>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-md relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container" />
                  <p className="font-display italic text-body-lg text-on-surface leading-relaxed pl-2">
                    &ldquo;{tasting.comment}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Resumen agregado */}
          {stats && (
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary-container text-[22px]">history_edu</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Historial de este vino</h3>
              </div>
              <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-space-md">
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-surface font-medium">Lo tomaste</span>
                  <span className="font-headline-sm text-headline-sm text-primary-container font-bold">
                    {stats.tastingCount} {stats.tastingCount === 1 ? 'vez' : 'veces'} en total
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Promedio
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className="material-symbols-outlined text-secondary-container text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {stats.avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/mis-vinos/${wine.id}`)}
                className="w-full bg-primary-container text-on-primary font-label-lg text-label-lg h-12 rounded-full flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
              >
                <span>Ver perfil completo del vino</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          <div className="flex gap-space-sm">
            <button
              onClick={() => navigate(`/agregar?edit=${tasting.id}`)}
              className="flex-1 h-12 rounded-full border-[1.5px] border-primary-container text-primary-container font-label-lg text-label-lg"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 h-12 rounded-full border-[1.5px] border-error text-error font-label-lg text-label-lg"
            >
              Borrar
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
