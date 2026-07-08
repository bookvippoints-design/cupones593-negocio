import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const NAV = [
  { to: '/panel', label: 'Inicio', icon: '🏠', end: true },
  { to: '/panel/perfil', label: 'Mi perfil', icon: '📋' },
  { to: '/panel/fotos', label: 'Logo y fotos', icon: '📸' },
  { to: '/panel/regalos', label: 'Regalos', icon: '🎁' },
  { to: '/panel/promociones', label: 'Promociones', icon: '🏷️' },
  { to: '/panel/mi-plan', label: 'Mi plan', icon: '👑' },
  { to: '/panel/mejorar-plan', label: 'Mejorar mi plan', icon: '⬆️' },
]

export default function Layout({ children, business }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Barra superior — solo móvil */}
      <div className="md:hidden flex items-center justify-between bg-brand-navy px-4 py-3 sticky top-0 z-30">
        <span className="font-heading font-bold text-white text-base">
          Cupones<span className="text-brand-orange">593</span>
        </span>
        <button onClick={() => setOpen(true)} className="text-white p-1" aria-label="Abrir menú">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Fondo oscuro al abrir el menú en móvil */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex">
        <aside className={`
          fixed md:sticky top-0 left-0 z-40 md:z-auto w-64 h-full md:h-screen bg-brand-navy flex flex-col overflow-y-auto
          transform transition-transform duration-200 md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="min-w-0">
              <span className="font-heading font-bold text-white text-base">
                Cupones<span className="text-brand-orange">593</span>
              </span>
              {business && (
                <div className="bg-white/10 rounded-xl px-3 py-2 mt-3">
                  <p className="font-heading font-semibold text-white text-sm truncate">{business.name}</p>
                  <p className="font-body text-white/50 text-xs truncate">Plan {business.plan}</p>
                </div>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="md:hidden text-white/70 p-1 flex-shrink-0" aria-label="Cerrar menú">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-orange text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span>🚪</span> Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 w-full p-4 md:p-8 min-w-0">{children}</main>
      </div>
    </div>
  )
}
