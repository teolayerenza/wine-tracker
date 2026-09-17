import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { TastingCard } from '../components/TastingCard'
import { EmptyState } from '../components/EmptyState'
import { useWineData } from '../lib/DataContext'

type Filter = 'todas' | 'este-mes' | 'favoritos'

export function Historial() {
  const { tastings, loading } = useWineData()
  const [filter, setFilter] = useState<Filter>('todas')

  const filtered = useMemo(() => {
    const now = new Date()
    return tastings.filter((t) => {
      if (filter === 'favoritos') return t.rating >= 5
      if (filter === 'este-mes') {
        const d = new Date(t.tasted_on + 'T00:00:00')
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }
      return true
    })
  }, [tastings, filter])

  const chips: { key: Filter; label: string; count: number }[] = [
    { key: 'todas', label: 'Todas', count: tastings.length },
    {
      key: 'este-mes',
      label: 'Este mes',
      count: tastings.filter((t) => {
        const d = new Date(t.tasted_on + 'T00:00:00')
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length,
    },
    { key: 'favoritos', label: 'Favoritos', count: tastings.filter((t) => t.rating >= 5).length },
  ]

  return (
    <>
      <Header title="Wine Tracker" subtitle="Historial" />
      <main className="pt-header pb-[5.5rem] bg-surface min-h-screen">
        <div className="px-margin pt-space-md pb-space-sm flex flex-col gap-space-sm">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Cuaderno de Sommelier
              </span>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Historial de Catas</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
            {chips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => setFilter(chip.key)}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 ${
                  filter === chip.key
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span>{chip.label}</span>
                <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-full">{chip.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-margin flex flex-col gap-space-md mt-2">
          {!loading && filtered.length === 0 && (
            <EmptyState
              icon="wine_bar"
              title="Todavía no hay catas acá"
              subtitle="Tocá el + de abajo para cargar la primera vez que tomaste un vino."
            />
          )}
          {filtered.map((tasting) => (
            <TastingCard key={tasting.id} tasting={tasting} />
          ))}
        </div>
      </main>
    </>
  )
}
