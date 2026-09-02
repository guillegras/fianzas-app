# Gestor Financiero

Frontend React + Vite para consultar, registrar y eliminar movimientos financieros.

## Estructura

- `components/`: piezas visuales reutilizables.
- `hooks/`: estado y efectos compartidos de la aplicación.
- `services/`: comunicación con la API.
- `utils/`: constantes y lógica pura testeable.
- `App.jsx`: composición de vistas y estado de navegación.

## Desarrollo

```bash
npm install
npm run dev
```

En desarrollo, Vite redirige automáticamente las peticiones a la API local en `http://localhost:8000`.
Para un backend remoto, configura `VITE_API_URL`.

```bash
VITE_API_URL=http://localhost:8000 npm run dev
```

## Validacion

```bash
npm run lint
npm test
npm run build
```