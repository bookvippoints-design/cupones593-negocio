import { Link } from 'react-router-dom'

export default function Dashboard({ business }) {
  if (!business) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-brand-navy text-2xl mb-1">
          Bienvenido, {business.name} 👋
        </h1>
        <p className="font-body text-gray-500 text-sm">Gestiona tu perfil, regalos y promociones desde aquí.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Plan actual', value: business.plan.charAt(0).toUpperCase() + business.plan.slice(1), color: 'text-brand-navy' },
          { label: 'Categoría', value: business.categories?.name || '—', color: 'text-brand-navy' },
          { label: 'Ubicación', value: business.cities?.name ? `${business.cities.name}, ${business.provinces?.name}` : '—', color: 'text-brand-navy' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="font-body text-gray-400 text-xs mb-1">{s.label}</p>
            <p className={`font-heading font-bold text-lg ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-start gap-4">
          {business.logo_url ? (
            <img src={business.logo_url} alt={business.name} className="w-20 h-20 rounded-xl object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">🏪</div>
          )}
          <div className="flex-1">
            <h2 className="font-heading font-bold text-brand-navy text-lg">{business.name}</h2>
            <p className="font-body text-gray-400 text-sm mb-2">
              {business.address}{business.cities?.name ? ` · ${business.cities.name}` : ''}
            </p>
            <p className="font-body text-gray-600 text-sm leading-relaxed line-clamp-2">
              {business.description || 'Aún no has agregado una descripción. Complétala en Mi perfil.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/panel/regalos" className="bg-brand-navy rounded-2xl p-6 text-white hover:bg-brand-navy/90 transition-colors">
          <div className="text-2xl mb-2">🎁</div>
          <h3 className="font-heading font-bold text-base mb-1">Regalos</h3>
          <p className="font-body text-white/70 text-sm">Administra tus beneficios gratuitos condicionados. Hasta 6 activos.</p>
        </Link>
        <Link to="/panel/promociones" className="bg-brand-orange rounded-2xl p-6 text-white hover:bg-orange-500 transition-colors">
          <div className="text-2xl mb-2">🏷️</div>
          <h3 className="font-heading font-bold text-base mb-1">Promociones</h3>
          <p className="font-body text-white/70 text-sm">Descuentos, 2x1 y combos. Hasta 6 activas.</p>
        </Link>
      </div>
    </div>
  )
}
