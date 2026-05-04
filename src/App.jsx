import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Tarot from './pages/Tarot'
import Horoscopo from './pages/Horoscopo'
import Numerologia from './pages/Numerologia'
import Login from './pages/Login'
import Register from './pages/Register'
import Perfil from './pages/Perfil'
import Historial from './pages/Historial'
import CartaAstral from './pages/CartaAstral'
import RegistrosAkashicos from './pages/RegistrosAkashicos'
import PrivacyPolicy from './pages/PrivacyPolicy'
import DeleteAccount from './pages/DeleteAccount'
import { PremiumProvider } from './contexts/PremiumContext'
import Planes from './pages/planes'

export default function App() {
  return (
    <PremiumProvider>
      <BrowserRouter>
        <Routes>
        
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/delete-account" element={<DeleteAccount />} />

          {/* Rutas protegidas con layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/tarot" element={<Tarot />} />
            <Route path="/horoscopo" element={<Horoscopo />} />
            <Route path="/numerologia" element={<Numerologia />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/carta-astral" element={<CartaAstral />} />
            <Route path="/registros-akashicos" element={<RegistrosAkashicos />} />
            <Route path="/planes" element={<Planes />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </PremiumProvider>
  )
}
