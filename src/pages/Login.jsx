import { useState } from 'react'
import { supabase } from '../supabase'
import { WA_URL } from '../config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    setLoading(false)
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Escribe tu correo arriba primero, y luego dale click a "¿Olvidaste tu contraseña?".')
      return
    }
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://cupones593-negocio.netlify.app/reset-password',
    })
    if (error) setError('No pudimos enviar el correo. Verifica que el correo esté bien escrito.')
    else setResetSent(true)
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-heading font-bold text-white text-2xl">
            Cupones<span className="text-brand-orange">593</span>
          </span>
          <p className="font-body text-white/60 text-sm mt-2">Panel de tu establecimiento</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="font-heading font-bold text-brand-navy text-xl mb-6 text-center">Inicia sesión</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Correo</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Contraseña</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange"
              />
            </div>
            {error && <div className="bg-red-50 text-red-600 font-body text-sm px-4 py-3 rounded-xl">{error}</div>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-brand-orange text-white font-heading font-bold text-sm px-4 py-3.5 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-60"
            >
              {loading ? 'Iniciando sesión...' : 'Entrar al panel'}
            </button>
          </form>
          <p className="font-body text-gray-400 text-xs text-center mt-4">
          <button type="button" onClick={handleForgotPassword} className="text-brand-emerald hover:underline font-medium">
            ¿Olvidaste tu contraseña?
          </button>
        </p>
        {resetSent && (
          <p className="font-body text-emerald-600 text-xs text-center mt-3 bg-emerald-50 rounded-xl px-4 py-3">
            Te enviamos un correo con el enlace para crear una nueva contraseña.
          </p>
        )}
        <p className="font-body text-gray-400 text-xs text-center mt-4 leading-relaxed">
          ¿No tienes acceso todavía?{' '}
          <a href={WA_URL('Hola, necesito ayuda con el acceso a mi panel de Cupones593.')} className="text-brand-emerald hover:underline">
            Escríbenos por WhatsApp
          </a>
        </p>
        </div>
      </div>
    </div>
  )
}
