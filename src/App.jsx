import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'
import Fotos from './pages/Fotos'
import Regalos from './pages/Regalos'
import Promociones from './pages/Promociones'
import MiPlan from './pages/MiPlan'
import MejorarPlan from './pages/MejorarPlan'
import Layout from './components/Layout'

function ProtectedRoute({ business, checking, children }) {
  if (checking) return null
  if (!business) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  const [business, setBusiness] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchBusiness(session.user.email)
      else setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchBusiness(session.user.email)
      else { setBusiness(null); setChecking(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchBusiness(email) {
    const { data: bu } = await supabase
      .from('business_users').select('business_id').eq('email', email).maybeSingle()

    if (bu) {
      const { data: biz } = await supabase
        .from('businesses')
        .select('*, categories(name, icon), provinces(name), cities(name)')
        .eq('id', bu.business_id)
        .single()
      setBusiness(biz)
    }
    setChecking(false)
  }

  function refreshBusiness() {
    if (session) fetchBusiness(session.user.email)
  }

  if (checking) return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center">
      <p className="font-body text-white/60 text-sm">Cargando...</p>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={business ? <Navigate to="/panel" replace /> : <Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/panel" replace />} />
        <Route path="/panel" element={
          <ProtectedRoute business={business} checking={checking}>
            <Layout business={business}><Dashboard business={business} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/panel/perfil" element={
          <ProtectedRoute business={business} checking={checking}>
            <Layout business={business}><Perfil business={business} onUpdate={refreshBusiness} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/panel/fotos" element={
          <ProtectedRoute business={business} checking={checking}>
            <Layout business={business}><Fotos business={business} onUpdate={refreshBusiness} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/panel/regalos" element={
          <ProtectedRoute business={business} checking={checking}>
            <Layout business={business}><Regalos business={business} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/panel/promociones" element={
          <ProtectedRoute business={business} checking={checking}>
            <Layout business={business}><Promociones business={business} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/panel/mi-plan" element={
          <ProtectedRoute business={business} checking={checking}>
            <Layout business={business}><MiPlan business={business} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/panel/mejorar-plan" element={
          <ProtectedRoute business={business} checking={checking}>
            <Layout business={business}><MejorarPlan business={business} /></Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/panel" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
