from sqlalchemy.orm import Session

from ..models.transaction_category import CategoriaMovimiento
from ..schemas.transaction_category import (
    CategoriaMovimientoCreate,
    CategoriaMovimientoUpdate,
)


def get_categories_by_tipo(db: Session, tipo_id: str):
    return (
        db.query(CategoriaMovimiento)
        .filter(CategoriaMovimiento.tipo_id == tipo_id)
        .order_by(CategoriaMovimiento.nombre.asc())
        .all()
    )


def create_category(db: Session, category: CategoriaMovimientoCreate):
    db_category = CategoriaMovimiento(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update_category(db: Session, category_id: int, category: CategoriaMovimientoUpdate):
    db_category = (
        db.query(CategoriaMovimiento)
        .filter(CategoriaMovimiento.id == category_id)
        .first()
    )
    if not db_category:
        return None

    update_data = category.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)

    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int):
    db_category = (
        db.query(CategoriaMovimiento)
        .filter(CategoriaMovimiento.id == category_id)
        .first()
    )
    if not db_category:
        return False
    db.delete(db_category)
    db.commit()
    return True
