export const PLANS = [
  {
    key: 'inicio',
    name: 'Inicio',
    price: '$0 / año',
    benefits: [
      'Perfil del negocio en el directorio de Cupones593',
      'Hasta 6 Regalos activos',
      'Hasta 6 Promociones activas',
      'Logo y galería de fotos del negocio',
      'Panel de administración propio',
      'No vence — se mantiene activo mientras uses la plataforma',
    ],
  },
  {
    key: 'comercial',
    name: 'Comercial',
    price: '$49 / año',
    benefits: [
      'Perfil del negocio en el directorio de Cupones593',
      'Hasta 6 Regalos activos',
      'Hasta 6 Promociones activas',
      'Logo y galería de fotos del negocio',
      'Panel de administración propio',
      '1 certificado de hospedaje para 2 personas, válido en más de 130 destinos en el mundo',
    ],
    hasCertificate: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$79 / año',
    benefits: [
      'Perfil del negocio en el directorio de Cupones593',
      'Hasta 6 Regalos activos',
      'Hasta 6 Promociones activas',
      'Logo y galería de fotos del negocio',
      'Panel de administración propio',
      '1 certificado de hospedaje para 2 personas, válido en más de 130 destinos en el mundo',
      'Acceso a la herramienta BookVipPoints',
      '100 puntos de bienvenida para tus clientes nuevos',
    ],
    hasCertificate: true,
    hasBookVipPoints: true,
    featured: true,
  },
  {
    key: 'elite',
    name: 'Elite',
    price: '$99 / año',
    benefits: [
      'Perfil del negocio en el directorio de Cupones593',
      'Hasta 6 Regalos activos',
      'Hasta 6 Promociones activas',
      'Logo y galería de fotos del negocio',
      'Panel de administración propio',
      '1 certificado de hospedaje para 2 personas, válido en más de 130 destinos en el mundo',
      'Acceso a la herramienta BookVipPoints',
      '100 puntos de bienvenida para tus clientes nuevos',
      'Bolsa anual de 2,000 puntos promocionales para repartir entre tus clientes',
    ],
    hasCertificate: true,
    hasBookVipPoints: true,
  },
]

export const CERTIFICATE_INFO_URL = 'https://escapebvp.netlify.app/'
export const BOOKVIPPOINTS_URL = 'https://panel-bvpoints.netlify.app/dashboard'

export function getPlan(key) {
  return PLANS.find(p => p.key === key) || PLANS[0]
}
