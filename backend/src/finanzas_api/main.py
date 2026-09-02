import os
from contextlib import asynccontextmanager

from . import models, schemas
from .database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    app.state.database_initialized = True
    yield


app = FastAPI(
    title="API Finanzas Personales",
    version="1.0",
    lifespan=lifespan,
)

origins = [origin.strip() for origin in os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.post("/transacciones/", response_model=schemas.TransaccionResponse)
def crear_transaccion(
    transaccion: schemas.TransaccionCreate,
    db: Session = Depends(get_db),  # noqa: B008
):
    try:
        nueva_transaccion = models.Transaccion(**transaccion.model_dump())
        db.add(nueva_transaccion)
        db.commit()
        db.refresh(nueva_transaccion)
        return nueva_transaccion
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha podido guardar la transacción.",
        ) from None


@app.get("/transacciones/", response_model=list[schemas.TransaccionResponse])
def listar_transacciones(
    response: Response,
    limit: int | None = Query(default=None, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),  # noqa: B008
):
    query = db.query(models.Transaccion).order_by(
        models.Transaccion.fecha.desc(),
        models.Transaccion.id.desc(),
    ).offset(offset)
    if limit is not None:
        query = query.limit(limit)

    try:
        transacciones = query.all()
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La base de datos no está disponible.",
        ) from None

    response.headers["X-Page-Limit"] = str(limit or "all")
    response.headers["X-Page-Offset"] = str(offset)
    return transacciones


@app.delete("/transacciones/{transaccion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaccion(transaccion_id: int, db: Session = Depends(get_db)):  # noqa: B008
    transaccion = (
        db.query(models.Transaccion)
        .filter(models.Transaccion.id == transaccion_id)
        .first()
    )
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    try:
        db.delete(transaccion)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha podido eliminar la transacción.",
        ) from None
