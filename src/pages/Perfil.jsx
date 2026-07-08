import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Perfil({ business, onUpdate }) {
  const [categories, setCategories] = useState([])
  const [provinces, setProvinces] = useState([])
  const [cities, setCities] = useState([])
  const [form, setForm] = useState({
    description: business?.description || '',
    category_id: business?.category_id || '',
    province_id: business?.province_id || '',
    city_id: business?.city_id || '',
    address: business?.address || '',
    phone: business?.phone || '',
    whatsapp: business?.whatsapp || '',
    instagram: business?.instagram || '',
    facebook: business?.facebook || '',
    tiktok: business?.tiktok || '',
    website: business?.website || '',
    lat: business?.lat || '',
    lng: business?.lng || '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data || []))
    supabase.from('provinces').select('*').order('name').then(({ data }) => setProvinces(data || []))
  }, [])

  useEffect(() => {
    if (!form.province_id) { setCities([]); return }
    supabase.from('cities').select('*').eq('province_id', form.province_id).order('name')
      .then(({ data }) => setCities(data || []))
  }, [form.province_id])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase
      .from('businesses')
      .update({
        description: form.description,
        category_id: form.category_id || null,
        province_id: form.province_id || null,
        city_id: form.city_id || null,
        address: form.address,
        phone: form.phone,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        facebook: form.facebook,
        tiktok: form.tiktok,
        website: form.website,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
      })
      .eq('id', business.id)

    if (error) {
      setError('Error al guardar. Intenta de nuevo.')
    } else {
      setSuccess(true)
      onUpdate()
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-brand-navy text-2xl mb-1">Mi perfil</h1>
        <p className="font-body text-gray-500 text-sm">Esta información aparece en tu página dentro de Cupones593.</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-heading font-bold text-brand-navy text-base mb-5">Información general</h2>
          <div className="space-y-4">
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Descripción</label>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="Describe tu establecimiento..."
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange resize-none"
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Categoría</label>
              <select name="category_id" value={form.category_id} onChange={handleChange}
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange">
                <option value="">Selecciona...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Provincia</label>
                <select name="province_id" value={form.province_id} onChange={handleChange}
                  className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange">
                  <option value="">Selecciona...</option>
                  {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Ciudad</label>
                <select name="city_id" value={form.city_id} onChange={handleChange} disabled={!cities.length}
                  className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange disabled:bg-gray-50">
                  <option value="">Selecciona...</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Dirección</label>
              <input name="address" value={form.address} onChange={handleChange}
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-heading font-bold text-brand-navy text-base mb-5">Contacto y redes</h2>
          <div className="space-y-4">
            {[
              { name: 'phone', label: 'Teléfono' },
              { name: 'whatsapp', label: 'WhatsApp (con código de país)', placeholder: '593999999999' },
              { name: 'instagram', label: 'Instagram (usuario sin @)' },
              { name: 'facebook', label: 'Facebook (URL o usuario)' },
              { name: 'tiktok', label: 'TikTok (usuario sin @)' },
              { name: 'website', label: 'Sitio web', type: 'url' },
            ].map(f => (
              <div key={f.name}>
                <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">{f.label}</label>
                <input
                  type={f.type || 'text'} name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-heading font-bold text-brand-navy text-base mb-2">Ubicación en mapa</h2>
          <p className="font-body text-gray-400 text-xs mb-4">
            Abre Google Maps, busca tu establecimiento, clic derecho → "¿Qué hay aquí?" y copia las coordenadas.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Latitud</label>
              <input name="lat" value={form.lat} onChange={handleChange} placeholder="-0.2295"
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Longitud</label>
              <input name="lng" value={form.lng} onChange={handleChange} placeholder="-78.5243"
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 font-body text-sm px-4 py-3 rounded-xl">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 font-body text-sm px-4 py-3 rounded-xl">✅ Perfil actualizado correctamente.</div>}

        <button type="submit" disabled={saving}
          className="bg-brand-orange text-white font-heading font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-60">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
