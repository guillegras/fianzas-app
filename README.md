# Finanzas App

Aplicación de finanzas personales para uso local. La aplicación y su base de
datos se ejecutan en Docker y solo son accesibles desde el mismo equipo.

**Versión actual: `0.1.0`**

## Requisitos

Necesitas:

1. [Git](https://git-scm.com/downloads), para descargar el repositorio.
2. Docker:
	 - [Docker Desktop para Windows y macOS](https://www.docker.com/products/docker-desktop/).
	 - [Docker Engine para Linux](https://docs.docker.com/engine/install/).
3. Conexión a Internet durante el primer arranque para descargar las imágenes.

No necesitas instalar Python, Node.js, npm ni PostgreSQL. Docker Desktop debe
estar abierto antes de ejecutar la aplicación en Windows o macOS.

## Instalación

### 1. Descargar el proyecto

En Linux o macOS, abre Terminal. En Windows, abre PowerShell.

```bash
git clone https://github.com/guillegras/fianzas-app.git
cd fianzas-app
```

También puedes utilizar SSH si tienes una clave configurada en GitHub:

```bash
git clone git@github.com:guillegras/fianzas-app.git
cd fianzas-app
```

### 2. Crear la configuración local

Linux y macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Abre el archivo `.env` y cambia `DB_PASSWORD` por una contraseña propia. Este
archivo contiene configuración privada y no debe subirse a GitHub.

## Ejecutar la aplicación

Desde la carpeta `fianzas-app`, ejecuta:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Este comando descarga las imágenes necesarias, construye la aplicación, crea
la base de datos y deja los servicios funcionando en segundo plano. La primera
ejecución puede tardar unos minutos.

Cuando termine, abre esta dirección en el navegador:

**http://localhost:8080**

La aplicación solo escucha en `localhost`; ningún otro dispositivo de la red
puede acceder a ella. Cada equipo mantiene sus propios datos.

## Uso diario

Si la aplicación está detenida, vuelve a iniciarla con:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Para detenerla sin borrar los datos:

```bash
docker compose -f docker-compose.prod.yml down
```

Para comprobar el estado de los servicios:

```bash
docker compose -f docker-compose.prod.yml ps
```

## Actualizar la aplicación

Para descargar la última versión y reconstruirla:

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

La base de datos se conserva porque está guardada en un volumen de Docker.

## Versionado

El proyecto utiliza [versionado semántico](https://semver.org/lang/es/):

- `0.1.0`: primera versión funcional, todavía en etapa inicial.
- `0.1.1`: corrección de errores sin cambios importantes.
- `0.2.0`: nueva funcionalidad compatible con la versión anterior.
- `1.0.0`: primera versión estable o cambio incompatible importante.

Cada versión publicada debe identificarse con una etiqueta de Git, por ejemplo
`v0.1.0`, y publicarse como una Release en GitHub. La etiqueta es la referencia
oficial de la versión; el README y las versiones internas del frontend y la API
deben mantenerse sincronizados con ella.

## Datos y copias de seguridad

Los datos se guardan en el volumen `pgdata_prod` y sobreviven a la parada o
reconstrucción de los contenedores.

Puedes crear una copia de seguridad antes de una actualización:

```bash
docker compose -f docker-compose.prod.yml exec -T db \
	pg_dump -U postgres finanzas_db > backup.sql
```

No ejecutes el siguiente comando salvo que quieras borrar todos los datos:

```bash
docker compose -f docker-compose.prod.yml down -v
```

## Configuración opcional

Si el puerto `8080` ya está ocupado, edita `.env` y cambia:

```env
APP_PORT=8081
```

Después reinicia la aplicación y accede a
[http://localhost:8081](http://localhost:8081).

Para que la aplicación se inicie automáticamente al encender el equipo,
activa el inicio automático de Docker Desktop o configura Docker Engine para
iniciarse con el sistema.

## Solución rápida de problemas

- Si Docker no responde, comprueba que Docker Desktop o Docker Engine esté
	iniciado.
- Si la página no carga inmediatamente tras el primer arranque, espera unos
	segundos y vuelve a abrirla.
- Para consultar los registros de todos los servicios:

	```bash
	docker compose -f docker-compose.prod.yml logs -f
	```
