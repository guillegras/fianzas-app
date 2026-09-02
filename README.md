# Finanzas App

Aplicación de finanzas personales con backend FastAPI y frontend React/Vite.

## Configuración

1. Copia `.env.example` a `.env` en la raíz.
2. Ajusta las credenciales de PostgreSQL si es necesario.
3. Mantén `VITE_API_URL` vacío en desarrollo local para usar el proxy de Vite.

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

Para trabajar solo en el frontend:

```bash
cd frontend
npm install
npm run dev
```
