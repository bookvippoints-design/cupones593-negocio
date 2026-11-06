import { createClient } from '@supabase/supabase-js'

// Mismo proyecto Supabase que el panel admin (una sola base de datos
// para todo Cupones593). Reemplaza si alguna vez usas un proyecto distinto.
const SUPABASE_URL = 'https://etbebvqwgyjozpiwdiea.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YmVidnF3Z3lqb3pwaXdkaWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0ODAwNzEsImV4cCI6MjA5OTA1NjA3MX0.rx4BBcJ4RmZidQ_7TZW_QpuuvC4ZMnQD3EQCxnbgqW0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Login único de Cupones593 ──────────────────────────────────────────
// El inicio de sesión se hace siempre en el sitio principal.
export const WEB_LOGIN_URL = 'https://cupones593.pages.dev/login'

// El login único nos envía la sesión en la URL (#c593_at=...&c593_rt=...).
// La guardamos y limpiamos la URL de inmediato.
export async function consumeLoginHandoff() {
  const hash = window.location.hash
  if (!hash.includes('c593_rt=')) return
  const params = new URLSearchParams(hash.slice(1))
  const access_token = params.get('c593_at')
  const refresh_token = params.get('c593_rt')
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
  if (access_token && refresh_token) {
    await supabase.auth.setSession({ access_token, refresh_token })
  }
}

export function goToWebLogin() {
  window.location.replace(WEB_LOGIN_URL)
  return null
}
