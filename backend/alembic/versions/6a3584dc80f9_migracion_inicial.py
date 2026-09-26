"""Migracion inicial

Revision ID: 6a3584dc80f9
Revises: 
Create Date: 2026-09-07 22:44:41.001556

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a3584dc80f9'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'transacciones',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('titulo', sa.String(length=120), nullable=True),
        sa.Column('monto', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('tipo', sa.String(), nullable=False),
        sa.Column('categoria', sa.String(length=80), nullable=True),
        sa.Column('fecha', sa.Date(), nullable=False),
        sa.Column('descripcion', sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transacciones_id'), 'transacciones', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_transacciones_id'), table_name='transacciones')
    op.drop_table('transacciones')