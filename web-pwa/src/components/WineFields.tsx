import type { Wine, WineInput } from '../types'

export interface WineFormValues {
  name: string
  winery: string
  varietal: string
  region: string
  vintage_year: string
  style: string
}

export const emptyWineForm: WineFormValues = {
  name: '',
  winery: '',
  varietal: '',
  region: '',
  vintage_year: '',
  style: '',
}

export function wineToForm(wine: Wine): WineFormValues {
  return {
    name: wine.name,
    winery: wine.winery ?? '',
    varietal: wine.varietal ?? '',
    region: wine.region ?? '',
    vintage_year: wine.vintage_year?.toString() ?? '',
    style: wine.style ?? '',
  }
}

export function formToWineInput(values: WineFormValues): Omit<WineInput, 'photo_url'> {
  return {
    name: values.name.trim(),
    winery: values.winery.trim() || null,
    varietal: values.varietal.trim() || null,
    region: values.region.trim() || null,
    vintage_year: values.vintage_year ? Number(values.vintage_year) : null,
    style: values.style.trim() || null,
  }
}

const inputClass =
  'h-11 px-4 rounded-xl border border-outline-variant bg-surface font-body-md text-body-md focus:outline-none focus:border-[1.5px] focus:border-primary-container'

interface WineFieldsProps {
  value: WineFormValues
  onChange: (value: WineFormValues) => void
}

export function WineFields({ value, onChange }: WineFieldsProps) {
  const set = (key: keyof WineFormValues) => (e: { target: { value: string } }) =>
    onChange({ ...value, [key]: e.target.value })

  return (
    <div className="space-y-2">
      <input
        placeholder="Nombre del vino *"
        value={value.name}
        onChange={set('name')}
        required
        className={`w-full ${inputClass}`}
      />
      <input placeholder="Bodega" value={value.winery} onChange={set('winery')} className={`w-full ${inputClass}`} />
      <input
        placeholder="Varietal (ej. Malbec)"
        value={value.varietal}
        onChange={set('varietal')}
        className={`w-full ${inputClass}`}
      />
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Región" value={value.region} onChange={set('region')} className={inputClass} />
        <input
          placeholder="Añada (año)"
          type="number"
          value={value.vintage_year}
          onChange={set('vintage_year')}
          className={inputClass}
        />
      </div>
      <input
        placeholder="Tipo (ej. Gran Reserva)"
        value={value.style}
        onChange={set('style')}
        className={`w-full ${inputClass}`}
      />
    </div>
  )
}
