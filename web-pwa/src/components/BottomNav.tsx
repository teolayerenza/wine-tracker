import { Link, useLocation, useNavigate } from 'react-router-dom'

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHistorial = location.pathname.startsWith('/historial')
  const isMisVinos = location.pathname.startsWith('/mis-vinos')

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      <div className="relative flex items-center justify-around h-16 px-gutter">
        <Link
          to="/historial"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 active:scale-95 transition-transform duration-150 ${
            isHistorial ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">history_edu</span>
          <span className="font-label-sm text-label-sm tracking-wide">Historial</span>
        </Link>

        <div className="relative -top-5 flex items-center justify-center">
          <button
            onClick={() => navigate('/agregar')}
            aria-label="Registrar una cata"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-container text-on-primary shadow-[0_8px_24px_-4px_rgba(92,5,52,0.32)] active:scale-90 transition-transform duration-150"
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
          </button>
        </div>

        <Link
          to="/mis-vinos"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 active:scale-95 transition-transform duration-150 ${
            isMisVinos ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">wine_bar</span>
          <span className="font-label-sm text-label-sm tracking-wide">Mis Vinos</span>
        </Link>
      </div>
    </nav>
  )
}
