from typing import Optional

from pydantic import BaseModel, ConfigDict


class TransactionTypeBase(BaseModel):
    etiqueta: str
    color: str
    es_ingreso: bool
    activo: bool = True


class TransactionTypeCreate(TransactionTypeBase):
    id: str


class TransactionTypeUpdate(BaseModel):
    etiqueta: Optional[str] = None
    color: Optional[str] = None
    es_ingreso: Optional[bool] = None
    activo: Optional[bool] = None


class TransactionType(TransactionTypeBase):
    id: str
    model_config = ConfigDict(from_attributes=True)
