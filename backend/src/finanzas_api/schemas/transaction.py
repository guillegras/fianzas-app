from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TransaccionBase(BaseModel):
    titulo: str | None = Field(default="Movimiento", max_length=120)
    monto: Decimal
    tipo: Literal["ingreso", "gasto_fijo", "gasto_variable", "inversion", "deuda"]
    categoria: str | None = Field(default="General", max_length=80)
    fecha: date
    descripcion: str | None = Field(default=None, max_length=500)


class TransaccionCreate(TransaccionBase):
    monto: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
        description="El monto debe ser mayor a 0",
    )


class TransaccionResponse(TransaccionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
