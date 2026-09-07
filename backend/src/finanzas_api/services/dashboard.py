from sqlalchemy.orm import Session

from ..repositories.metrics import fetch_categories, fetch_kpis
from ..utils.date_helpers import get_period_ranges


def build_resumen(db: Session, mes: str | None = None, anio: str | None = None):
    (curr_start, curr_end), (prev_start, prev_end) = get_period_ranges(mes, anio)

    kpis = fetch_kpis(db, curr_start, curr_end)
    cat_actual = fetch_categories(db, curr_start, curr_end)
    cat_previo = fetch_categories(db, prev_start, prev_end)

    mapa_categorias = {}
    desgloses = {}

    for (cat, tipo), total in cat_actual.items():
        mapa_categorias[(cat, tipo)] = {"actual": total, "anterior": 0.0}
        if tipo not in desgloses:
            desgloses[tipo] = []
        desgloses[tipo].append({"name": cat, "value": total})

    for (cat, tipo), total in cat_previo.items():
        if (cat, tipo) not in mapa_categorias:
            mapa_categorias[(cat, tipo)] = {"actual": 0.0, "anterior": total}
        else:
            mapa_categorias[(cat, tipo)]["anterior"] = total

    tabla_categorias = [
        {
            "categoria": cat,
            "tipo": tipo,
            "actual": data["actual"],
            "anterior": data["anterior"],
            "diferencia": data["actual"] - data["anterior"],
        }
        for (cat, tipo), data in mapa_categorias.items()
    ]

    tabla_categorias.sort(key=lambda x: x["actual"], reverse=True)
    for tipo in desgloses:
        desgloses[tipo].sort(key=lambda x: x["value"], reverse=True)

    data_pastel = [
        {
            "name": "Gasto Fijo",
            "tipoId": "gasto_fijo",
            "value": kpis["totalGastosFijos"],
            "color": "#fd7e14",
        },
        {
            "name": "Gasto Variable",
            "tipoId": "gasto_variable",
            "value": kpis["totalGastosVariables"],
            "color": "#dc3545",
        },
        {
            "name": "Inversión",
            "tipoId": "inversion",
            "value": kpis["totalInversiones"],
            "color": "#0d6efd",
        },
        {
            "name": "Deuda",
            "tipoId": "deuda",
            "value": kpis["totalGastosVariables"],
            "color": "#6f42c1",
        },
    ]
    data_pastel = [d for d in data_pastel if d["value"] > 0]

    return {
        "kpis": kpis,
        "graficos": {
            "dataBarras": [
                {
                    "nombre": "Ingresos",
                    "cantidad": kpis["totalIngresos"],
                    "fill": "#28a745",
                },
                {
                    "nombre": "Salidas",
                    "cantidad": kpis["gastosTotales"],
                    "fill": "#dc3545",
                },
            ],
            "dataPastel": data_pastel,
            "desgloses": desgloses,
        },
        "tablaCategorias": tabla_categorias,
    }
