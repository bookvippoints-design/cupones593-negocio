import { WA_URL } from '../config'
import { PLANS, CERTIFICATE_INFO_URL, BOOKVIPPOINTS_URL } from '../planData'

export default function MejorarPlan({ business }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-brand-navy text-2xl mb-1">Mejorar mi plan</h1>
        <p className="font-body text-gray-500 text-sm">Accede a más herramientas para hacer crecer tu establecimiento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map(plan => (
          <div
            key={plan.key}
            className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col ${
              plan.featured ? 'border-brand-orange border-2' : 'border-gray-100'
            } ${business.plan === plan.key ? 'ring-2 ring-brand-emerald' : ''}`}
          >
            {plan.featured && (
              <span className="self-start bg-orange-50 text-brand-orange font-body text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Más elegido
              </span>
            )}
            <h2 className="font-heading font-bold text-brand-navy text-lg mb-1">{plan.name}</h2>
            <p className="font-heading font-extrabold text-brand-navy text-2xl mb-4">{plan.price}</p>
            <ul className="space-y-2 mb-4 flex-1">
              {plan.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-gray-600 text-sm">
                  <span className="text-brand-emerald flex-shrink-0">✓</span> {b}
                </li>
              ))}
            </ul>

            {plan.hasCertificate && (
              <a
                href={CERTIFICATE_INFO_URL} target="_blank" rel="noopener noreferrer"
                className="text-center font-body text-xs text-brand-navy border border-gray-200 rounded-xl px-3 py-2 mb-2 hover:bg-gray-50 transition-colors"
              >
                Ver cómo funciona el certificado de hospedaje →
              </a>
            )}
            {plan.hasBookVipPoints && (
              <a
                href={BOOKVIPPOINTS_URL} target="_blank" rel="noopener noreferrer"
                className="text-center font-body text-xs text-brand-navy border border-gray-200 rounded-xl px-3 py-2 mb-4 hover:bg-gray-50 transition-colors"
              >
                Ir a BookVipPoints (empresas) →
              </a>
            )}

            {business.plan === plan.key ? (
              <span className="text-center font-body text-sm text-brand-emerald font-semibold">Tu plan actual</span>
            ) : plan.key === 'inicio' ? (
              <span className="text-center font-body text-xs text-gray-400">Plan gratuito, sin costo</span>
            ) : (
              <a
                href={WA_URL(`Hola, quiero mejorar mi plan a "${plan.name}" para mi negocio "${business.name}" en Cupones593.`)}
                target="_blank" rel="noopener noreferrer"
                className="text-center bg-brand-navy text-white font-heading font-semibold text-sm px-4 py-3 rounded-xl hover:bg-brand-navy/90 transition-colors"
              >
                Quiero este plan
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="font-body text-gray-400 text-xs mt-6">
        Por ahora, los upgrades se procesan a través de nuestro equipo por WhatsApp. Pronto podrás
        pagar directamente desde aquí con PayPhone.
      </p>
    </div>
  )
}
