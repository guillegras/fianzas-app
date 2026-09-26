from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class TransaccionBase(BaseModel):
    titulo: str | None = Field(default="Movimiento", max_length=120)
    monto: Decimal
    tipo: str
    categoria_id: int | None = Field(default=None)
    fecha: date
    descripcion: str | None = Field(default=None, max_length=500)


class TransaccionCreate(TransaccionBase):
    monto: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )


class TransaccionResponse(TransaccionBase):
    id: int
    categoria: str | None = Field(default="Sin categoría")
    model_config = ConfigDict(from_attributes=True)
