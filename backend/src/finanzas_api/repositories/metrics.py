import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models.transaction import Transaccion


def fetch_kpis(db: Session, start_date: datetime.date, end_date: datetime.date) -> dict:
    resultados = (
        db.query(Transaccion.tipo, func.sum(Transaccion.monto).label("total"))
        .filter(Transaccion.fecha >= start_date, Transaccion.fecha <= end_date)
        .group_by(Transaccion.tipo)
        .all()
    )
    kpis_dict = {row.tipo: float(row.total) for row in resultados}

    ingresos = kpis_dict.get("ingreso", 0.0)
    gastos_fijos = kpis_dict.get("gasto_fijo", 0.0)
    gastos_variables = kpis_dict.get("gasto_variable", 0.0)
    inversiones = kpis_dict.get("inversion", 0.0)
    deudas = kpis_dict.get("deuda", 0.0)
    gastos_totales = gastos_fijos + gastos_variables + inversiones + deudas

    return {
        "totalIngresos": ingresos,
        "totalGastosFijos": gastos_fijos,
        "totalGastosVariables": gastos_variables,
        "totalInversiones": inversiones,
        "gastosTotales": gastos_totales,
        "balanceNeto": ingresos - gastos_totales,
    }


def fetch_categories(
    db: Session, start_date: datetime.date, end_date: datetime.date
) -> dict:
    resultados = (
        db.query(
            Transaccion.categoria,
            Transaccion.tipo,
            func.sum(Transaccion.monto).label("total"),
        )
        .filter(Transaccion.fecha >= start_date, Transaccion.fecha <= end_date)
        .group_by(Transaccion.categoria, Transaccion.tipo)
        .all()
    )
    return {(row.categoria, row.tipo): float(row.total) for row in resultados}
