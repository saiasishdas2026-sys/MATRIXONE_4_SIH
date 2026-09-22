import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from matrixone.backend.database import create_all
from matrixone.backend import Models  # Import models to register them

create_all()
print('Tables created successfully with SQLite')

# Test inserting and querying
from matrixone.backend.database import SessionLocal
from matrixone.backend.Models import Role, Organization, User

db = SessionLocal()
try:
    # Create a role
    role = Role(name="admin", description="System administrator")
    db.add(role)
    db.commit()
    db.refresh(role)
    print(f"Created role: {role.name}, id={role.id}")
    
    # Create an organization
    org = Organization(name="CPCL-DEMO", code="CPCL-DEMO", is_demo=True)
    db.add(org)
    db.commit()
    db.refresh(org)
    print(f"Created organization: {org.name}, id={org.id}")
    
    # Create a user
    user = User(
        email="test@matrixone.local",
        full_name="Test User",
        organization_id=org.id,
        role_id=role.id,
        hashed_password="$2b$12$dummyhash"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"Created user: {user.email}, id={user.id}")
    
finally:
    db.close()

print("\nAll basic operations successful!")