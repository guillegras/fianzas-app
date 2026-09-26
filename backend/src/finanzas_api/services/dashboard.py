from sqlalchemy.orm import Session

from ..models.transaction_type import TipoMovimiento
from ..repositories.metrics import fetch_categories, fetch_kpis
from ..utils.date_helpers import get_period_ranges


def build_resumen(db: Session, mes: str | None = None, anio: str | None = None):
    (curr_start, curr_end), (prev_start, prev_end) = get_period_ranges(mes, anio)

    kpis = fetch_kpis(db, curr_start, curr_end)
    cat_actual = fetch_categories(db, curr_start, curr_end)
    cat_previo = fetch_categories(db, prev_start, prev_end)

    tipos_db = db.query(TipoMovimiento).filter(TipoMovimiento.activo == True).all()
    tipos_map = {
        t.id: {"name": t.etiqueta, "color": t.color, "es_ingreso": t.es_ingreso}
        for t in tipos_db
    }

    mapa_categorias = {}
    desgloses = {}

    for (cat_nombre, tipo), total in cat_actual.items():
        mapa_categorias[(cat_nombre, tipo)] = {"actual": total, "anterior": 0.0}
        if tipo not in desgloses:
            desgloses[tipo] = []
        desgloses[tipo].append({"name": cat_nombre, "value": total})

    for (cat_nombre, tipo), total in cat_previo.items():
        if (cat_nombre, tipo) not in mapa_categorias:
            mapa_categorias[(cat_nombre, tipo)] = {"actual": 0.0, "anterior": total}
        else:
            mapa_categorias[(cat_nombre, tipo)]["anterior"] = total

    tabla_categorias = [
        {
            "categoria": cat_nombre,
            "tipo": tipo,
            "actual": data["actual"],
            "anterior": data["anterior"],
            "diferencia": data["actual"] - data["anterior"],
        }
        for (cat_nombre, tipo), data in mapa_categorias.items()
    ]

    tabla_categorias.sort(key=lambda x: x["actual"], reverse=True)
    for tipo in desgloses:
        desgloses[tipo].sort(key=lambda x: x["value"], reverse=True)

    por_tipo = kpis.get("porTipo", {})

    kpis_desglose = [
        {
            "id": t_id,
            "label": info["name"],
            "color": info["color"],
            "total": por_tipo.get(t_id, 0.0),
            "es_ingreso": info["es_ingreso"],
        }
        for t_id, info in tipos_map.items()
    ]

    data_pastel = [
        {
            "name": item["label"],
            "tipoId": item["id"],
            "value": item["total"],
            "color": item["color"],
        }
        for item in kpis_desglose
        if not item["es_ingreso"] and item["total"] > 0
    ]

    return {
        "kpis": {
            "totalIngresos": kpis["totalIngresos"],
            "gastosTotales": kpis["gastosTotales"],
            "balanceNeto": kpis["balanceNeto"],
            "detallesTipos": kpis_desglose,
        },
        "graficos": {
            "dataBarras": [
                {
                    "nombre": "Ingresos",
                    "cantidad": kpis["totalIngresos"],
                    "fill": "#10B981",
                },
                {
                    "nombre": "Gastos",
                    "cantidad": kpis["gastosTotales"],
                    "fill": "#EF4444",
                },
            ],
            "dataPastel": data_pastel,
            "desgloses": desgloses,
        },
        "tablaCategorias": tabla_categorias,
    }
