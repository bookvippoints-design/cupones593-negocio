# Cupones593 — Panel del negocio (Etapa 2)

Este es el panel donde cada establecimiento entra con el correo y contraseña
que le llegaron por correo (generados desde el panel admin) para gestionar
su perfil, logo, fotos, Regalos y Promociones.

## 1. Antes de correrlo — configurar el bucket de Storage

Si aún no lo hiciste, ejecuta `cupones593-storage-setup.sql` en el SQL Editor
de tu proyecto Supabase (crea el bucket "businesses" y sus permisos, necesario
para poder subir logo, fotos, e imágenes de regalos/promociones).

## 2. Instalar y correr

```
npm install
npm run dev
```

Te va a dar una URL tipo `http://localhost:5174` (nota: puede ser un puerto
distinto al del panel admin si los corres al mismo tiempo — Vite elige el
siguiente puerto libre automáticamente).

## 3. Iniciar sesión

Usa el correo y contraseña de un negocio ya creado desde el panel admin
(el que le llegó por el correo de bienvenida).

## 4. Qué incluye esta etapa

- Dashboard con resumen del negocio.
- Mi perfil: descripción, categoría, provincia/ciudad, dirección, contacto, redes, coordenadas de mapa.
- Logo y fotos: logo del negocio + galería de hasta 8 fotos.
- Regalos: CRUD completo, hasta 6 activos, con imagen opcional.
- Promociones: CRUD completo, hasta 6 activas, con imagen opcional.
- Mi plan: estado del plan actual, vencimiento (si aplica), aviso si está por vencer.
- Mejorar mi plan: vitrina de planes superiores con sus beneficios.

## 5. Pendiente conocido

- Los upgrades y renovaciones de plan por ahora se piden por WhatsApp
  (botón "Quiero este plan" / "Renovar mi plan"), ya que la integración
  de pago con PayPhone es la Fase 5 del proyecto — todavía no está construida.
  Mientras tanto, el equipo actualiza el plan y la fecha de vencimiento
  manualmente desde el panel admin o directo en Supabase.
- Cuando publiques este panel (ej. en Netlify), actualiza el secreto
  `PANEL_URL` de la Edge Function `create-business` (en el panel admin)
  con la URL real, para que el botón del correo de bienvenida funcione.

## Siguientes etapas

- Etapa 3: sitio público del consumidor (directorio, ficha de negocio, registro, flujo de "Quiero este regalo").
- Etapa 4: cuponeras corporativas + estadísticas.
- Etapa 5: integración PayPhone (consumidor y negocio).
