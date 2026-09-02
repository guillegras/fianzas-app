from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# 1. Esquema base (acepta cualquier monto para poder leer el historial antiguo)
class TransaccionBase(BaseModel):
    titulo: str | None = Field(default="Movimiento", max_length=120)
    monto: Decimal
    tipo: Literal["ingreso", "gasto_fijo", "gasto_variable", "inversion", "deuda"]
    categoria: str | None = Field(default="General", max_length=80)
    fecha: date
    descripcion: str | None = Field(default=None, max_length=500)


# 2. Esquema de creación (AQUÍ ponemos el muro: solo para nuevos movimientos)
class TransaccionCreate(TransaccionBase):
    monto: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
        description="El monto debe ser mayor a 0",
    )


# 3. Esquema de respuesta (hereda del base, no choca con los datos antiguos)
class TransaccionResponse(TransaccionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
