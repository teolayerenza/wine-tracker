export interface Wine {
  id: string
  name: string
  winery: string | null
  varietal: string | null
  region: string | null
  vintage_year: number | null
  style: string | null
  photo_url: string | null
  created_at: string
}

export interface Tasting {
  id: string
  wine_id: string
  tasted_on: string // ISO date
  rating: number // 1-5
  occasion: string | null
  comment: string | null
  created_at: string
}

export type WineInput = Pick<
  Wine,
  'name' | 'winery' | 'varietal' | 'region' | 'vintage_year' | 'style' | 'photo_url'
>

export type TastingInput = Pick<Tasting, 'wine_id' | 'tasted_on' | 'rating' | 'occasion' | 'comment'>

export interface WineWithStats extends Wine {
  tastingCount: number
  avgRating: number
  lastTastedOn: string | null
  firstTastedOn: string | null
}
