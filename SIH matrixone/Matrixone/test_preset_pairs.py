from matrixone.ai.matching import HybridMatcher, MaterialCandidate, parse_tech_specs

matcher = HybridMatcher(enable_embeddings=False, enable_lexical=True, enable_fuzzy=True)

pairs = [
    ("Ball Valve",
     "BALL VALVE 2 INCH 150# CS ASTM A216 WCB RF FLANGED LEVER OPERATED",
     "VALVE BALL 2IN 150LBS WCB BODY SS316 BALL FLANGED RF"),
    ("Centrifugal Pump",
     "CENTRIFUGAL PUMP 50 M3/HR HEAD 45M MOTOR 15KW CASING CI ENCLOSED IMPELLER",
     "PUMP CENTRIFUGAL WATER 50M3 45M HEAD CI CASING 15KW MOTOR 415V"),
    ("Bearing 6205",
     "DEEP GROOVE BALL BEARING 6205-2RS1 SKF C3 CLEARANCE 25X52X15MM",
     "BEARING RADIAL BALL 6205 2RS DOUBLE RUBBER SEAL 25MM BORE"),
    ("Flange 4in",
     "FLANGE WELD NECK 4 INCH CLASS 300 RF ASTM A105 SCH 40 SERRATED",
     "WELD NECK FLANGE 4IN 300# WNRF CARBON STEEL ASTM A105")
]

for title, ta, tb in pairs:
    sa = parse_tech_specs(ta)
    sb = parse_tech_specs(tb)
    ca = MaterialCandidate(1, "A", ta, {"classification": sa.category or "General", "grade": sa.grade, "size_mm": sa.size_mm, "pressure": sa.pressure}, "CPCL", "ERP")
    cb = MaterialCandidate(2, "B", tb, {"classification": sb.category or "General", "grade": sb.grade, "size_mm": sb.size_mm, "pressure": sb.pressure}, "ONGC", "ERP")
    res = matcher.analyze_pair(ca, cb)
    print(f"=== {title} ===")
    print(f"specs A: grade={sa.grade}, size={sa.size_mm}, pressure={sa.pressure}")
    print(f"specs B: grade={sb.grade}, size={sb.size_mm}, pressure={sb.pressure}")
    print(f"Score: {res.confidence_score*100:.1f}%, type: {res.decision_category}")
    print(f"Explanation: {res.explanation}\n")
