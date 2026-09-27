# Finanzas App

Aplicación web de gestión de finanzas personales para uso local. La aplicación y su base de datos se ejecutan en Docker y solo son accesibles desde el propio equipo, garantizando privacidad total sobre tus datos financieros.

**Versión actual: `0.3.0`**

---

## Requisitos

Necesitas tener instalado en tu equipo:

1. [Git](https://git-scm.com/downloads) para clonar el repositorio.
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows o macOS) o [Docker Engine](https://docs.docker.com/engine/install/) (Linux).
3. Conexión a Internet durante el primer arranque para descargar las imágenes base.

> [!NOTE]
> No necesitas tener instalados Python, Node.js ni PostgreSQL en tu sistema operativo: todo se ejecuta de forma aislada y contenerizada en Docker.

---

## Instalación y Configuración Inicial

### 1. Clonar el repositorio

En Windows abre PowerShell; en Linux o macOS abre tu Terminal:

```bash
git clone https://github.com/guillegras/fianzas-app.git
cd fianzas-app
```

O mediante SSH si tienes configurada una clave en GitHub:

```bash
git clone git@github.com:guillegras/fianzas-app.git
cd fianzas-app
```

### 2. Crear el archivo de configuración local `.env`

Linux y macOS:
```bash
cp .env.example .env
```

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Abre el archivo `.env` recién creado y cambia `DB_PASSWORD` por una contraseña segura propia. Este archivo almacena configuración privada y **nunca** debe subirse a GitHub.

---

## Entornos Disponibles

El proyecto cuenta con dos entornos independientes gestionados por Docker Compose:

| Entorno | Archivo Compose | Frontend | Backend (API) | Base de Datos (Port) | Uso Principal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Producción** | `docker-compose.prod.yml` | `http://localhost:8080` | Proxy interno vía Nginx | Interno (`pgdata_prod`) | Uso diario y datos reales |
| **Desarrollo** | `docker-compose.dev.yml` | `http://localhost:5173` | `http://localhost:8001` | `localhost:5433` (`pgdata_dev`) | Modificar código en caliente (HMR) |

---

## 1. Entorno de Producción (Uso Diario)

En producción, el frontend se compila como archivos estáticos optimizados servidos por Nginx (reverse proxy unprivileged), comunicándose internamente con la API FastAPI y la base de datos PostgreSQL. Las migraciones de base de datos se aplican automáticamente en el arranque.

### Iniciar Producción

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Una vez completado el arranque, abre tu navegador en:

👉 **[http://localhost:8080](http://localhost:8080)**

### Parar Producción (sin borrar datos)

```bash
docker compose -f docker-compose.prod.yml down
```

### Volver a iniciar sin reconstruir

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Ver registros (logs) de producción

```bash
docker compose -f docker-compose.prod.yml logs -f
```

---

## 2. Entorno de Desarrollo (Desarrolladores)

En desarrollo, tanto el frontend (Vite) como el backend (Uvicorn con `--reload`) tienen los directorios locales montados como volúmenes. Cualquier cambio en los archivos de `frontend/` o `backend/` se refleja al instante sin necesidad de reconstruir las imágenes.

### Iniciar Desarrollo

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Servicios disponibles en desarrollo:
* **Frontend (React con Hot Module Replacement):** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:8001](http://localhost:8001)
* **Documentación interactiva de la API (Swagger UI):** [http://localhost:8001/docs](http://localhost:8001/docs)
* **Base de datos PostgreSQL:** `localhost:5433` (Usuario: `dev_user`, Contraseña: `dev_password`, BD: `finanzas_db_dev`)

### Parar Desarrollo

```bash
docker compose -f docker-compose.dev.yml down
```

### Ver registros (logs) de desarrollo

```bash
docker compose -f docker-compose.dev.yml logs -f
```

---

## Migraciones de Base de Datos (Alembic)

La aplicación utiliza [Alembic](https://alembic.sqlalchemy.org/) para versionar la base de datos.
Al arrancar el contenedor del backend (tanto en producción como en desarrollo), el sistema:
1. Comprueba la disponibilidad de la base de datos.
2. Si detecta una base de datos preexistente de la versión inicial v0.1.0, estampa automáticamente la versión base sin perder registros.
3. Ejecuta automáticamente `alembic upgrade head` para garantizar que todas las tablas y relaciones estén al día.

Si estás desarrollando y agregas o modificas modelos SQLAlchemy en `backend/src/finanzas_api/models/`:

Para crear una nueva migración automática:
```bash
docker compose -f docker-compose.dev.yml exec backend alembic revision --autogenerate -m "descripcion_del_cambio"
```

---

## Copias de Seguridad y Datos

Los datos se guardan en volúmenes persistentes de Docker (`pgdata_prod` para producción y `pgdata_dev` para desarrollo) y sobreviven a la parada o reconstrucción de los contenedores.

### Crear una copia de seguridad (Backup de Producción)

```bash
docker compose -f docker-compose.prod.yml exec -T db \
    pg_dump -U postgres finanzas_db > backup.sql
```

### Restaurar una copia de seguridad

```bash
docker compose -f docker-compose.prod.yml exec -T db \
    psql -U postgres finanzas_db < backup.sql
```

> [!CAUTION]
> No ejecutes `docker compose down -v` salvo que quieras **eliminar permanentemente** todos los datos guardados en la base de datos.

---

## Personalización de Puertos

Si alguno de los puertos por defecto ya está ocupado en tu equipo, puedes modificarlos en el archivo `.env`:

```env
# Puerto de Producción (por defecto 8080)
APP_PORT=8085

# Puertos de Desarrollo (Opcionales)
DEV_FRONTEND_PORT=5174
DEV_BACKEND_PORT=8002
DEV_DB_PORT=5434
```

Tras modificar los puertos en `.env`, reinicia el entorno correspondiente.

---

## Solución de Problemas

1. **Docker no responde:** Asegúrate de que Docker Desktop esté iniciado y el motor de Docker esté en verde.
2. **La página no carga en el primer arranque:** El primer arranque descarga las imágenes y compila los paquetes, lo que puede tardar un par de minutos según tu conexión. Revisa el estado de los contenedores con:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```
3. **Comprobar el estado de salud de la API:**
   * En producción: Abre [http://localhost:8080/health](http://localhost:8080/health)
   * En desarrollo: Abre [http://localhost:8001/health](http://localhost:8001/health)
   Ambos deben responder `{"status":"ok"}`.
