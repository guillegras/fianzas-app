# Finanzas App

Aplicación de finanzas personales con backend FastAPI y frontend React/Vite.

## Configuración

Requisitos: Docker con Compose, Python 3.10 o superior, Node.js 20 o superior y npm.

El primer arranque crea automáticamente `.env` desde `.env.example`, el entorno
virtual de Python e instala las dependencias del backend y frontend.

Para personalizar la instalación, copia `.env.example` a `.env` en la raíz y
ajusta sus valores antes de arrancar.

Mantén `VITE_API_URL` vacío en desarrollo local para usar el proxy de Vite.

El `.env` de la raíz está ignorado por Git. Nunca se deben versionar credenciales reales.

## Estructura

- `backend/`: API FastAPI, modelos y acceso a datos.
- `frontend/`: aplicación React/Vite y sus dependencias propias.
- `dev.sh`: arranque local coordinado de base de datos, API y frontend.
- `docker-compose.yml`: servicio de PostgreSQL.

## Desarrollo

```bash
./dev.sh
```

Después abre http://localhost:5173. Para detener backend y frontend usa `Ctrl+C`;
la base de datos permanece en Docker para conservar los datos locales.

Para trabajar solo en el frontend:

```bash
cd frontend
npm install
npm run dev
```
