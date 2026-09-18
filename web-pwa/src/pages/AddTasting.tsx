import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { StarRating } from '../components/StarRating'
import { supabase } from '../lib/supabase'
import { useWineData } from '../lib/DataContext'
import { WineFields, emptyWineForm, formToWineInput } from '../components/WineFields'

export function AddTasting() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { wines, getTasting, createWine, createTasting, updateTasting } = useWineData()

  const editId = params.get('edit')
  const editing = editId ? getTasting(editId) : undefined
  const preselectWineId = params.get('wineId')

  const [mode, setMode] = useState<'existing' | 'new'>(preselectWineId || wines.length === 0 ? (wines.length === 0 ? 'new' : 'existing') : 'existing')
  const [selectedWineId, setSelectedWineId] = useState(editing?.wine_id ?? preselectWineId ?? '')
  const [wineSearch, setWineSearch] = useState('')
  const [newWine, setNewWine] = useState(emptyWineForm)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const [tastedOn, setTastedOn] = useState(editing?.tasted_on ?? new Date().toISOString().slice(0, 10))
  const [rating, setRating] = useState(editing?.rating ?? 4)
  const [occasion, setOccasion] = useState(editing?.occasion ?? '')
  const [comment, setComment] = useState(editing?.comment ?? '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editing) {
      setMode('existing')
      setSelectedWineId(editing.wine_id)
      setTastedOn(editing.tasted_on)
      setRating(editing.rating)
      setOccasion(editing.occasion ?? '')
      setComment(editing.comment ?? '')
    }
  }, [editing])

  const filteredWines = useMemo(
    () => wines.filter((w) => w.name.toLowerCase().includes(wineSearch.toLowerCase())),
    [wines, wineSearch],
  )

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      let wineId = selectedWineId

      if (mode === 'new') {
        if (!newWine.name.trim()) throw new Error('Ponele un nombre al vino')

        let photoUrl: string | null = null
        if (photoFile) {
          const path = `${Date.now()}-${photoFile.name}`
          const { error: uploadError } = await supabase.storage.from('wine-photos').upload(path, photoFile)
          if (uploadError) throw uploadError
          photoUrl = supabase.storage.from('wine-photos').getPublicUrl(path).data.publicUrl
        }

        const wine = await createWine({ ...formToWineInput(newWine), photo_url: photoUrl })
        wineId = wine.id
      }

      if (!wineId) throw new Error('Elegí un vino de la lista')

      const tastingInput = {
        wine_id: wineId,
        tasted_on: tastedOn,
        rating,
        occasion: occasion || null,
        comment: comment || null,
      }

      if (editing) {
        await updateTasting(editing.id, tastingInput)
        navigate(`/historial/${editing.id}`)
      } else {
        await createTasting(tastingInput)
        navigate('/historial')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header title={editing ? 'Editar cata' : 'Nueva cata'} showBack />
      <main className="pt-header pb-24 bg-surface min-h-screen">
        <form onSubmit={handleSubmit} className="px-margin pt-space-sm space-y-space-lg">
          {/* Selección de vino */}
          <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">¿Qué vino tomaste?</h2>

            {!editing && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('existing')}
                  className={`flex-1 h-10 rounded-full font-label-md text-label-md ${
                    mode === 'existing' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Ya lo conozco
                </button>
                <button
                  type="button"
                  onClick={() => setMode('new')}
                  className={`flex-1 h-10 rounded-full font-label-md text-label-md ${
                    mode === 'new' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Es nuevo
                </button>
              </div>
            )}

            {editing && (
              <p className="font-body-md text-body-md text-on-surface-variant">{editing.wine.name}</p>
            )}

            {!editing && mode === 'existing' && (
              <div className="space-y-2">
                <input
                  placeholder="Buscar en Mis Vinos…"
                  value={wineSearch}
                  onChange={(e) => setWineSearch(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md focus:outline-none focus:border-[1.5px] focus:border-primary-container"
                />
                <div className="max-h-56 overflow-y-auto flex flex-col gap-1.5">
                  {filteredWines.map((w) => (
                    <button
                      type="button"
                      key={w.id}
                      onClick={() => setSelectedWineId(w.id)}
                      className={`text-left px-3 py-2 rounded-xl font-body-md text-body-md ${
                        selectedWineId === w.id
                          ? 'bg-primary-container text-on-primary'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {w.name}
                      {w.winery && <span className="opacity-70"> · {w.winery}</span>}
                    </button>
                  ))}
                  {filteredWines.length === 0 && (
                    <p className="text-on-surface-variant font-body-sm text-body-sm px-1">Nada coincide.</p>
                  )}
                </div>
              </div>
            )}

            {!editing && mode === 'new' && (
              <div className="space-y-2">
                <WineFields value={newWine} onChange={setNewWine} />
                <label className="font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-1">
                  Foto (opcional)
                  <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            )}
          </section>

          {/* Datos de la ocasión */}
          <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Esta vez</h2>

            <label className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Fecha</span>
              <input
                type="date"
                value={tastedOn}
                onChange={(e) => setTastedOn(e.target.value)}
                required
                className="h-11 px-4 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md focus:outline-none focus:border-[1.5px] focus:border-primary-container"
              />
            </label>

            <div className="flex flex-col gap-1 items-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant self-start">Calificación</span>
              <StarRating value={rating} onChange={setRating} size={32} />
            </div>

            <label className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Ocasión (opcional)</span>
              <input
                placeholder="Ej. Cena familiar, Celebración, Con amigos…"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="h-11 px-4 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md focus:outline-none focus:border-[1.5px] focus:border-primary-container"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Reseña / comentario</span>
              <textarea
                placeholder="El vino, el momento, con quién estabas…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="px-4 py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md focus:outline-none focus:border-[1.5px] focus:border-primary-container"
              />
            </label>
          </section>

          {error && <p className="text-error font-body-sm text-body-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </form>
      </main>
    </>
  )
}
