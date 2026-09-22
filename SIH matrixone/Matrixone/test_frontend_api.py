"""Verify all frontend API endpoints work directly against FastAPI app."""

import os
from fastapi.testclient import TestClient
from matrixone.backend.main import app

client = TestClient(app)

print("--- Testing /api/analytics/dashboard-stats ---")
r = client.get("/api/analytics/dashboard-stats")
print(f"Status: {r.status_code}")
assert r.status_code == 200, f"Failed: {r.text}"
data = r.json()
assert "total_cataloged" in data, "total_cataloged missing"
assert "duplicate_ratio" in data, "duplicate_ratio missing"
assert "cnmc_minted" in data, "cnmc_minted missing"
assert "projected_savings_cr" in data, "projected_savings_cr missing"
assert len(data.get("cpse_breakdown", [])) >= 6, "cpse_breakdown incomplete"
assert len(data.get("duplication_breakdown", [])) == 4, "duplication_breakdown incomplete"
assert len(data.get("processing_trend", [])) == 6, "processing_trend incomplete"
assert len(data.get("sector_radar", [])) == 6, "sector_radar incomplete"
assert len(data.get("recent_activity", [])) >= 4, "recent_activity incomplete"
assert len(data.get("pending_reviews", [])) >= 4, "pending_reviews incomplete"
print(f"Dashboard Stats OK: total={data['total_cataloged']}, cnmc={data['cnmc_minted']}, savings=INR {data['projected_savings_cr']}Cr")

print("\n--- Testing /api/matching/analyze (All 4 Presets) ---")
presets = [
    ("Ball Valve", "BALL VALVE 2 INCH 150# CS ASTM A216 WCB RF FLANGED LEVER OPERATED", "VALVE BALL 2IN 150LBS WCB BODY SS316 BALL FLANGED RF", "CPCL"),
    ("Centrifugal Pump", "CENTRIFUGAL PUMP 50 M3/HR HEAD 45M MOTOR 15KW CASING CI ENCLOSED IMPELLER", "PUMP CENTRIFUGAL WATER 50M3 45M HEAD CI CASING 15KW MOTOR 415V", "NTPC"),
    ("Bearing 6205", "DEEP GROOVE BALL BEARING 6205-2RS1 SKF C3 CLEARANCE 25X52X15MM", "BEARING RADIAL BALL 6205 2RS DOUBLE RUBBER SEAL 25MM BORE", "SAIL"),
    ("Flange 4in", "FLANGE WELD NECK 4 INCH CLASS 300 RF ASTM A105 SCH 40 SERRATED", "WELD NECK FLANGE 4IN 300# WNRF CARBON STEEL ASTM A105", "GAIL"),
]
for title, ta, tb, cpse in presets:
    payload = {"text_a": ta, "text_b": tb, "cpse_code": cpse}
    r = client.post("/api/matching/analyze", json=payload)
    assert r.status_code == 200, f"Failed for {title}: {r.text}"
    res = r.json()
    match = res["matches"][0]
    print(f"[{title}] Confidence: {match['confidence_percent']}%, Type: {match['match_type']}, CNMC: {res['recommended_cnmc']}")
    assert match["confidence_percent"] >= 90.0, f"Confidence too low for {title}: {match['confidence_percent']}"
    assert match["match_type"] == "IDENTICAL", f"Unexpected match type for {title}: {match['match_type']}"

print("\n--- Testing /api/ai-chat/query ---")
payload = {"query": "Show duplicate valves between CPCL and ONGC", "history": []}
r = client.post("/api/ai-chat/query", json=payload)
print(f"Status: {r.status_code}")
assert r.status_code == 200, f"Failed: {r.text}"
chat_data = r.json()
assert "response" in chat_data or "answer" in chat_data, "no response in chat"
print(f"Chat OK: {(chat_data.get('response') or chat_data.get('answer'))[:150]}...")
print(f"Suggested queries: {chat_data.get('suggested_queries')}")

print("\n--- Testing /v1 backwards compatibility ---")
r = client.get("/v1/organizations")
print(f"/v1/organizations Status: {r.status_code}")
assert r.status_code == 200

print("\nALL FRONTEND API TESTS PASSED PERFECTLY!")
