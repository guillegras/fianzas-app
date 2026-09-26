from pydantic import BaseModel, ConfigDict, Field


class CategoriaMovimientoBase(BaseModel):
    nombre: str = Field(max_length=80)
    tipo_id: str = Field(max_length=50)
    activa: bool = Field(default=True)


class CategoriaMovimientoCreate(CategoriaMovimientoBase):
    pass


class CategoriaMovimientoUpdate(BaseModel):
    nombre: str | None = Field(default=None, max_length=80)
    activa: bool | None = Field(default=None)


class CategoriaMovimientoResponse(CategoriaMovimientoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
