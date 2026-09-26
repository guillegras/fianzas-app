from sqlalchemy import Column, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from ..core.database import Base
from .transaction_category import CategoriaMovimiento
from .transaction_type import TipoMovimiento


class Transaccion(Base):
    __tablename__ = "transacciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True, nullable=True)
    monto = Column(Numeric(12, 2), nullable=False)
    tipo = Column(
        String, ForeignKey("tipos_movimiento.id"), index=False, nullable=False
    )
    categoria_id = Column(
        Integer, ForeignKey("categorias_movimiento.id"), index=True, nullable=True
    )
    fecha = Column(Date, nullable=False)
    descripcion = Column(String, nullable=True)

    tipo_relacion = relationship("TipoMovimiento")
    categoria_relacion = relationship("CategoriaMovimiento")
