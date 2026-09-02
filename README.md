# Finanzas App

Aplicación de finanzas personales con backend FastAPI y frontend React/Vite.

## Configuración inicial

Para ejecutar la aplicación desde un clon limpio solo necesitas Docker con
Compose. Python, Node.js y npm solo son necesarios para el modo de desarrollo
local.

1. Clona el repositorio y entra en la carpeta:

	```bash
	git clone <URL_DEL_REPOSITORIO>
	cd finanzas-app
	```

2. Crea `.env` y define una contraseña propia para PostgreSQL:

	```bash
	cp .env.example .env
	```

	Cambia al menos `DB_PASSWORD` por una contraseña segura. El archivo `.env`
	está ignorado por Git. Nunca guardes credenciales reales en el repositorio.

3. Levanta el stack de producción local:

	```bash
	docker compose -f docker-compose.prod.yml up -d --build
	```

	El primer arranque descarga las imágenes, compila el frontend, crea la base
	de datos y ejecuta backend y frontend dentro de contenedores.

4. Comprueba el estado:

	```bash
	docker compose -f docker-compose.prod.yml ps
	curl http://localhost:8080/health
	curl http://localhost:8080/ready
	```

	Los servicios deben aparecer como activos/healthy y los endpoints deben
	devolver `{"status":"ok"}` y `{"status":"ready"}`.

5. Accede desde otro dispositivo de la misma red. Obtén la IP del PC:

	```bash
	hostname -I
	```

	Desde el móvil u otro equipo abre `http://IP_DEL_PC:8080`, por ejemplo
	`http://192.168.1.45:8080`. Ambos dispositivos deben estar en la misma red
	y el firewall del PC debe permitir el puerto `8080`.

Si el puerto `8080` está ocupado, define otro valor en `.env`:

```env
APP_PORT=8081
```

Después vuelve a levantar el stack y usa ese puerto en la dirección.

Para detener la aplicación conservando los datos:

```bash
docker compose -f docker-compose.prod.yml down
```

No uses `down -v` salvo que quieras borrar también el volumen de PostgreSQL.

Mantén `VITE_API_URL` vacío en desarrollo local para usar el proxy de Vite.

En Docker, el backend usa internamente `DB_HOST=db`. `CORS_ORIGINS` solo es
necesario si el frontend se sirve desde un origen distinto al backend.

## Estructura

- `backend/src/finanzas_api/`: API FastAPI, modelos y acceso a datos.
- `backend/tests/`: tests de integración aislados con SQLite en memoria.
- `backend/requirements*.txt`: dependencias de runtime y desarrollo.
- `frontend/`: aplicación React/Vite y sus dependencias propias.
- `dev.sh`: arranque local coordinado de base de datos, API y frontend.
- `docker-compose.yml`: servicio de PostgreSQL.

La API expone `/health` para comprobar que el proceso está vivo y `/ready` para
comprobar que también puede acceder a PostgreSQL. El listado acepta paginación
opcional con `limit` (máximo 100) y `offset`.

Si ya existía una base de datos creada con una versión anterior, el cambio de
importes de `Float` a `Numeric(12, 2)` requiere una migración antes de usarla
en producción. Las bases nuevas se crean con el tipo correcto.

## Desarrollo local

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

## Tests del backend

```bash
backend/venv/bin/python -m pip install -r backend/requirements-dev.txt
cd backend
venv/bin/pytest
```

Los tests usan SQLite en memoria y no modifican la base de datos local.

## Operación del stack

El frontend sirve los archivos React y redirige las peticiones a FastAPI dentro
de la red privada de Compose. PostgreSQL usa el volumen `pgdata_prod` y los tres
servicios se reinician automáticamente salvo que se detengan manualmente.

Para ver el estado:

```bash
docker compose -f docker-compose.prod.yml ps
```

Para consultar logs:

```bash
docker compose -f docker-compose.prod.yml logs -f backend frontend
```

No expongas este servicio directamente a Internet sin añadir autenticación,
HTTPS y un reverse proxy con control de acceso. Para una LAN doméstica de
confianza, el puerto publicado del frontend es suficiente.
