#!/bin/bash

# Cargar variables del .env de forma segura
export $(grep -v '^#' .env | xargs)

echo "🚀 Preparando base de datos PostgreSQL..."

if [ ! "$(docker ps -a -q -f name=$DB_NAME)" ]; then
  echo "Creando base de datos por primera vez..."
  docker run --name $DB_NAME \
    -e POSTGRES_USER=$DB_USER \
    -e POSTGRES_PASSWORD=$DB_PASSWORD \
    -e POSTGRES_DB=$DB_NAME \
    -v finanzas_data:/var/lib/postgresql/data \
    -p $DB_PORT:$DB_PORT -d postgres:15
else
  echo "Arrancando base de datos existente..."
  docker start $DB_NAME
fi

echo "⏳ Esperando a que PostgreSQL esté listo..."
until docker exec $DB_NAME pg_isready -U $DB_USER > /dev/null 2>&1; do
  sleep 1
done
echo "✅ ¡Base de datos lista!"

echo "🐍 Arrancando Backend de FastAPI..."
cd backend
./venv/bin/uvicorn main:app --reload &
BACKEND_PID=$!

echo "⚛️ Arrancando Frontend de React..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Cerrar todo ordenadamente esperando a los procesos
trap "kill $BACKEND_PID $FRONTEND_PID; wait $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait