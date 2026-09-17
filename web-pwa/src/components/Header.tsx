import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
}

export function Header({ title, subtitle, showBack }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-xs min-w-0">
          {showBack && (
            <button
              aria-label="Volver"
              onClick={() => navigate(-1)}
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface active:bg-surface-container-high transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight truncate">
              {title}
            </span>
            {subtitle && (
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
