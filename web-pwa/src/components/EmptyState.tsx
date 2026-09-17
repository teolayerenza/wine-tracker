interface EmptyStateProps {
  icon: string
  title: string
  subtitle?: string
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="py-space-2xl flex flex-col items-center justify-center text-center px-margin">
      <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container mb-3 shadow-sm">
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
      <p className="font-headline-sm text-headline-sm text-on-surface">{title}</p>
      {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-xs">{subtitle}</p>}
    </div>
  )
}
