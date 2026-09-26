from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ...core.database import SessionLocal
from ...schemas.transaction_category import (
    CategoriaMovimientoCreate,
    CategoriaMovimientoResponse,
    CategoriaMovimientoUpdate,
)
from ...services import transaction_categories

router = APIRouter(
    prefix="/transaction-categories",
    tags=["transaction_categories"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{tipo_id}", response_model=list[CategoriaMovimientoResponse])
def listar_categorias_por_tipo(tipo_id: str, db: Session = Depends(get_db)):
    try:
        return transaction_categories.get_categories_by_tipo(db=db, tipo_id=tipo_id)
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La base de datos no está disponible.",
        ) from None


@router.post("/", response_model=CategoriaMovimientoResponse)
def crear_categoria(
    categoria: CategoriaMovimientoCreate, db: Session = Depends(get_db)
):
    try:
        return transaction_categories.create_category(db=db, category=categoria)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha podido crear la categoría.",
        ) from None


@router.put("/{categoria_id}", response_model=CategoriaMovimientoResponse)
def actualizar_categoria(
    categoria_id: int,
    categoria: CategoriaMovimientoUpdate,
    db: Session = Depends(get_db),
):
    try:
        actualizada = transaction_categories.update_category(
            db=db, category_id=categoria_id, category=categoria
        )
        if not actualizada:
            raise HTTPException(status_code=404, detail="Categoría no encontrada.")
        return actualizada
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha podido actualizar la categoría.",
        ) from None


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    try:
        exito = transaction_categories.delete_category(db=db, category_id=categoria_id)
        if not exito:
            raise HTTPException(status_code=404, detail="Categoría no encontrada.")
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se ha podido eliminar la categoría.",
        ) from None
