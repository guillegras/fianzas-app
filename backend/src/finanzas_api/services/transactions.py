import math

from sqlalchemy.orm import Session

from ..models.transaction import Transaccion
from ..schemas.transaction import TransaccionCreate
from ..utils.date_helpers import build_filter_dates


def get_transacciones(
    db: Session,
    limit: int,
    offset: int,
    tipo: str | None = None,
    categoria: str | None = None,
    montoMin: float | None = None,
    montoMax: float | None = None,
    mes: str | None = None,
    anio: str | None = None,
    fechaInicio: str | None = None,
    fechaFin: str | None = None,
):
    query = db.query(Transaccion)

    if tipo:
        query = query.filter(Transaccion.tipo == tipo)
    if categoria:
        query = query.filter(Transaccion.categoria == categoria)
    if montoMin is not None:
        query = query.filter(Transaccion.monto >= montoMin)
    if montoMax is not None:
        query = query.filter(Transaccion.monto <= montoMax)

    inicio_filtro, fin_filtro = build_filter_dates(anio, mes)
    if inicio_filtro and fin_filtro:
        query = query.filter(Transaccion.fecha >= inicio_filtro)
        query = query.filter(Transaccion.fecha <= fin_filtro)

    if fechaInicio:
        query = query.filter(Transaccion.fecha >= fechaInicio)
    if fechaFin:
        query = query.filter(Transaccion.fecha <= fechaFin)

    total_items = query.count()
    total_pages = max(1, math.ceil(total_items / limit))
    transacciones = (
        query.order_by(Transaccion.fecha.desc(), Transaccion.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "items": [t.__dict__ for t in transacciones],
        "total_pages": total_pages,
    }


def create_transaccion(db: Session, transaccion: TransaccionCreate):
    nueva_transaccion = Transaccion(**transaccion.model_dump())
    db.add(nueva_transaccion)
    db.commit()
    db.refresh(nueva_transaccion)
    return nueva_transaccion


def delete_transaccion(db: Session, transaccion_id: int):
    transaccion = db.query(Transaccion).filter(Transaccion.id == transaccion_id).first()
    if not transaccion:
        return False
    db.delete(transaccion)
    db.commit()
    return True
