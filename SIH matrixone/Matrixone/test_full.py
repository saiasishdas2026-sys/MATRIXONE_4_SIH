"""Setup script for MATRIXONE database models."""

import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from matrixone.backend.database import create_all
from matrixone.backend.database_base import metadata
from matrixone.backend import Models  # noqa: F401 - registers all models

# Create all tables
create_all()

# Check tables
print("Tables created:", list(metadata.tables.keys()))

# Test inserting data
from matrixone.backend.database import SessionLocal
from matrixone.backend.Models import Organization, User, Role

db = SessionLocal()
try:
    role = Role(name="admin", description="System administrator")
    db.add(role)
    db.commit()
    print(f"Role created: {role.name}, id={role.id}")
    
    org = Organization(name="CPCL-DEMO", code="CPCL-DEMO", is_demo=True)
    db.add(org)
    db.commit()
    print(f"Organization created: {org.name}, id={org.id}")
    
    user = User(
        email="test@matrixone.local",
        full_name="Test User",
        organization_id=org.id,
        role_id=role.id,
        hashed_password="$2b$12$dummyhash"
    )
    db.add(user)
    db.commit()
    print(f"User created: {user.email}, id={user.id}")
    
finally:
    db.close()

print("\nAll basic operations successful!")