from datetime import date

from pydantic import BaseModel, Field


# 1. Esquema base (acepta cualquier monto para poder leer el historial antiguo)
class TransaccionBase(BaseModel):
    titulo: str | None = "Movimiento"
    monto: float
    tipo: str
    categoria: str | None = "General"
    fecha: date
    descripcion: str | None = None


# 2. Esquema de creación (AQUÍ ponemos el muro: solo para nuevos movimientos)
class TransaccionCreate(TransaccionBase):
    monto: float = Field(gt=0, description="El monto debe ser mayor a 0")


# 3. Esquema de respuesta (hereda del base, no choca con los datos antiguos)
class TransaccionResponse(TransaccionBase):
    id: int

    class Config:
        from_attributes = True
