from sqlalchemy import Float, inspect, text

from .database import Base


def initialize_schema(engine):
    Base.metadata.create_all(bind=engine)

    if engine.dialect.name != "postgresql":
        return

    columns = inspect(engine).get_columns("transacciones")
    amount_column = next(
        (column for column in columns if column["name"] == "monto"),
        None,
    )
    if amount_column and isinstance(amount_column["type"], Float):
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE transacciones "
                    "ALTER COLUMN monto TYPE NUMERIC(12, 2) "
                    "USING ROUND(monto::numeric, 2)"
                )
            )
