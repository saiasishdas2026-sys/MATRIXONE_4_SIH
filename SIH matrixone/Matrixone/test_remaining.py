import os, re
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
from matrixone.backend.database import create_all
from matrixone.backend import Models
create_all()
from matrixone.backend.main import app
from fastapi.testclient import TestClient
client = TestClient(app)

def show(label, r):
    try: body = r.json()
    except Exception: body = r.text[:300]
    safe = str(body)[:500].encode("ascii", "replace").decode("ascii")
    print(f"{label}: {r.status_code} -> {safe}")
    return body

seed = show("seed", client.post("/v1/auth/seed"))
admin = show("login", client.post("/v1/auth/login", json={"email": "admin@matrixone.gov.in", "password": "matrixone123"}))
H = {"Authorization": f"Bearer {admin['access_token']}"}
viewer = show("login viewer", client.post("/v1/auth/login", json={"email": "viewer@matrixone.gov.in", "password": "matrixone123"}))
VH = {"Authorization": f"Bearer {viewer['access_token']}"}

# upload two orgs with overlapping valve descriptions
orgs = show("orgs", client.get("/v1/organizations", headers=H))["organizations"]
by_code = {o["code"]: o for o in orgs}
me = show("me", client.get("/v1/auth/me", headers=H))

def upload(org_code, rows, fname):
    ss = show(f"ss {org_code}", client.get(f"/v1/source-systems?organization_id={by_code[org_code]['id']}", headers=H))["source_systems"][0]
    b = show(f"batch {org_code}", client.post("/v1/import-batches", headers=H, json={
        "organization_id": by_code[org_code]["id"], "source_system_id": ss["id"],
        "uploaded_by_id": me["id"], "filename": fname, "original_filename": fname, "format": "CSV"}))
    payload = "local_material_code,description,material category,unit of measurement\n" + "\n".join(rows)
    up = show(f"upload {org_code}", client.post(f"/v1/import-batches/{b['id']}/upload", headers=H,
        files=[("file", (fname, payload, "text/csv"))]))
    return b["id"]

b1 = upload("CPCL", ["CPCL-V-1,SS316 GATE VALVE 50MM PN40 FLANGED,Valve,EA", "CPCL-V-2,MS Pipe 100mm NB ERW,Pipe,MTR"], "cpcl.csv")
b2 = upload("ONGC", ["ONGC-GV-9,\"VALVE, GATE, FLANGED, 50 NB, SS316, CLASS 300\",Valve,EA", "ONGC-P-3,SS316 Pipe 100mm NB ERW,Pipe,MTR"], "ongc.csv")

# match run + analyze (cross-org only)
run = show("match-run", client.post("/v1/match-runs", headers=H, json={
    "name": "E2E", "organization_id": by_code["CPCL"]["id"], "source_system_id": 1, "created_by_id": me["id"]}))
an = show("analyze", client.post(f"/v1/match-runs/{run['id']}/analyze", headers=H))
assert an["total_pairs_analyzed"] >= 2, an
assert "match_type_breakdown" in an, an
print("breakdown:", an["match_type_breakdown"])

cands = show("candidates", client.get(f"/v1/match-runs/{run['id']}/candidates", headers=H))["candidate_pairs"]
assert len(cands) >= 2
# cross-org only check
for c in cands:
    assert c["material_a"]["org"] != c["material_b"]["org"], c
valve_pair = next(c for c in cands if {c["material_a"]["org"], c["material_b"]["org"]} == {"CPCL", "ONGC"} and "VALVE" in (c["material_a"]["description"] or "").upper())
print("valve pair:", valve_pair["match_type"], valve_pair["confidence_score"], valve_pair["standardized_name"])
assert valve_pair["match_type"] in ("functional_equivalent", "near_duplicate", "exact")
assert valve_pair["confidence_score"] >= 0.7

# explain
ex = show("explain", client.get(f"/v1/matching/explain/{valve_pair['id']}", headers=H))
assert ex["confidence"] >= 0.7 and len(ex["layers"]) == 3 and len(ex["checklist"]) >= 5, ex
assert ex["standardized_name"], ex
print("explain OK:", ex["confidence_pct"], ex["match_type"])

