"""Added Journal Entry Model

Revision ID: 85475e8471c0
Revises: b1b8fa526587
Create Date: 2023-06-29 11:14:55.375265

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '85475e8471c0'
down_revision = 'b1b8fa526587'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('journalentry',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('category_id', sa.String(length=36), nullable=True),
    sa.Column('title', sa.String(length=120), nullable=False),
    sa.Column('body', sa.String(length=500), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('journalentry')
    # ### end Alembic commands ###