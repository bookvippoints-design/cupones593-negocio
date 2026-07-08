import { createClient } from '@supabase/supabase-js'

// Mismo proyecto Supabase que el panel admin (una sola base de datos
// para todo Cupones593). Reemplaza si alguna vez usas un proyecto distinto.
const SUPABASE_URL = 'https://etbebvqwgyjozpiwdiea.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YmVidnF3Z3lqb3pwaXdkaWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0ODAwNzEsImV4cCI6MjA5OTA1NjA3MX0.rx4BBcJ4RmZidQ_7TZW_QpuuvC4ZMnQD3EQCxnbgqW0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
