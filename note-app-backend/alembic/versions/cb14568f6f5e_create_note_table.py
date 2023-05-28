"""create note table

Revision ID: cb14568f6f5e
Revises: 
Create Date: 2023-05-21 16:23:14.306904

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cb14568f6f5e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'note',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.current_timestamp()),
    )




def downgrade() -> None:
    pass
