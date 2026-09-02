from .database import Base
from sqlalchemy import Column, Date, Integer, Numeric, String


class Transaccion(Base):
    __tablename__ = "transacciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True, nullable=True)
    monto = Column(Numeric(12, 2), nullable=False)
    tipo = Column(String, index=False, nullable=False)
    categoria = Column(String, index=True, nullable=True)
    fecha = Column(Date, nullable=False)
    descripcion = Column(String, nullable=True)
