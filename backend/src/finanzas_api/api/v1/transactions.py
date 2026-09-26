from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ...core.database import SessionLocal
from ...schemas.transaction import TransaccionCreate, TransaccionResponse
from ...services import dashboard, transactions

router = APIRouter(
    prefix="/transacciones",
    tags=["transacciones"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TransaccionResponse)
def crear_transaccion(
    transaccion: TransaccionCreate,
    db: Session = Depends(get_db),
):
    try:
        return transactions.create_transaccion(db=db, transaccion=transaccion)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha podido guardar la transacción.",
        ) from None


@router.get("/")
def listar_transacciones(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    tipo: str | None = None,
    categoria_id: int | None = None,
    montoMin: float | None = None,
    montoMax: float | None = None,
    mes: str | None = None,
    anio: str | None = None,
    fechaInicio: str | None = None,
    fechaFin: str | None = None,
    db: Session = Depends(get_db),
):
    try:
        return transactions.get_transacciones(
            db=db,
            limit=limit,
            offset=offset,
            tipo=tipo,
            categoria_id=categoria_id,
            montoMin=montoMin,
            montoMax=montoMax,
            mes=mes,
            anio=anio,
            fechaInicio=fechaInicio,
            fechaFin=fechaFin,
        )
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La base de datos no está disponible.",
        ) from None


@router.get("/resumen")
def obtener_resumen(
    mes: str | None = None,
    anio: str | None = None,
    db: Session = Depends(get_db),
):
    try:
        return dashboard.build_resumen(db=db, mes=mes, anio=anio)
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Error al calcular el resumen.",
        ) from None


@router.delete("/{transaccion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaccion(
    transaccion_id: int,
    db: Session = Depends(get_db),
):
    try:
        exito = transactions.delete_transaccion(db=db, transaccion_id=transaccion_id)
        if not exito:
            raise HTTPException(status_code=404, detail="Transacción no encontrada")
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha podido eliminar la transacción.",
        ) from None
