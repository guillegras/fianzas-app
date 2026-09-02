#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
    cp .env.example .env
    echo "Se ha creado .env desde .env.example. Revisa sus valores si lo necesitas."
fi

set -a
source .env
set +a

: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=postgrespassword}"
: "${DB_NAME:=finanzas_db}"
: "${DB_PORT:=5432}"
export DB_USER DB_PASSWORD DB_NAME DB_PORT

echo "Preparando PostgreSQL..."
docker compose up -d db

echo "Esperando a que PostgreSQL esté listo..."
until docker compose exec -T db pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
    sleep 1
done
echo "PostgreSQL listo."

if [[ ! -d backend/venv ]]; then
    echo "Creando entorno virtual de Python..."
    python3 -m venv backend/venv
fi

echo "Instalando dependencias del backend..."
backend/venv/bin/python -m pip install --disable-pip-version-check -q -r backend/requirements.txt

if [[ ! -d frontend/node_modules ]]; then
    echo "Instalando dependencias del frontend..."
    npm --prefix frontend install
fi

echo "Iniciando backend en http://localhost:8000..."
backend/venv/bin/python -m uvicorn main:app --app-dir backend --reload &
BACKEND_PID=$!

echo "Iniciando frontend en http://localhost:5173..."
npm --prefix frontend run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

cleanup() {
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT
wait