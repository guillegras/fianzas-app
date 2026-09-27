import csv
from datetime import datetime
from decimal import Decimal
import io
import math

from sqlalchemy.orm import Session

from ..models.transaction import Transaccion
from ..models.transaction_category import CategoriaMovimiento
from ..models.transaction_type import TipoMovimiento
from ..schemas.transaction import TransaccionCreate
from ..utils.date_helpers import build_filter_dates


def build_transactions_query(
    db: Session,
    tipo: str | None = None,
    categoria_id: int | None = None,
    montoMin: float | None = None,
    montoMax: float | None = None,
    mes: str | None = None,
    anio: str | None = None,
    fechaInicio: str | None = None,
    fechaFin: str | None = None,
):
    query = db.query(
        Transaccion, CategoriaMovimiento.nombre.label("categoria_nombre")
    ).outerjoin(CategoriaMovimiento, Transaccion.categoria_id == CategoriaMovimiento.id)

    if tipo:
        query = query.filter(Transaccion.tipo == tipo)
    if categoria_id is not None:
        query = query.filter(Transaccion.categoria_id == categoria_id)
    if montoMin is not None:
        query = query.filter(Transaccion.monto >= montoMin)
    if montoMax is not None:
        query = query.filter(Transaccion.monto <= montoMax)

    inicio_filtro, fin_filtro = build_filter_dates(anio, mes)
    if inicio_filtro and fin_filtro:
        query = query.filter(Transaccion.fecha >= inicio_filtro)
        query = query.filter(Transaccion.fecha <= fin_filtro)

    if fechaInicio:
        try:
            parsed_inicio = datetime.strptime(str(fechaInicio).strip(), "%Y-%m-%d").date()
            query = query.filter(Transaccion.fecha >= parsed_inicio)
        except (ValueError, TypeError):
            pass
    if fechaFin:
        try:
            parsed_fin = datetime.strptime(str(fechaFin).strip(), "%Y-%m-%d").date()
            query = query.filter(Transaccion.fecha <= parsed_fin)
        except (ValueError, TypeError):
            pass

    return query


