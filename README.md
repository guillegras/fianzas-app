# Finanzas App

Aplicación de finanzas personales lista para ejecutar con Docker.

## Requisitos

- Docker Desktop en Windows o macOS.
- Docker Engine y Docker Compose en Linux.
- Acceso a Internet durante el primer arranque para descargar las imágenes.

No necesitas instalar Python, Node.js, npm ni PostgreSQL.

## Instalación

### Linux y macOS

```bash
git clone <URL_DEL_REPOSITORIO>
cd finanzas-app
cp .env.example .env
```

### Windows (PowerShell)

```powershell
git clone <URL_DEL_REPOSITORIO>
cd finanzas-app
Copy-Item .env.example .env
```

Edita `.env` y cambia `DB_PASSWORD` por una contraseña propia. No compartas
ese archivo ni guardes credenciales reales en GitHub.

## Arranque

Con Docker Desktop o Docker Engine iniciado, ejecuta desde la carpeta del
repositorio:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

La primera ejecución puede tardar unos minutos. Cuando termine, abre:

**http://localhost:8080**

Los contenedores se reinician automáticamente si Docker se reinicia. Para que
la aplicación vuelva a arrancar después de encender el equipo, activa el inicio
automático de Docker Desktop o configura Docker Engine para iniciar con el
sistema.

La aplicación está configurada para aceptar conexiones únicamente desde el
propio equipo. No es accesible desde otros dispositivos de la red.

## Comandos útiles

Ver el estado:

```bash
docker compose -f docker-compose.prod.yml ps
```

Ver los registros:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Detener la aplicación sin borrar los datos:

```bash
docker compose -f docker-compose.prod.yml down
```

Para volver a iniciarla:

```bash
docker compose -f docker-compose.prod.yml up -d
```

No uses `down -v`: eliminaría también los datos guardados en PostgreSQL.

Si el puerto `8080` está ocupado, cambia `APP_PORT` en `.env` por otro, por
ejemplo `8081`, y accede después a `http://localhost:8081`.
