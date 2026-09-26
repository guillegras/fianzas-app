import os
import time
from pathlib import Path
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect

from .database import SQLALCHEMY_DATABASE_URL


def init_database() -> None:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

    # 1. Esperar a que la base de datos acepte conexiones
    max_retries = 30
    for i in range(max_retries):
        try:
            with engine.connect() as conn:
                pass
            break
        except Exception:
            time.sleep(1)
    else:
        raise RuntimeError("No se pudo conectar a la base de datos tras 30 segundos.")

    # 2. Localizar alembic.ini
    alembic_ini_path = Path(__file__).resolve().parents[3] / "alembic.ini"
    if not alembic_ini_path.is_file():
        alembic_ini_path = Path("alembic.ini").resolve()

    if not alembic_ini_path.is_file():
        print(f"[init_database] No se encontró alembic.ini en {alembic_ini_path}")
        return

    alembic_cfg = Config(str(alembic_ini_path))
    alembic_dir = alembic_ini_path.parent / "alembic"
    if alembic_dir.is_dir():
        alembic_cfg.set_main_option("script_location", str(alembic_dir))

    inspector = inspect(engine)
    tablas = inspector.get_table_names()

    # Si existe 'transacciones' pero no 'alembic_version', proviene de una versión previa a Alembic
    if "alembic_version" not in tablas and "transacciones" in tablas:
        print("[init_database] Base de datos pre-Alembic detectada. Marcando revisión inicial...")
        command.stamp(alembic_cfg, "6a3584dc80f9")

    print("[init_database] Aplicando migraciones pendientes...")
    command.upgrade(alembic_cfg, "head")
    print("[init_database] Base de datos inicializada y actualizada a la última versión.")


if __name__ == "__main__":
    init_database()
