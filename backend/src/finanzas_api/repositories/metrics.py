import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models.transaction import Transaccion
from ..models.transaction_category import CategoriaMovimiento
from ..models.transaction_type import TipoMovimiento


def fetch_kpis(db: Session, start_date: datetime.date, end_date: datetime.date) -> dict:
    tipos = db.query(TipoMovimiento).all()
    tipo_info = {t.id: t.es_ingreso for t in tipos}

    resultados = (
        db.query(Transaccion.tipo, func.sum(Transaccion.monto).label("total"))
        .filter(Transaccion.fecha >= start_date, Transaccion.fecha <= end_date)
        .group_by(Transaccion.tipo)
        .all()
    )
    kpis_dict = {row.tipo: float(row.total) for row in resultados}

    ingresos = sum(
        total for tipo_id, total in kpis_dict.items() if tipo_info.get(tipo_id, False)
    )

    gastos_fijos = kpis_dict.get("gasto_fijo", 0.0)
    gastos_variables = kpis_dict.get("gasto_variable", 0.0)
    inversiones = kpis_dict.get("inversion", 0.0)
    deudas = kpis_dict.get("deuda", 0.0)

    gastos_totales = sum(
        total
        for tipo_id, total in kpis_dict.items()
        if not tipo_info.get(tipo_id, True)
    )

    return {
        "totalIngresos": ingresos,
        "totalGastosFijos": gastos_fijos,
        "totalGastosVariables": gastos_variables,
        "totalInversiones": inversiones,
        "totalDeudas": deudas,
        "gastosTotales": gastos_totales,
        "balanceNeto": ingresos - gastos_totales,
        "porTipo": kpis_dict,
    }


def fetch_categories(
    db: Session, start_date: datetime.date, end_date: datetime.date
) -> dict:
    resultados = (
        db.query(
            CategoriaMovimiento.nombre.label("categoria_nombre"),
            Transaccion.tipo,
            func.sum(Transaccion.monto).label("total"),
        )
        .outerjoin(
            CategoriaMovimiento, Transaccion.categoria_id == CategoriaMovimiento.id
        )
        .filter(Transaccion.fecha >= start_date, Transaccion.fecha <= end_date)
        .group_by(CategoriaMovimiento.nombre, Transaccion.tipo)
        .all()
    )
    return {
        (row.categoria_nombre or "Sin categoría", row.tipo): float(row.total)
        for row in resultados
    }