def get_transacciones(
    db: Session,
    limit: int,
    offset: int,
    tipo: str | None = None,
    categoria_id: int | None = None,
    montoMin: float | None = None,
    montoMax: float | None = None,
    mes: str | None = None,
    anio: str | None = None,
    fechaInicio: str | None = None,
    fechaFin: str | None = None,
):
    query = build_transactions_query(
        db=db,
        tipo=tipo,
        categoria_id=categoria_id,
        montoMin=montoMin,
        montoMax=montoMax,
        mes=mes,
        anio=anio,
        fechaInicio=fechaInicio,
        fechaFin=fechaFin,
    )

    total_items = query.count()
    total_pages = max(1, math.ceil(total_items / limit))
    transacciones_con_cat = (
        query.order_by(Transaccion.fecha.desc(), Transaccion.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    items = []
    for transaccion, categoria_nombre in transacciones_con_cat:
        t_dict = transaccion.__dict__.copy()
        if "_sa_instance_state" in t_dict:
            del t_dict["_sa_instance_state"]
        t_dict["categoria"] = categoria_nombre or "Sin categoría"
        items.append(t_dict)

    return {
        "items": items,
        "total_pages": total_pages,
        "total_items": total_items,
    }


def create_transaccion(db: Session, transaccion: TransaccionCreate):
    nueva_transaccion = Transaccion(**transaccion.model_dump())
    db.add(nueva_transaccion)
    db.commit()
    db.refresh(nueva_transaccion)
    if nueva_transaccion.categoria_relacion:
        nueva_transaccion.categoria = nueva_transaccion.categoria_relacion.nombre
    else:
        nueva_transaccion.categoria = "Sin categoría"
    return nueva_transaccion


def update_transaccion(db: Session, transaccion_id: int, transaccion_data: TransaccionCreate):
    transaccion = db.query(Transaccion).filter(Transaccion.id == transaccion_id).first()
    if not transaccion:
        return None

    for key, value in transaccion_data.model_dump().items():
        setattr(transaccion, key, value)

    db.commit()
    db.refresh(transaccion)
    if transaccion.categoria_relacion:
        transaccion.categoria = transaccion.categoria_relacion.nombre
    else:
        transaccion.categoria = "Sin categoría"
    return transaccion


def delete_transaccion(db: Session, transaccion_id: int):
    transaccion = db.query(Transaccion).filter(Transaccion.id == transaccion_id).first()
    if not transaccion:
        return False
    db.delete(transaccion)
    db.commit()
    return True


def export_transacciones_csv(
    db: Session,
    tipo: str | None = None,
    categoria_id: int | None = None,
    montoMin: float | None = None,
    montoMax: float | None = None,
    mes: str | None = None,
    anio: str | None = None,
    fechaInicio: str | None = None,
    fechaFin: str | None = None,
) -> str:
    query = build_transactions_query(
        db=db,
        tipo=tipo,
        categoria_id=categoria_id,
        montoMin=montoMin,
        montoMax=montoMax,
        mes=mes,
        anio=anio,
        fechaInicio=fechaInicio,
        fechaFin=fechaFin,
    )
    records = query.order_by(Transaccion.fecha.desc(), Transaccion.id.desc()).all()

    output = io.StringIO()
    # Write UTF-8 BOM so Excel opens it with proper characters
    output.write("\ufeff")
    writer = csv.writer(output, delimiter=",")
    writer.writerow(["fecha", "tipo", "categoria", "monto", "descripcion"])

    for transaccion, categoria_nombre in records:
        writer.writerow([
            transaccion.fecha.isoformat() if transaccion.fecha else "",
            transaccion.tipo or "",
            categoria_nombre or "Sin categoría",
            f"{float(transaccion.monto):.2f}",
            transaccion.descripcion or "",
        ])

    return output.getvalue()


def import_transacciones_csv(db: Session, file_bytes: bytes) -> dict:
    text = None
    for encoding in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            text = file_bytes.decode(encoding)
            break
        except UnicodeDecodeError:
            continue

    if text is None:
        raise ValueError("El archivo no tiene una codificación de texto válida (se esperaba UTF-8).")

    # Detect delimiter
    sample = text[:2048]
    delimiter = ","
    if ";" in sample and sample.count(";") > sample.count(","):
        delimiter = ";"
    elif "\t" in sample and sample.count("\t") > sample.count(","):
        delimiter = "\t"

    reader = csv.reader(io.StringIO(text), delimiter=delimiter)
    try:
        header = next(reader)
    except StopIteration:
        raise ValueError("El archivo CSV está vacío.")

    # Normalize header mapping
    normalized_headers = [h.strip().lower() for h in header]
    header_map = {}
    for idx, h in enumerate(normalized_headers):
        if h in ("fecha", "date", "dia", "día"):
            header_map["fecha"] = idx
        elif h in ("tipo", "type", "tipo_movimiento"):
            header_map["tipo"] = idx
        elif h in ("categoria", "categoría", "category"):
            header_map["categoria"] = idx
        elif h in ("monto", "importe", "cantidad", "amount", "valor"):
            header_map["monto"] = idx
        elif h in ("descripcion", "descripción", "notas", "nota", "description"):
            header_map["descripcion"] = idx
        elif h in ("titulo", "título", "title", "concepto"):
            header_map["titulo"] = idx

    required_fields = ["fecha", "tipo", "categoria", "monto"]
    missing = [f for f in required_fields if f not in header_map]
    if missing:
        raise ValueError(
            f"El CSV no contiene las columnas requeridas: {', '.join(missing)}. "
            f"Columnas detectadas: {', '.join(header)}"
        )

    # Pre-fetch existing types and categories
    tipos_db = db.query(TipoMovimiento).all()
    tipos_map = {}
    for t in tipos_db:
        tipos_map[t.id.lower()] = t
        tipos_map[t.etiqueta.lower()] = t

    if not tipos_db:
        raise ValueError("No hay tipos de movimiento configurados en el sistema.")

    categorias_db = db.query(CategoriaMovimiento).all()
    cat_map = {(c.tipo_id, c.nombre.lower()): c for c in categorias_db}

    transacciones_nuevas = []
    nuevas_categorias_creadas = 0

    for row_idx, row in enumerate(reader, start=2):
        if not row or all(not cell.strip() for cell in row):
            continue

        try:
            fecha_raw = row[header_map["fecha"]].strip()
            tipo_raw = row[header_map["tipo"]].strip()
            cat_raw = row[header_map["categoria"]].strip()
            monto_raw = row[header_map["monto"]].strip()
            desc_raw = (
                row[header_map["descripcion"]].strip()
                if "descripcion" in header_map and len(row) > header_map["descripcion"]
                else ""
            )
            titulo_raw = (
                row[header_map["titulo"]].strip()
                if "titulo" in header_map and len(row) > header_map["titulo"]
                else ""
            )
        except IndexError:
            raise ValueError(f"Fila {row_idx}: Faltan columnas en este registro.")

        # Parse date
        fecha_obj = None
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d"):
            try:
                fecha_obj = datetime.strptime(fecha_raw, fmt).date()
                break
            except ValueError:
                continue

        if not fecha_obj:
            raise ValueError(
                f"Fila {row_idx}: Formato de fecha inválido '{fecha_raw}'. Use YYYY-MM-DD o DD/MM/YYYY."
            )

        # Parse amount
        monto_str = monto_raw.replace("€", "").replace(" ", "").strip()
        if "," in monto_str and "." in monto_str:
            if monto_str.rfind(",") > monto_str.rfind("."):
                monto_str = monto_str.replace(".", "").replace(",", ".")
            else:
                monto_str = monto_str.replace(",", "")
        elif "," in monto_str:
            monto_str = monto_str.replace(",", ".")

        try:
            monto_val = Decimal(monto_str)
            if monto_val <= 0:
                raise ValueError()
        except Exception:
            raise ValueError(
                f"Fila {row_idx}: Importe inválido '{monto_raw}'. Debe ser un número positivo."
            )

        # Match tipo
        tipo_match = tipos_map.get(tipo_raw.lower())
        if not tipo_match:
            slug_tipo = tipo_raw.lower().replace(" ", "_")
            tipo_match = tipos_map.get(slug_tipo)

        if not tipo_match:
            tipos_validos = ", ".join(t.etiqueta for t in tipos_db)
            raise ValueError(
                f"Fila {row_idx}: Tipo de movimiento '{tipo_raw}' no reconocido. Tipos válidos: {tipos_validos}."
            )

        # Match or auto-create category
        if not cat_raw:
            cat_raw = "General"

        cat_key = (tipo_match.id, cat_raw.lower())
        cat_obj = cat_map.get(cat_key)
        if not cat_obj:
            cat_obj = CategoriaMovimiento(
                nombre=cat_raw,
                tipo_id=tipo_match.id,
                activa=True,
            )
            db.add(cat_obj)
            db.flush()
            cat_map[cat_key] = cat_obj
            nuevas_categorias_creadas += 1

        transaccion = Transaccion(
            titulo=titulo_raw or cat_raw,
            monto=monto_val,
            tipo=tipo_match.id,
            categoria_id=cat_obj.id,
            fecha=fecha_obj,
            descripcion=desc_raw or None,
        )
        transacciones_nuevas.append(transaccion)

    if not transacciones_nuevas:
        raise ValueError("No se encontraron registros para importar en el archivo.")

    db.add_all(transacciones_nuevas)
    db.commit()

    return {
        "importados": len(transacciones_nuevas),
        "categorias_creadas": nuevas_categorias_creadas,
        "mensaje": f"Se han importado {len(transacciones_nuevas)} movimientos correctamente.",
    }
