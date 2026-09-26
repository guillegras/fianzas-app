from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...core.database import SessionLocal
from ...models.transaction_type import TipoMovimiento
from ...schemas.transaction_type import (
    TransactionType,
    TransactionTypeCreate,
    TransactionTypeUpdate,
)

router = APIRouter(prefix="/transaction-types", tags=["transaction-types"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[TransactionType])
def listar_tipos(db: Session = Depends(get_db)):
    return db.query(TipoMovimiento).all()


@router.post("/", response_model=TransactionType, status_code=status.HTTP_201_CREATED)
def crear_tipo(tipo: TransactionTypeCreate, db: Session = Depends(get_db)):
    db_tipo = db.query(TipoMovimiento).filter(TipoMovimiento.id == tipo.id).first()
    if db_tipo:
        raise HTTPException(status_code=400, detail="El tipo de movimiento ya existe")

    nuevo_tipo = TipoMovimiento(**tipo.model_dump())
    db.add(nuevo_tipo)
    db.commit()
    db.refresh(nuevo_tipo)
    return nuevo_tipo


@router.put("/{tipo_id}", response_model=TransactionType)
def actualizar_tipo(
    tipo_id: str, tipo_update: TransactionTypeUpdate, db: Session = Depends(get_db)
):
    db_tipo = db.query(TipoMovimiento).filter(TipoMovimiento.id == tipo_id).first()
    if not db_tipo:
        raise HTTPException(status_code=404, detail="Tipo de movimiento no encontrado")

    update_data = tipo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tipo, key, value)

    db.commit()
    db.refresh(db_tipo)
    return db_tipo


@router.delete("/{tipo_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_tipo(tipo_id: str, db: Session = Depends(get_db)):
    db_tipo = db.query(TipoMovimiento).filter(TipoMovimiento.id == tipo_id).first()
    if not db_tipo:
        raise HTTPException(status_code=404, detail="Tipo de movimiento no encontrado")

    db.delete(db_tipo)
    db.commit()
    return None
