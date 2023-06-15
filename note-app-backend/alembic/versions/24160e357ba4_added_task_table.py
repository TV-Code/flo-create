"""Added task table

Revision ID: 24160e357ba4
Revises: cb14568f6f5e
Create Date: 2023-06-13 17:24:33.247616

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '24160e357ba4'
down_revision = 'cb14568f6f5e'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'task',
        sa.Column('id', sa.String, primary_key=True),
        sa.Column('title', sa.String(120), nullable=False),
        sa.Column('description', sa.String(500), nullable=True),
        sa.Column('status', sa.String(120), nullable=False, default="Not Started"),
        sa.Column('weight', sa.Integer, nullable=False, default=1),
        sa.Column('progress', sa.Integer, nullable=False, default=0),
        sa.Column('created_at', sa.DateTime, nullable=False, default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )



def downgrade():
    op.drop_table('task')

