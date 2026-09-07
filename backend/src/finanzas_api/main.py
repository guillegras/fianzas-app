import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .api.v1 import transactions
from .core.database import SessionLocal, engine
from .core.migrations import initialize_schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_schema(engine)
    app.state.database_initialized = True
    yield


app = FastAPI(
    title="API Finanzas Personales",
    version="0.1.0",
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
def probar_conexion(db: Session = Depends(get_db)):  # noqa: B008
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
def readiness(db: Session = Depends(get_db)):  # noqa: B008
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La base de datos no está disponible.",
        ) from None
