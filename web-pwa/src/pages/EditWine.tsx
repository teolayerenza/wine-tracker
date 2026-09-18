import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { WineFields, emptyWineForm, formToWineInput, wineToForm } from '../components/WineFields'
import { useWineData } from '../lib/DataContext'

export function EditWine() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getWine, updateWine } = useWineData()
  const wine = id ? getWine(id) : undefined

  const [form, setForm] = useState(emptyWineForm)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (wine && !loaded) {
      setForm(wineToForm(wine))
      setLoaded(true)
    }
  }, [wine, loaded])

  if (!wine) {
    return (
      <>
        <Header title="Editar vino" showBack />
        <main className="pt-header px-margin text-on-surface-variant">No se encontró este vino.</main>
      </>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (!form.name.trim()) throw new Error('Ponele un nombre al vino')
      await updateWine(wine!.id, formToWineInput(form))
      navigate(`/mis-vinos/${wine!.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header title="Editar vino" showBack />
      <main className="pt-header pb-24 bg-surface min-h-screen">
        <form onSubmit={handleSubmit} className="px-margin pt-space-sm space-y-space-lg">
          <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Datos del vino</h2>
            <WineFields value={form} onChange={setForm} />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              La foto se cambia desde el perfil del vino.
            </p>
          </section>

          {error && <p className="text-error font-body-sm text-body-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>
      </main>
    </>
  )
}
