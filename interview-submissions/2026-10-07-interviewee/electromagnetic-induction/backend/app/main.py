from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.physics.induction import EvaluateRequest, evaluate
from app.scenarios import GLOSSARY, load_scenarios

app = FastAPI(title="Induced current lab")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/api/scenarios")
def scenarios() -> list[dict]:
    return load_scenarios()


@app.get("/api/glossary")
def glossary() -> list[dict[str, str]]:
    return GLOSSARY


@app.post("/api/induction/evaluate")
def induction_evaluate(body: EvaluateRequest):
    return evaluate(body)
