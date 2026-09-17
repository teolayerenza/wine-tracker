interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

export function StarRating({ value, onChange, size = 18 }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((n) => (
        <span
          key={n}
          className={`material-symbols-outlined cursor-${onChange ? 'pointer' : 'default'} ${
            n <= value ? 'text-secondary-container' : 'text-surface-container-highest'
          }`}
          style={{ fontSize: size, fontVariationSettings: `'FILL' 1` }}
          onClick={onChange ? () => onChange(n) : undefined}
        >
          star
        </span>
      ))}
    </div>
  )
}
