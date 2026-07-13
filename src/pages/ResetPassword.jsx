import { useState } from 'react'
import { supabase } from '../supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError('No pudimos actualizar tu contraseña. El enlace pudo haber expirado, solicita uno nuevo desde el login.')
    else setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <h1 className="font-heading font-bold text-brand-navy text-xl mb-3">¡Listo!</h1>
            <p className="font-body text-sm text-gray-600 mb-6">Tu contraseña fue actualizada. Ya puedes iniciar sesión.</p>
            <a href="/login" className="inline-block w-full bg-brand-orange text-white font-heading font-bold text-sm px-4 py-3.5 rounded-xl hover:bg-orange-500 transition-colors">
              Ir al login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-heading font-bold text-white text-2xl">
            Cupones<span className="text-brand-orange">593</span>
          </span>
          <p className="font-body text-white/60 text-sm mt-2">Crea tu nueva contraseña</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="font-heading font-bold text-brand-navy text-xl mb-6 text-center">Nueva contraseña</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Nueva contraseña</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Confirma la contraseña</label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                required className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange"
              />
            </div>
            {error && <div className="bg-red-50 text-red-600 font-body text-sm px-4 py-3 rounded-xl">{error}</div>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-brand-orange text-white font-heading font-bold text-sm px-4 py-3.5 rounded-xl hover:bg-orange-500 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
