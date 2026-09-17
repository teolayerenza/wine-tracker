import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { WineCard } from '../components/WineCard'
import { EmptyState } from '../components/EmptyState'
import { useWineData } from '../lib/DataContext'

export function MisVinos() {
  const { wines, loading } = useWineData()
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => wines.filter((w) => w.name.toLowerCase().includes(search.toLowerCase())),
    [wines, search],
  )

  return (
    <>
      <Header title="Wine Tracker" subtitle="Mis Vinos" />
      <main className="pt-16 pb-[5.5rem] bg-surface min-h-screen">
        <div className="px-margin pt-space-md pb-space-sm flex flex-col gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              Cava Personal
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Mis Vinos</h1>
          </div>
          <input
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-[1.5px] focus:border-primary-container"
          />
        </div>

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon="wine_bar"
            title="Todavía no conocés ningún vino"
            subtitle="Cada vino que cargues en el historial va a aparecer acá."
          />
        )}

        <div className="px-margin grid grid-cols-2 gap-space-sm mt-1">
          {filtered.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </main>
    </>
  )
}
