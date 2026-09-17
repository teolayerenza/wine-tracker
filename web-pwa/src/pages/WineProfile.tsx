import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { useWineData } from '../lib/DataContext'

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function WineProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getWine, tastings, deleteWine } = useWineData()

  const wine = id ? getWine(id) : undefined
  if (!wine) {
    return (
      <>
        <Header title="Perfil del vino" showBack />
        <main className="pt-24 px-margin text-on-surface-variant">No se encontró este vino.</main>
      </>
    )
  }

  const wineTastings = tastings.filter((t) => t.wine_id === wine.id).sort((a, b) => b.tasted_on.localeCompare(a.tasted_on))

  async function handleDelete() {
    if (!confirm(`¿Borrar "${wine!.name}" y todas sus catas? No se puede deshacer.`)) return
    await deleteWine(wine!.id)
    navigate('/mis-vinos')
  }

  return (
    <>
      <Header title="Perfil del vino" showBack />
      <main className="pt-header pb-28 bg-surface min-h-screen">
        <section className="px-margin mt-space-sm">
          <div className="relative w-full rounded-xl overflow-hidden bg-surface-container-lowest shadow-md">
            <div className="relative h-64 w-full overflow-hidden bg-surface-container-high flex items-center justify-center">
              {wine.photo_url ? (
                <img alt={wine.name} className="w-full h-full object-cover" src={wine.photo_url} />
              ) : (
                <span className="material-symbols-outlined text-[56px] text-primary-container/40">wine_bar</span>
              )}
              {wine.style && (
                <div className="absolute top-space-md left-space-md bg-primary-container text-on-primary font-label-sm text-label-sm px-space-sm py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {wine.style}
                </div>
              )}
            </div>
            <div className="p-space-lg flex flex-col gap-space-xs">
              {wine.winery && (
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                  {wine.winery}
                </span>
              )}
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight">
                {wine.name}
              </h2>
              {(wine.varietal || wine.region) && (
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
                  {[wine.varietal, wine.region].filter(Boolean).join(' · ')}
                </p>
              )}
              <div className="mt-space-md pt-space-md bg-surface-container-low rounded-xl p-space-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-headline-sm text-headline-sm font-bold shadow-sm">
                    {wine.avgRating.toFixed(1)}
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant">Promedio de estrellas</span>
                </div>
                <span className="font-label-md text-label-md px-3 py-1 rounded-full bg-surface-container-highest text-primary-container font-medium">
                  {wine.tastingCount} {wine.tastingCount === 1 ? 'Cata' : 'Catas'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-margin mt-space-lg">
          <div className="grid grid-cols-3 gap-space-sm">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container mb-2">
                <span className="material-symbols-outlined text-[18px]">wine_bar</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Degustado</p>
              <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                {wine.tastingCount} {wine.tastingCount === 1 ? 'vez' : 'veces'}
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-2">
                <span className="material-symbols-outlined text-[18px]">history</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Primera vez</p>
              <p className="font-label-md text-label-md text-on-surface font-semibold mt-1">
                {wine.firstTastedOn ? formatDate(wine.firstTastedOn) : '—'}
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-[18px]">event_repeat</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Última vez</p>
              <p className="font-label-md text-label-md text-on-surface font-semibold mt-1">
                {wine.lastTastedOn ? formatDate(wine.lastTastedOn) : '—'}
              </p>
            </div>
          </div>
        </section>

        <section className="px-margin mt-space-xl">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-md">Historial de Ocasiones</h3>
          <div className="relative pl-6 space-y-space-md before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-highest">
            {wineTastings.map((t, i) => (
              <Link key={t.id} to={`/historial/${t.id}`}>
                <article className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
                  <span
                    className={`absolute -left-[30px] top-4 w-3.5 h-3.5 rounded-full ring-4 ring-surface ${
                      i === 0 ? 'bg-primary-container' : 'bg-surface-variant'
                    }`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">
                      {formatDate(t.tasted_on)}
                    </span>
                    <div className="flex items-center text-secondary font-label-md text-label-md font-bold bg-surface-container px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      {t.rating.toFixed(1)}
                    </div>
                  </div>
                  {t.comment && (
                    <p className="font-display italic text-headline-sm text-on-surface mt-2 text-[15px] leading-relaxed line-clamp-2">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                  )}
                </article>
              </Link>
            ))}
          </div>
        </section>

        <div className="px-margin mt-space-xl">
          <button onClick={handleDelete} className="w-full h-11 rounded-full border-[1.5px] border-error text-error font-label-lg text-label-lg">
            Borrar este vino
          </button>
        </div>

        <div className="fixed bottom-4 inset-x-0 px-margin flex justify-center z-40">
          <button
            onClick={() => navigate(`/agregar?wineId=${wine.id}`)}
            className="w-full max-w-md h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-xl active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Registrar nueva cata de este vino</span>
          </button>
        </div>
      </main>
    </>
  )
}
