from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..core.database import Base


class CategoriaMovimiento(Base):
    __tablename__ = "categorias_movimiento"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tipo_id = Column(String, ForeignKey("tipos_movimiento.id"), nullable=False)
    activa = Column(Boolean, nullable=False, default=True)

    tipo_relacion = relationship("TipoMovimiento")
