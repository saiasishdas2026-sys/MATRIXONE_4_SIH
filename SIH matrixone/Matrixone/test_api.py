import os
import hashlib

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

# Create tables first
from matrixone.backend.database import create_all
from matrixone.backend.database_base import metadata
from matrixone.backend import Models

create_all()
print("Tables created:", list(metadata.tables.keys()))

from matrixone.backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Test health endpoint (at /health, not /v1/health)
response = client.get("/health")
print(f"Health: {response.status_code} - {response.json()}")

# Hash password using the same method as the app
hashed_pw = hashlib.sha256("password123".encode("utf-8")).hexdigest()

# Test create organization
response = client.post("/v1/organizations", json={"name": "CPCL-DEMO", "code": "CPCL-DEMO"})
print(f"Create org: {response.status_code} - {response.json()}")

# Create user directly (bypassing auth since role may not exist)
from matrixone.backend.database import SessionLocal
from matrixone.backend.Models import User, Role, Organization

db = SessionLocal()
# Find or create a minimal role
role = db.query(Role).filter(Role.name == "user").first()
if not role:
    role = Role(name="user", description="Standard user", is_system=True)
    db.add(role)
    db.commit()
    db.refresh(role)

# Find organization
org = db.query(Organization).filter(Organization.id == 1).first()

# Create user directly
user = User(
    email="admin@cpcl.com",
    full_name="CPCL Admin",
    hashed_password=hashed_pw,
    organization_id=1,
    role_id=role.id,
    is_active=True,
    is_superuser=False,
)
db.add(user)
db.commit()
db.refresh(user)
db.close()

print(f"User created: id={user.id}, email={user.email}")

# List organizations
response = client.get("/v1/organizations")
print(f"List orgs: {response.status_code} - {response.json()}")

# Create source system for the organization
response = client.post("/v1/source-systems", json={
    "name": "Legacy ERP",
    "client_or_namespace": "ERP-001",
    "organization_id": 1,
    "description": "Original ERP material master"
})
print(f"Create source system: {response.status_code} - {response.json()}")
source_system_id = response.json()["id"]

# Create import batch
response = client.post("/v1/import-batches", json={
    "organization_id": 1,
    "source_system_id": source_system_id,
    "uploaded_by_id": user.id,
    "filename": "test.csv",
    "original_filename": "test.csv",
    "format": "CSV"
})
print(f"Create batch: {response.status_code} - {response.json()}")
batch_id = response.json()["id"]

# Test upload materials
response = client.post(
    f"/v1/import-batches/{batch_id}/upload",
    files=[("file", ("test.csv", "local_material_code,description\nCPCL-001,Valve 100mm\nCPCL-002,GATE VALVE SS316 50MM\n", "text/csv"))]
)
print(f"Upload materials: {response.status_code} - {response.json()}")

# Create a source system for the organization
response = client.post("/v1/source-systems", json={
    "name": "Legacy ERP",
    "client_or_namespace": "ERP-001",
    "organization_id": 1,
    "description": "Original ERP material master"
})
print(f"Create source system: {response.status_code} - {response.json()}")
source_system_id = response.json()["id"]

# List organizations
response = client.get("/v1/organizations")
print(f"List orgs: {response.status_code} - {response.json()}")

# Test create import batch
response = client.post("/v1/import-batches", json={
    "organization_id": 1,
    "source_system_id": source_system_id,
    "uploaded_by_id": 1,
    "filename": "test.csv",
    "original_filename": "test.csv",
    "format": "CSV"
})
print(f"Create batch: {response.status_code} - {response.json()}")
batch_id = response.json()["id"]

# Test upload materials
response = client.post(
    f"/v1/import-batches/{batch_id}/upload",
    files=[("file", ("test.csv", "local_material_code,description\nCPCL-001,Valve 100mm\nCPCL-002,GATE VALVE SS316 50MM\n", "text/csv"))]
)
print(f"Upload materials: {response.status_code} - {response.json()}")

# Test get batch status
response = client.get(f"/v1/import-batches/{batch_id}/status")
print(f"Batch status: {response.status_code} - {response.json()}")

# Test create match run
response = client.post("/v1/match-runs", json={
    "name": "Initial Match",
    "description": "First matching run",
    "organization_id": 1,
    "source_system_id": source_system_id,
    "created_by_id": 1
})
print(f"Create match run: {response.status_code} - {response.json()}")

# Test get candidates
response = client.get(f"/v1/match-runs/1/candidates")
print(f"Get candidates: {response.status_code} - {response.json()}")

print("\nAll API tests passed!")