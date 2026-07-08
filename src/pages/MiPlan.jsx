import { WA_URL } from '../config'
import { getPlan, CERTIFICATE_INFO_URL, BOOKVIPPOINTS_URL } from '../planData'

export default function MiPlan({ business }) {
  const plan = getPlan(business.plan)
  const isPaid = business.plan !== 'inicio'

  let daysLeft = null
  if (isPaid && business.paid_plan_expires_at) {
    const diff = new Date(business.paid_plan_expires_at) - new Date()
    daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-brand-navy text-2xl mb-1">Mi plan</h1>
        <p className="font-body text-gray-500 text-sm">Estado, vencimiento y beneficios de tu plan actual.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-xl mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-heading font-bold text-brand-navy text-xl">Plan {plan.name}</h2>
          <span className="font-heading font-bold text-brand-navy text-lg">{plan.price}</span>
        </div>

        {!isPaid ? (
          <p className="font-body text-gray-500 text-sm mb-4">Este plan es gratuito y no vence.</p>
        ) : (
          <div className="mb-4">
            {daysLeft !== null && daysLeft > 0 && (
              <p className="font-body text-gray-600 text-sm">
                Tu plan vence en <strong>{daysLeft} día{daysLeft !== 1 ? 's' : ''}</strong>
                {business.paid_plan_expires_at && (
                  <> (el {new Date(business.paid_plan_expires_at).toLocaleDateString('es-EC')})</>
                )}.
              </p>
            )}
            {daysLeft !== null && daysLeft <= 0 && (
              <p className="font-body text-gray-600 text-sm">
                Tu plan pagado <strong>ya venció</strong>. Tu cuenta volvió automáticamente al Plan Inicio
                (conservas tu perfil y contenido, sin las herramientas premium).
              </p>
            )}
            {daysLeft !== null && daysLeft > 0 && daysLeft <= 15 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mt-3">
                <p className="font-body text-amber-800 text-sm">⏳ Está por vencer. Renueva para no perder tus beneficios.</p>
              </div>
            )}
          </div>
        )}

        <hr className="border-gray-100 my-4" />

        <h3 className="font-heading font-semibold text-brand-navy text-sm mb-3">Tu plan incluye:</h3>
        <ul className="space-y-2 mb-4">
          {plan.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 font-body text-gray-600 text-sm">
              <span className="text-brand-emerald flex-shrink-0">✓</span> {b}
            </li>
          ))}
        </ul>

        {plan.hasCertificate && (
          <a
            href={CERTIFICATE_INFO_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block font-body text-xs text-brand-navy border border-gray-200 rounded-xl px-3 py-2 mr-2 mb-4 hover:bg-gray-50 transition-colors"
          >
            Ver cómo funciona el certificado de hospedaje →
          </a>
        )}
        {plan.hasBookVipPoints && (
          <a
            href={BOOKVIPPOINTS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block font-body text-xs text-brand-navy border border-gray-200 rounded-xl px-3 py-2 mb-4 hover:bg-gray-50 transition-colors"
          >
            Ir a BookVipPoints (empresas) →
          </a>
        )}

        <div>
          {isPaid ? (
            <a
              href={WA_URL(`Hola, quiero renovar el plan de mi negocio "${business.name}" en Cupones593.`)}
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-brand-orange text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors"
            >
              Renovar mi plan
            </a>
          ) : (
            <a
              href={WA_URL(`Hola, quiero mejorar el plan de mi negocio "${business.name}" en Cupones593.`)}
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-brand-orange text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors"
            >
              Quiero mejorar mi plan
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