# search fix: cpse code filter
s1 = show("search ALL", client.get("/v1/materials/search?query=VALVE", headers=H))
s2 = show("search CPCL", client.get("/v1/materials/search?query=VALVE&cpse=CPCL", headers=H))
assert all(r["cpse"] == "CPCL" for r in s2["results"]), s2
assert len(s1["results"]) >= len(s2["results"])

# equivalents (AI, pre-approval)
eq = show("equivalents", client.get(f"/v1/materials/equivalents/{valve_pair['material_a']['id']}", headers=H))
assert eq["ai_equivalents"], eq

# decision: viewer blocked
rv = client.post(f"/v1/candidate-pairs/{valve_pair['id']}/decision", headers=VH, json={"decision": "approve"})
print(f"viewer approve blocked: {rv.status_code} (expect 403)"); assert rv.status_code == 403

# approve as admin
ap = show("approve", client.post(f"/v1/candidate-pairs/{valve_pair['id']}/decision", headers=H,
    json={"decision": "approve", "reason": "E2E verified"}))
assert re.match(r"CNMC-[A-Z]{2}-[A-Z]{3}-\d{6}", ap["common_code"]), ap
assert ap["standard_name"], ap
print("CNMC:", ap["common_code"], "|", ap["standard_name"])

# national master full record
nm = show("national-master", client.get("/v1/national-master", headers=H))
assert nm["total"] >= 1
rec = nm["records"][0]
for k in ["national_code", "standard_name", "category", "equivalent_materials", "source_organizations",
          "original_codes", "original_descriptions", "approval_status", "version"]:
    assert k in rec, k
assert "CPCL" in rec["source_organizations"] and "ONGC" in rec["source_organizations"], rec
print("master OK:", rec["national_code"], rec["source_organizations"])

# chat
for q in ["How many duplicate valves are there?",
          f"Show equivalents for {valve_pair['material_a']['code']}",
          "Which companies use this material?",
          "Why did you classify these two items as equivalent?",
          "What materials can be purchased together?"]:
    c = show(f"chat: {q[:40]}", client.post("/v1/ai/chat", headers=H, json={"question": q}))
    assert c.get("answer"), c

# inventory + procurement + analytics
inv = show("inventory", client.get("/v1/inventory/optimization", headers=H))
assert inv["duplicate_groups"] >= 1 and inv["total_units"] > 0
pro = show("procurement", client.get("/v1/procurement/aggregation", headers=H))
assert pro["national_total_units"] > 0
ana = show("analytics", client.get("/v1/analytics/summary", headers=H))
assert all(k in ana for k in ["material_kpis", "financial_kpis", "organization_kpis"])
assert ana["material_kpis"]["total_uploaded"] >= 4

# erp, standards, migration, notifications, audit
erp = show("erp", client.get("/v1/erp/connectors", headers=H)); assert erp["connectors"]
std = show("standards", client.get("/v1/standards", headers=H)); assert std["configurable"] is True
mp = show("migration create", client.post("/v1/migration/plans", headers=H, json={"name": "E2E cutover", "organization_id": by_code["CPCL"]["id"]}))
assert mp["approved_mappings"] >= 1
mpl = show("migration list", client.get("/v1/migration/plans", headers=H)); assert mpl["plans"]
nt = show("notifications", client.get("/v1/notifications", headers=H)); assert "notifications" in nt
au = show("audit", client.get("/v1/audit/events?limit=10", headers=H))
assert any(e["action"] in ("CNMC_GENERATED", "MAPPING_APPROVED") for e in au["events"]), au

# reject path
pipe_pair = next((c for c in cands if "PIPE" in (c["material_a"]["description"] or "").upper() and c["id"] != valve_pair["id"]), None)
if pipe_pair:
    rj = show("reject", client.post(f"/v1/candidate-pairs/{pipe_pair['id']}/decision", headers=H,
        json={"decision": "reject", "reason": "Different metallurgy"}))
    assert rj["decision"] == "reject"

print("\nALL REMAINING-FEATURE TESTS PASSED")
