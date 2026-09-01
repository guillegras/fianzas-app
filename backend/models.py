from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class Transaccion(Base):
    __tablename__ = "transacciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True, nullable=True)
    monto = Column(Float, nullable=False)
    tipo = Column(String, index=False, nullable=False)
    categoria = Column(String, index=True, nullable=True)
    fecha = Column(Date, nullable=False)
    descripcion = Column(String, nullable=True)