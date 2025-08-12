#!/usr/bin/env python3
"""
Initialize the database with tables and a default admin user.
"""

from sqlmodel import Session, select
from tenflow.database import engine, create_db_and_tables
from tenflow.models import User
from tenflow.core.security import get_password_hash


def init_db():
    # Create tables
    create_db_and_tables()

    with Session(engine) as session:
        # Check if admin user exists
        statement = select(User).where(User.username == 'admin')
        admin_user = session.exec(statement).first()

        if not admin_user:
            # Create default admin user
            admin_user = User(
                email='admin@tenflow.com',
                username='admin',
                full_name='Admin User',
                hashed_password=get_password_hash('admin123'),
                is_active=True,
                is_superuser=True,
            )
            session.add(admin_user)
            session.commit()
            print('Created default admin user (username: admin, password: admin123)')
        else:
            print('Admin user already exists')

        # Create a demo user
        statement = select(User).where(User.username == 'demo')
        demo_user = session.exec(statement).first()

        if not demo_user:
            demo_user = User(
                email='demo@tenflow.com',
                username='demo',
                full_name='Demo User',
                hashed_password=get_password_hash('demo123'),
                is_active=True,
                is_superuser=False,
            )
            session.add(demo_user)
            session.commit()
            print('Created demo user (username: demo, password: demo123)')
        else:
            print('Demo user already exists')


if __name__ == '__main__':
    init_db()
    print('Database initialized successfully!')
