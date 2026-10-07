import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCENARIOS_PATH = ROOT / "shared" / "fixtures" / "scenarios.json"

GLOSSARY = [
    {
        "term": "Induced e.m.f.",
        "meaning": "The voltage produced when a conductor cuts magnetic field lines, or when the flux through a circuit changes.",
    },
    {
        "term": "Fleming's right-hand rule",
        "meaning": "Generator rule. Thumb = motion, first finger = field (N to S), second finger = induced conventional current.",
    },
    {
        "term": "Magnetic flux",
        "meaning": "Φ = BA cosθ. For this loop, with the normal along −Y, Φ = −B_y ℓ x.",
    },
    {
        "term": "Faraday's law",
        "meaning": "The induced e.m.f. equals the negative rate of change of flux: ε = −dΦ/dt. For the sliding bar this is the same as Bℓv.",
    },
    {
        "term": "Lenz's law",
        "meaning": "The induced current flows so that its magnetic force opposes the motion that caused it.",
    },
]


def load_scenarios() -> list[dict]:
    return json.loads(SCENARIOS_PATH.read_text(encoding="utf-8"))
