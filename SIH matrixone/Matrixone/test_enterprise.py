import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
from matrixone.backend.database import create_all
from matrixone.backend import Models
create_all()
from matrixone.backend.main import app
from fastapi.testclient import TestClient
client = TestClient(app)

def show(label, r):
    try:
        body = r.json()
    except Exception:
        body = r.text[:300]
    print(f"{label}: {r.status_code} -> {str(body)[:600]}")
    return body

# seed
b = show("seed", client.post("/v1/auth/seed"))
# login 3 roles
admin = show("login admin", client.post("/v1/auth/login", json={"email": "admin@matrixone.gov.in", "password": "matrixone123"}))
reviewer = show("login reviewer", client.post("/v1/auth/login", json={"email": "reviewer@matrixone.gov.in", "password": "matrixone123"}))
viewer = show("login viewer", client.post("/v1/auth/login", json={"email": "viewer@matrixone.gov.in", "password": "matrixone123"}))
assert admin.get("role") == "admin" and "access_token" in admin and admin["access_token"] != "fake-token-for-demo", "admin JWT failed"
assert reviewer.get("role") == "reviewer", "reviewer role failed"
assert viewer.get("role") == "viewer", "viewer role failed"
print("roles/permissions OK:", admin["permissions"][:4], reviewer["permissions"][:4], viewer["permissions"])

H = {"Authorization": f"Bearer {admin['access_token']}"}
me = show("me", client.get("/v1/auth/me", headers=H))
assert me["email"] == "admin@matrixone.gov.in"

# upload prototype material_master.csv (first 40 rows for speed)
import csv
rows = list(csv.DictReader(open("matrixone/datasets/fixtures/material_master.csv", encoding="utf-8")))[:40]
orgs = show("orgs", client.get("/v1/organizations", headers=H))["organizations"]
org = orgs[0]
ss = show("source-systems", client.get(f"/v1/source-systems?organization_id={org['id']}", headers=H))["source_systems"][0]
# create batch
batch = show("create batch", client.post("/v1/import-batches", headers=H, json={
    "organization_id": org["id"], "source_system_id": ss["id"],
    "uploaded_by_id": me["id"], "filename": "material_master.csv",
    "original_filename": "material_master.csv", "format": "CSV"}))
bid = batch["id"]
# build csv: local_material_code,description (+ category,uom to exercise quality)
payload = "local_material_code,description,material category,unit of measurement\n" + "\n".join(
    f"{r['legacy_code']},{r['description']},{r['category']},{r['uom']}" for r in rows)
up = show("upload 40", client.post(f"/v1/import-batches/{bid}/upload", headers=H,
    files=[("file", ("material_master.csv", payload, "text/csv"))]))
assert up["created"] >= 30, up

ov = show("datasets/overview", client.get("/v1/datasets/overview", headers=H))
assert ov["totals"]["total_records"] >= 30
q = show("quality", client.get(f"/v1/datasets/{bid}/quality", headers=H))
assert "scores" in q and "overall" in q["scores"], q
print("quality scores:", q["scores"], "ready:", q["ai_matching_ready"])
fr = show("failed", client.get(f"/v1/datasets/{bid}/failed-records?limit=5", headers=H))
ostats = show("org stats", client.get("/v1/organizations/stats", headers=H))
assert len(ostats["organizations"]) >= 6
dbh = show("db-health", client.get("/v1/system/db-health", headers=H))
assert "material_db" in dbh and "vector_db" in dbh
sys = show("health", client.get("/v1/system/health", headers=H))
assert sys["status"] in ("healthy", "degraded")
users = show("users admin", client.get("/v1/auth/users", headers=H))
assert len(users["users"]) >= 3
# RBAC: viewer cannot update users
VH = {"Authorization": f"Bearer {viewer['access_token']}"}
r = client.patch(f"/v1/users/{me['id']}", headers=VH, json={"full_name": "Hacked"})
print(f"viewer patch blocked: {r.status_code} (expect 403)")
assert r.status_code == 403
# admin can update
r2 = client.patch(f"/v1/users/{me['id']}", headers=H, json={"full_name": "MATRIXONE Admin"})
print(f"admin patch: {r2.status_code} (expect 200)")
assert r2.status_code == 200
# export
ex = client.get(f"/v1/datasets/export?batch_id={bid}&include_quality=true", headers=H)
print(f"export: {ex.status_code}, bytes={len(ex.content)}, ctype={ex.headers.get('content-type')}")
assert ex.status_code == 200 and b"legacy_code" in ex.content
print("\nALL ENTERPRISE TESTS PASSED")
