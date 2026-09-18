import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { DataProvider } from './lib/DataContext'
import { BottomNav } from './components/BottomNav'
import { Splash } from './pages/Splash'
import { Historial } from './pages/Historial'
import { TastingDetail } from './pages/TastingDetail'
import { MisVinos } from './pages/MisVinos'
import { WineProfile } from './pages/WineProfile'
import { AddTasting } from './pages/AddTasting'
import { EditWine } from './pages/EditWine'

const NAV_ROUTES = ['/historial', '/mis-vinos']

function Shell() {
  const location = useLocation()
  const showNav = NAV_ROUTES.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/historial/:id" element={<TastingDetail />} />
        <Route path="/mis-vinos" element={<MisVinos />} />
        <Route path="/mis-vinos/:id" element={<WineProfile />} />
        <Route path="/mis-vinos/:id/editar" element={<EditWine />} />
        <Route path="/agregar" element={<AddTasting />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Shell />
      </DataProvider>
    </BrowserRouter>
  )
}
