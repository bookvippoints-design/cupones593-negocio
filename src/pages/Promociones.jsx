import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

const EMPTY = { title: '', description: '', type: 'descuento', value: '', valid_until: '' }

export default function Promociones({ business }) {
  const [promos, setPromos] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef()

  useEffect(() => { fetchPromos() }, [business])

  async function fetchPromos() {
    const { data } = await supabase
      .from('promotions').select('*').eq('business_id', business.id).order('created_at', { ascending: false })
    setPromos(data || [])
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError(''); setSuccess('')

    const activeCount = promos.filter(p => p.active && p.id !== editing).length
    if (!editing && activeCount >= 6) {
      setError('Máximo 6 promociones activas. Desactiva una antes de agregar otra.')
      return
    }

    setSaving(true)
    let image_url = existingImageUrl

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${business.id}/promotions/${Date.now()}.${ext}`
      const { error: upError } = await supabase.storage.from('businesses').upload(path, imageFile)
      if (upError) {
        setError('Error subiendo la imagen.')
        setSaving(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from('businesses').getPublicUrl(path)
      image_url = publicUrl
    }

    const payload = { ...form, image_url, valid_until: form.valid_until || null }

    if (editing) {
      await supabase.from('promotions').update(payload).eq('id', editing)
      setSuccess('Promoción actualizada.')
      setEditing(null)
    } else {
      await supabase.from('promotions').insert({ ...payload, business_id: business.id, active: true })
      setSuccess('Promoción creada.')
    }
    setForm(EMPTY)
    setImageFile(null)
    setExistingImageUrl(null)
    fetchPromos()
    setSaving(false)
  }

  async function toggleActive(promo) {
    const activeCount = promos.filter(p => p.active && p.id !== promo.id).length
    if (!promo.active && activeCount >= 6) {
      setError('Máximo 6 promociones activas.')
      return
    }
    await supabase.from('promotions').update({ active: !promo.active }).eq('id', promo.id)
    fetchPromos()
  }

  async function deletePromo(id) {
    if (!confirm('¿Eliminar esta promoción?')) return
    await supabase.from('promotions').delete().eq('id', id)
    fetchPromos()
  }

  function startEdit(promo) {
    setEditing(promo.id)
    setExistingImageUrl(promo.image_url)
    setImageFile(null)
    setForm({
      title: promo.title,
      description: promo.description || '',
      type: promo.type,
      value: promo.value || '',
      valid_until: promo.valid_until || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditing(null)
    setForm(EMPTY)
    setImageFile(null)
    setExistingImageUrl(null)
  }

  const activeCount = promos.filter(p => p.active).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-brand-navy text-2xl mb-1">Promociones</h1>
        <p className="font-body text-gray-500 text-sm">
          Descuentos, 2x1 y combos. Puedes tener hasta 6 activas. Activas: <strong>{activeCount}/6</strong>
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 font-body text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 font-body text-sm px-4 py-3 rounded-xl mb-4">✅ {success}</div>}

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-heading font-bold text-brand-navy text-base mb-5">
          {editing ? 'Editar promoción' : 'Nueva promoción'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Título *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="Ej: 20% de descuento en consumo mínimo de $15"
              className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Tipo</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange">
                <option value="descuento">🏷️ Descuento</option>
                <option value="2x1">2️⃣ 2x1</option>
                <option value="combo">🍽️ Combo</option>
                <option value="otro">✨ Otro</option>
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Valor</label>
              <input name="value" value={form.value} onChange={handleChange} placeholder="Ej: 20% o menú ejecutivo"
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
            </div>
          </div>
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Válido hasta (opcional)</label>
            <input type="date" name="valid_until" value={form.valid_until} onChange={handleChange}
              className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Imagen (opcional)</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
              className="w-full text-sm font-body" />
            {existingImageUrl && !imageFile && (
              <img src={existingImageUrl} alt="" className="w-24 h-24 object-cover rounded-xl mt-2" />
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-brand-orange text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-60">
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear promoción'}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit}
                className="bg-gray-100 text-gray-700 font-heading font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {promos.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <div className="text-4xl mb-2">🏷️</div>
            <p className="font-body text-gray-400 text-sm">Aún no tienes promociones. Crea la primera arriba.</p>
          </div>
        ) : (
          promos.map(promo => (
            <div key={promo.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-start justify-between gap-4 ${promo.active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start gap-3 flex-1">
                {promo.image_url && <img src={promo.image_url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
                <div>
                  <p className="font-heading font-semibold text-brand-navy text-sm">{promo.title}</p>
                  {promo.description && <p className="font-body text-gray-500 text-xs mt-0.5">{promo.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5">
                    {promo.value && <span className="font-body text-xs text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full">{promo.value}</span>}
                    <span className={`font-body text-xs px-2 py-0.5 rounded-full ${promo.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {promo.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(promo)} className="font-body text-xs text-brand-navy hover:underline">Editar</button>
                <button onClick={() => toggleActive(promo)} className={`font-body text-xs ${promo.active ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:underline'}`}>
                  {promo.active ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => deletePromo(promo.id)} className="font-body text-xs text-red-400 hover:underline">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
