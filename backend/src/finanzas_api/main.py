import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .api.v1 import transaction_categories, transaction_type, transactions
from .core.database import SessionLocal
from .core.init_db import init_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    app.state.database_initialized = True
    yield


app = FastAPI(
    title="API Finanzas Personales",
    version="0.3.0",
    lifespan=lifespan,
)

origenes_permitidos = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(transaction_type.router)
app.include_router(transaction_categories.router)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def leer_raiz():
    return {"mensaje": "¡Servidor y base de datos de finanzas listos!"}


@app.get("/probar-conexion")
def probar_conexion(db: Session = Depends(get_db)):
    try:
        resultado = db.execute(text("SELECT 1")).scalar()
        return {"estado": "Conexión exitosa", "resultado_db": resultado}
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La base de datos no está disponible.",
        ) from None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ready")
def readiness(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La base de datos no está disponible.",
        ) from None
