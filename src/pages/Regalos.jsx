import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

const EMPTY = { title: '', description: '', terms: '', value_reference: '', valid_until: '', restrictions: '' }

export default function Regalos({ business }) {
  const [gifts, setGifts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef()

  useEffect(() => { fetchGifts() }, [business])

  async function fetchGifts() {
    const { data } = await supabase
      .from('gifts').select('*').eq('business_id', business.id).order('created_at', { ascending: false })
    setGifts(data || [])
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError(''); setSuccess('')

    const activeCount = gifts.filter(g => g.active && g.id !== editing).length
    if (!editing && activeCount >= 6) {
      setError('Máximo 6 regalos activos. Desactiva uno antes de agregar otro.')
      return
    }

    setSaving(true)
    let image_url = existingImageUrl

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${business.id}/gifts/${Date.now()}.${ext}`
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
      await supabase.from('gifts').update(payload).eq('id', editing)
      setSuccess('Regalo actualizado.')
      setEditing(null)
    } else {
      await supabase.from('gifts').insert({ ...payload, business_id: business.id, active: true })
      setSuccess('Regalo creado.')
    }
    setForm(EMPTY)
    setImageFile(null)
    setExistingImageUrl(null)
    fetchGifts()
    setSaving(false)
  }

  async function toggleActive(gift) {
    const activeCount = gifts.filter(g => g.active && g.id !== gift.id).length
    if (!gift.active && activeCount >= 6) {
      setError('Máximo 6 regalos activos.')
      return
    }
    await supabase.from('gifts').update({ active: !gift.active }).eq('id', gift.id)
    fetchGifts()
  }

  async function deleteGift(id) {
    if (!confirm('¿Eliminar este regalo?')) return
    await supabase.from('gifts').delete().eq('id', id)
    fetchGifts()
  }

  function startEdit(gift) {
    setEditing(gift.id)
    setExistingImageUrl(gift.image_url)
    setImageFile(null)
    setForm({
      title: gift.title,
      description: gift.description || '',
      terms: gift.terms || '',
      value_reference: gift.value_reference || '',
      valid_until: gift.valid_until || '',
      restrictions: gift.restrictions || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditing(null)
    setForm(EMPTY)
    setImageFile(null)
    setExistingImageUrl(null)
  }

  const activeCount = gifts.filter(g => g.active).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-brand-navy text-2xl mb-1">Regalos</h1>
        <p className="font-body text-gray-500 text-sm">
          Beneficios gratuitos condicionados. Puedes tener hasta 6 activos. Activos: <strong>{activeCount}/6</strong>
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 font-body text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 font-body text-sm px-4 py-3 rounded-xl mb-4">✅ {success}</div>}

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-heading font-bold text-brand-navy text-base mb-5">
          {editing ? 'Editar regalo' : 'Nuevo regalo'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Título *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="Ej: Papas fritas gratis con la compra de 2 hamburguesas"
              className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange resize-none" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Condiciones</label>
            <textarea name="terms" value={form.terms} onChange={handleChange} rows={2}
              placeholder="Ej: No acumulable con otras promociones. Válido de lunes a jueves."
              className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Valor referencial</label>
              <input name="value_reference" value={form.value_reference} onChange={handleChange} placeholder="$3.50"
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Válido hasta</label>
              <input type="date" name="valid_until" value={form.valid_until} onChange={handleChange}
                className="w-full px-4 py-3 font-body text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange" />
            </div>
          </div>
          <div>
            <label className="font-body text-sm font-medium text-gray-700 block mb-1.5">Restricciones</label>
            <input name="restrictions" value={form.restrictions} onChange={handleChange}
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
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear regalo'}
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
        {gifts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <div className="text-4xl mb-2">🎁</div>
            <p className="font-body text-gray-400 text-sm">Aún no tienes regalos. Crea el primero arriba.</p>
          </div>
        ) : (
          gifts.map(gift => (
            <div key={gift.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-start justify-between gap-4 ${gift.active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start gap-3 flex-1">
                {gift.image_url && <img src={gift.image_url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
                <div>
                  <p className="font-heading font-semibold text-brand-navy text-sm">{gift.title}</p>
                  {gift.description && <p className="font-body text-gray-500 text-xs mt-0.5">{gift.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5">
                    {gift.value_reference && <span className="font-body text-xs text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full">{gift.value_reference}</span>}
                    <span className={`font-body text-xs px-2 py-0.5 rounded-full ${gift.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {gift.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(gift)} className="font-body text-xs text-brand-navy hover:underline">Editar</button>
                <button onClick={() => toggleActive(gift)} className={`font-body text-xs ${gift.active ? 'text-gray-400 hover:text-red-500' : 'text-green-600 hover:underline'}`}>
                  {gift.active ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => deleteGift(gift.id)} className="font-body text-xs text-red-400 hover:underline">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
