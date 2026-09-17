import { useNavigate } from 'react-router-dom'

export function Splash() {
  const navigate = useNavigate()

  function handleEnter() {
    navigate('/historial')
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between px-6 py-8 relative overflow-hidden select-none">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="flex flex-col items-center pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm tracking-wider uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
          <span>Cava Personal &amp; Bitácora</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center my-auto py-6">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full bg-primary-container/10 scale-125 blur-xl" />
          <div className="relative w-28 h-28 p-3.5 bg-surface-container-lowest rounded-full shadow-md flex items-center justify-center">
            <img alt="Wine Tracker" className="w-full h-full object-contain rounded-md" src="/logo.svg" />
          </div>
        </div>

        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight mb-3">
          Wine Tracker
        </h1>

        <div className="flex items-center justify-center gap-2 mb-4 text-on-surface-variant/40">
          <span className="w-8 h-px bg-surface-container-highest" />
          <span className="material-symbols-outlined text-body-sm text-secondary">wine_bar</span>
          <span className="w-8 h-px bg-surface-container-highest" />
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant max-w-xs leading-relaxed">
          Tu diario personal de vinos. Registrá cada cata, reviví el momento y armá tu propia colección.
        </p>
      </div>

      <div className="flex flex-col items-center w-full gap-3 pt-4">
        <button
          onClick={handleEnter}
          className="group relative w-full h-14 bg-primary-container text-on-primary font-label-lg text-label-lg rounded-full shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 px-6"
        >
          <span className="tracking-wide">Ingresar a mi cava</span>
          <span className="material-symbols-outlined text-body-lg group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  )
}
