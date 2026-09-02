# Gestor Financiero

Frontend React + Vite para consultar, registrar y eliminar movimientos financieros.

## Estructura

- `components/`: piezas visuales reutilizables.
- `hooks/`: estado y efectos compartidos de la aplicación.
- `services/`: comunicación con la API.
- `utils/`: constantes y lógica pura testeable.
- `App.jsx`: composición de vistas y estado de navegación.

## Desarrollo

Desde la raíz del repositorio, el arranque recomendado es:

```bash
./dev.sh
```

También puedes ejecutar solo el frontend:

```bash
npm install
npm run dev
```

La configuración de entorno está centralizada en `../.env`. Usa `../.env.example` como plantilla.
En desarrollo, Vite redirige automáticamente las peticiones a la API local en `http://localhost:8000`.
Para un backend remoto, configura `VITE_API_URL` en el `.env` de la raíz.

```bash
VITE_API_URL=http://localhost:8000 npm run dev
```

## Validacion

```bash
npm run lint
npm test
npm run build
```