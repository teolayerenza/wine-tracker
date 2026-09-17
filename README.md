# Wine Tracker

Registro personal de vinos tomados: nombre, fecha, estrellas y un comentario
sobre el vino y el momento. Historial navegable, filtrable, con detalle. La
app trackea **ocasiones** (podés tomar el mismo vino varias veces).

Pieza de portfolio con tres frentes sobre un mismo backend Supabase:

- **`web-pwa/`** — PWA (React + Vite + TS + Tailwind). La app real, se usa a
  diario desde iPhone vía Safari → "Agregar a inicio". Deployada en Vercel.
- **`android/`** — Kotlin + Jetpack Compose (pendiente). Se instala como APK
  descargado directo, sin Google Play.
- **`ios/`** — Swift + SwiftUI (pendiente). Demo de portfolio, se compila y
  corre desde Xcode en una Mac.
- **`supabase/schema.sql`** — schema compartido (Postgres + storage bucket
  para fotos).

## Backend (Supabase)

1. Crear un proyecto gratuito en [supabase.com](https://supabase.com).
2. Correr `supabase/schema.sql` en el SQL editor del proyecto.
3. Copiar el Project URL y la clave `anon`/`publishable` (Settings → API Keys).

No hay login por ahora — un solo usuario, RLS abierta a la anon key.

## PWA

```bash
cd web-pwa
cp .env.example .env   # completar con los datos de Supabase
npm install
npm run dev
```

En el iPhone: abrir la URL desplegada en Safari → compartir → "Agregar a
inicio".
