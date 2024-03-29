"""Added date field to journal entry model

Revision ID: 74d93d519def
Revises: d3de9c7b82db
Create Date: 2023-07-05 11:41:49.214262

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '74d93d519def'
down_revision = 'd3de9c7b82db'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('journalentry', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', sa.Date(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('journalentry', schema=None) as batch_op:
        batch_op.drop_column('date')

    # ### end Alembic commands ###
