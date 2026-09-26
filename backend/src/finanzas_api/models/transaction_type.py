from sqlalchemy import Boolean, Column, String

from ..core.database import Base


class TipoMovimiento(Base):
    __tablename__ = "tipos_movimiento"

    id = Column(String, primary_key=True, index=True)
    etiqueta = Column(String, nullable=False)
    color = Column(String, nullable=False)
    es_ingreso = Column(Boolean, nullable=False, default=False)
    activo = Column(Boolean, nullable=False, default=True)
