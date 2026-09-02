import models
import schemas
from database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Finanzas Personales", version="1.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def leer_raiz():
    return {"mensaje": "¡Servidor y base de datos de finanzas listos!"}


@app.get("/probar-conexion")
def probar_conexion(db: Session = Depends(get_db)):  # noqa: B008
    try:
        resultado = db.execute(text("SELECT 1")).scalar()
        return {"estado": "Conexión exitosa", "resultado_db": resultado}
    except Exception as e:  # noqa: BLE001
        return {"estado": "Error de conexión", "detalle": str(e)}


@app.post("/transacciones/", response_model=schemas.TransaccionResponse)
def crear_transaccion(
    transaccion: schemas.TransaccionCreate,
    db: Session = Depends(get_db),  # noqa: B008
):
    nueva_transaccion = models.Transaccion(**transaccion.model_dump())
    db.add(nueva_transaccion)
    db.commit()
    db.refresh(nueva_transaccion)
    return nueva_transaccion


@app.get("/transacciones/", response_model=list[schemas.TransaccionResponse])
def listar_transacciones(db: Session = Depends(get_db)):  # noqa: B008
    transacciones = (
        db.query(models.Transaccion).order_by(models.Transaccion.fecha.desc()).all()
    )
    return transacciones


@app.delete("/transacciones/{transaccion_id}")
def delete_transaccion(transaccion_id: int, db: Session = Depends(get_db)):  # noqa: B008
    transaccion = (
        db.query(models.Transaccion)
        .filter(models.Transaccion.id == transaccion_id)
        .first()
    )
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    db.delete(transaccion)
    db.commit()
    return {"mensaje": "Transacción eliminada"}
