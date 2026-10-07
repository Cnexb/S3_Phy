import json
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from app.physics.induction import EvaluateRequest, evaluate

ROOT = Path(__file__).resolve().parents[2]
FIXTURES = json.loads((ROOT / "shared" / "fixtures" / "vectors.json").read_text(encoding="utf-8"))


def test_fixtures_match_solver():
    for case in FIXTURES["cases"]:
        result = evaluate(
            EvaluateRequest(
                B=tuple(case["B"]),
                v=tuple(case["v"]),
                ell=tuple(case["ell"]),
                R=case["R"],
                closed=case["closed"],
                x=case["x"],
            )
        )
        assert result.emf == pytest_close(case["emf"]), case["name"]
        assert result.current == pytest_close(case["current"]), case["name"]
        assert result.phi == pytest_close(case["phi"]), case["name"]
        assert result.emfFaraday == pytest_close(case["emfFaraday"]), case["name"]
        assert result.zeroReason == case["zeroReason"], case["name"]
        assert result.lenzForce[0] * case["v"][0] + result.lenzForce[1] * case["v"][1] <= 1e-9


def test_http_evaluate_and_catalog():
    client = TestClient(app)
    assert client.get("/api/health").json()["ok"] is True
    scenarios = client.get("/api/scenarios").json()
    assert any(item["id"] == "textbook" for item in scenarios)
    assert client.get("/api/glossary").json()[0]["term"]
    body = {
        "B": [0, 0.2, 0],
        "v": [1.5, 0, 0],
        "ell": [0, 0, 0.1],
        "R": 2,
        "closed": True,
        "x": 0.12,
    }
    payload = client.post("/api/induction/evaluate", json=body).json()
    assert abs(payload["emf"] - 0.03) < 1e-6
    assert "Fleming" in payload["explanation"]


def pytest_close(expected: float, tol: float = 1e-6):
    class _Cmp:
        def __eq__(self, other: object) -> bool:
            return isinstance(other, (int, float)) and abs(float(other) - expected) <= tol

    return _Cmp()
