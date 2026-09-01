from pydantic import BaseModel
from datetime import date
from typing import Optional

class TransaccionCreate(BaseModel):
    titulo: Optional[str] = "Movimiento"  # Lo hacemos opcional por compatibilidad
    monto: float
    tipo: str
    categoria: Optional[str] = "General"   # Añadimos categoría
    fecha: date
    descripcion: Optional[str] = None

class TransaccionResponse(TransaccionCreate):
    id: int

    class Config:
        from_attributes = True