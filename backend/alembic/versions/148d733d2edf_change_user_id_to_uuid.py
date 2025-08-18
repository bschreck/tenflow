"""change_user_id_to_uuid

Revision ID: 148d733d2edf
Revises: eea3e5671028
Create Date: 2025-08-17 15:08:04.648013

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '148d733d2edf'
down_revision: Union[str, None] = 'eea3e5671028'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Change User.id from integer to UUID and update all related tables.
    This is a complex migration that requires careful handling of foreign keys.
    """
    
    # Step 1: Add temporary UUID column to user table
    op.add_column('user', sa.Column('new_id', postgresql.UUID(), nullable=True))
    
    # Step 2: Generate UUIDs for existing users
    connection = op.get_bind()
    connection.execute(sa.text("UPDATE \"user\" SET new_id = gen_random_uuid()"))
    
    # Step 3: Make new_id not nullable
    op.alter_column('user', 'new_id', nullable=False)
    
    # Step 4: Add temporary UUID columns to all tables that reference user.id
    # These tables currently have UUID user_id columns that need to be updated
    
    # Update compliance_scores
    op.add_column('compliance_scores', sa.Column('new_user_id', postgresql.UUID(), nullable=True))
    connection.execute(sa.text("""
        UPDATE compliance_scores 
        SET new_user_id = u.new_id 
        FROM "user" u 
        WHERE compliance_scores.user_id::text = u.id::text
    """))
    
    # Update training_plans
    op.add_column('training_plans', sa.Column('new_user_id', postgresql.UUID(), nullable=True))
    connection.execute(sa.text("""
        UPDATE training_plans 
        SET new_user_id = u.new_id 
        FROM "user" u 
        WHERE training_plans.user_id::text = u.id::text
    """))
    
    # Update prescribed_workouts
    op.add_column('prescribed_workouts', sa.Column('new_user_id', postgresql.UUID(), nullable=True))
    connection.execute(sa.text("""
        UPDATE prescribed_workouts 
        SET new_user_id = u.new_id 
        FROM "user" u 
        WHERE prescribed_workouts.user_id::text = u.id::text
    """))
    
    # Update profiles
    op.add_column('profiles', sa.Column('new_user_id', postgresql.UUID(), nullable=True))
    connection.execute(sa.text("""
        UPDATE profiles 
        SET new_user_id = u.new_id 
        FROM "user" u 
        WHERE profiles.user_id::text = u.id::text
    """))
    
    # Update strava_connections
    op.add_column('strava_connections', sa.Column('new_user_id', postgresql.UUID(), nullable=True))
    connection.execute(sa.text("""
        UPDATE strava_connections 
        SET new_user_id = u.new_id 
        FROM "user" u 
        WHERE strava_connections.user_id::text = u.id::text
    """))
    
    # Update subscribers
    op.add_column('subscribers', sa.Column('new_user_id', postgresql.UUID(), nullable=True))
    connection.execute(sa.text("""
        UPDATE subscribers 
        SET new_user_id = u.new_id 
        FROM "user" u 
        WHERE subscribers.user_id::text = u.id::text
    """))
    
    # Update training_activities
    op.add_column('training_activities', sa.Column('new_user_id', postgresql.UUID(), nullable=True))
    connection.execute(sa.text("""
        UPDATE training_activities 
        SET new_user_id = u.new_id 
        FROM "user" u 
        WHERE training_activities.user_id::text = u.id::text
    """))
    
    # Step 5: Drop old primary key and create new one
    op.drop_constraint('user_pkey', 'user', type_='primary')
    op.drop_column('user', 'id')
    op.alter_column('user', 'new_id', new_column_name='id')
    op.create_primary_key('user_pkey', 'user', ['id'])
    
    # Step 6: Update all foreign key references
    # Drop old columns and rename new ones
    
    # compliance_scores
    op.drop_column('compliance_scores', 'user_id')
    op.alter_column('compliance_scores', 'new_user_id', new_column_name='user_id', nullable=False)
    op.create_index('ix_compliance_scores_user_id', 'compliance_scores', ['user_id'])
    
    # training_plans
    op.drop_column('training_plans', 'user_id')
    op.alter_column('training_plans', 'new_user_id', new_column_name='user_id', nullable=False)
    
    # prescribed_workouts
    op.drop_column('prescribed_workouts', 'user_id')
    op.alter_column('prescribed_workouts', 'new_user_id', new_column_name='user_id', nullable=False)
    
    # profiles
    op.drop_index('ix_profiles_user_id', 'profiles')
    op.drop_column('profiles', 'user_id')
    op.alter_column('profiles', 'new_user_id', new_column_name='user_id', nullable=False)
    op.create_index('ix_profiles_user_id', 'profiles', ['user_id'], unique=True)
    
    # strava_connections
    op.drop_index('ix_strava_connections_user_id', 'strava_connections')
    op.drop_column('strava_connections', 'user_id')
    op.alter_column('strava_connections', 'new_user_id', new_column_name='user_id', nullable=False)
    op.create_index('ix_strava_connections_user_id', 'strava_connections', ['user_id'], unique=True)
    
    # subscribers
    op.drop_index('ix_subscribers_user_id', 'subscribers')
    op.drop_column('subscribers', 'user_id')
    op.alter_column('subscribers', 'new_user_id', new_column_name='user_id', nullable=False)
    op.create_index('ix_subscribers_user_id', 'subscribers', ['user_id'], unique=True)
    
    # training_activities
    op.drop_index('ix_training_activities_user_id', 'training_activities')
    op.drop_column('training_activities', 'user_id')
    op.alter_column('training_activities', 'new_user_id', new_column_name='user_id', nullable=False)
    op.create_index('ix_training_activities_user_id', 'training_activities', ['user_id'])


def downgrade() -> None:
    """
    Revert User.id from UUID back to integer.
    WARNING: This will lose data if there are more users than can fit in integer range.
    """
    
    # This is a complex downgrade that would need to map UUIDs back to integers
    # For safety, we'll raise an error instead of attempting automatic downgrade
    raise NotImplementedError(
        "Downgrading from UUID to integer User IDs is not supported. "
        "This would require manual data migration to avoid data loss."
    )
