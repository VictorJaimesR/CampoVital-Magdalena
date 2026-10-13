# Despliegue de CampoVital

## Servicios

- Frontend React/Vite en Vercel, con el proyecto configurado para usar la raíz `frontend`.
- API Gateway y microservicios Java 21 en Render.
- PostgreSQL en Supabase. Los servicios usan esquemas separados dentro de la base `postgres`.

## Supabase

1. Crea un proyecto Supabase en una región cercana a Ohio.
2. En SQL Editor, ejecuta el contenido de `database/supabase-schemas.sql`.
3. En Connect, copia la cadena de conexión **Session pooler**. Render usa IPv4; el pooler de sesión acepta conexiones persistentes y admite las funciones de sesión del driver JDBC.
4. En Render, configura para cada servicio con base de datos:
   - `DB_URL`: `jdbc:postgresql://<pooler-host>:5432/postgres?sslmode=require&currentSchema=campovital_auth` para auth, `campovital_agro` para agro y `campovital_recommendations` para recomendaciones.
   - `DB_USERNAME`: el usuario de la cadena del pooler, normalmente `postgres.<project-ref>`.
   - `DB_PASSWORD`: la contraseña de base de datos del proyecto.

No pongas la clave `anon` ni la `service_role` de Supabase en el frontend. El backend se conecta directamente a PostgreSQL.

## Render

1. Desde el dashboard de Render, crea un Blueprint desde este repositorio y usa `render.yaml`.
2. Cuando se soliciten valores secretos, genera un JWT_SECRET largo y aleatorio y pega el mismo valor en los cuatro servicios. Usa las credenciales de Supabase para las variables `DB_*`.
3. Vercel debe desplegarse antes de completar `FRONTEND_ORIGIN`; copia el dominio de producción de Vercel (por ejemplo, `https://campovital-magdalena.vercel.app`) y úsalo en los cuatro servicios.
4. Si Render asigna un subdominio distinto al nombre indicado, actualiza los destinos de los servicios en `render.yaml` y el destino API en `vercel.json`.

## Vercel

1. Importa el repositorio desde Vercel y establece `Root Directory` en `frontend`.
2. Build command: `npm run build`. Output directory: `dist`. Framework: Vite.
3. Despliega el sitio. El archivo `vercel.json` envía `/api/*` al gateway de Render y dirige las rutas de React Router a `index.html`.
4. Si cambiaste el subdominio del gateway, edita el destino en `vercel.json` y vuelve a desplegar.

## Cuenta de prueba

La página de registro es pública. Crea una cuenta de prueba desde `/register` y usa esa cuenta al enseñar el sistema. No compartas una cuenta administradora en el CV.

## Seguridad

La clave JWT y las contraseñas de PostgreSQL que están en el historial original deben considerarse expuestas. Usa una clave JWT nueva en Render y una contraseña nueva en Supabase; no reutilices credenciales reales. Borrar los valores del último commit no los elimina del historial de Git.
