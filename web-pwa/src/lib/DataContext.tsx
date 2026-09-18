import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import type { Tasting, TastingInput, Wine, WineInput, WineWithStats } from '../types'

export interface TastingWithWine extends Tasting {
  wine: Wine
}

interface DataContextValue {
  wines: WineWithStats[]
  tastings: TastingWithWine[]
  loading: boolean
  refresh: () => Promise<void>
  createWine: (input: WineInput) => Promise<Wine>
  createTasting: (input: TastingInput) => Promise<void>
  updateTasting: (id: string, input: TastingInput) => Promise<void>
  deleteTasting: (id: string) => Promise<void>
  deleteWine: (id: string) => Promise<void>
  updateWine: (id: string, input: Partial<WineInput>) => Promise<void>
  getWine: (id: string) => WineWithStats | undefined
  getTasting: (id: string) => TastingWithWine | undefined
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [wines, setWines] = useState<Wine[]>([])
  const [tastings, setTastings] = useState<Tasting[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [winesRes, tastingsRes] = await Promise.all([
        supabase.from('wines').select('*').order('created_at', { ascending: false }),
        supabase.from('tastings').select('*').order('tasted_on', { ascending: false }),
      ])
      if (winesRes.data) setWines(winesRes.data)
      if (tastingsRes.data) setTastings(tastingsRes.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refresh])

  const winesWithStats = useMemo<WineWithStats[]>(() => {
    return wines.map((wine) => {
      const own = tastings.filter((t) => t.wine_id === wine.id)
      const sorted = [...own].sort((a, b) => a.tasted_on.localeCompare(b.tasted_on))
      return {
        ...wine,
        tastingCount: own.length,
        avgRating: own.length ? own.reduce((sum, t) => sum + t.rating, 0) / own.length : 0,
        firstTastedOn: sorted[0]?.tasted_on ?? null,
        lastTastedOn: sorted[sorted.length - 1]?.tasted_on ?? null,
      }
    })
  }, [wines, tastings])

  const tastingsWithWine = useMemo<TastingWithWine[]>(() => {
    const byId = new Map(wines.map((w) => [w.id, w]))
    return tastings
      .map((t) => {
        const wine = byId.get(t.wine_id)
        return wine ? { ...t, wine } : null
      })
      .filter((t): t is TastingWithWine => t !== null)
  }, [wines, tastings])

  async function createWine(input: WineInput): Promise<Wine> {
    const { data, error } = await supabase.from('wines').insert(input).select().single()
    if (error) throw error
    await refresh()
    return data
  }

  async function createTasting(input: TastingInput) {
    const { error } = await supabase.from('tastings').insert(input)
    if (error) throw error
    await refresh()
  }

  async function updateTasting(id: string, input: TastingInput) {
    const { error } = await supabase.from('tastings').update(input).eq('id', id)
    if (error) throw error
    await refresh()
  }

  async function deleteTasting(id: string) {
    const { error } = await supabase.from('tastings').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }

  async function deleteWine(id: string) {
    const { error } = await supabase.from('wines').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }

  async function updateWine(id: string, input: Partial<WineInput>) {
    const { error } = await supabase.from('wines').update(input).eq('id', id)
    if (error) throw error
    await refresh()
  }

  const value: DataContextValue = {
    wines: winesWithStats,
    tastings: tastingsWithWine,
    loading,
    refresh,
    createWine,
    createTasting,
    updateTasting,
    deleteTasting,
    deleteWine,
    updateWine,
    getWine: (id) => winesWithStats.find((w) => w.id === id),
    getTasting: (id) => tastingsWithWine.find((t) => t.id === id),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useWineData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useWineData debe usarse dentro de DataProvider')
  return ctx
}
