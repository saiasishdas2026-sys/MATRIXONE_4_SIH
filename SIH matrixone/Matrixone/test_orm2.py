import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from matrixone.backend.database import SessionLocal, create_all
from matrixone.backend.Models import Organization, User, Role

create_all()
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
    
    # Query back
    db_org = db.query(Organization).filter_by(name="CPCL-DEMO").first()
    print(f"Query organization: {db_org.name}")
    
    db_user = db.query(User).filter_by(email="test@matrixone.local").first()
    print(f"Query user: {db_user.email}")
    
finally:
    db.close()

print("\nAll ORM operations successful!")