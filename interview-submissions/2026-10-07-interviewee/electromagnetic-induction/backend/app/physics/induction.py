"""Motional e.m.f. for a bar sliding on rails in the XZ plane.

The bar lies along +Z. Positive conventional current goes up the bar.
The loop normal for that sense is −Y, so Φ = −B_y · x · ℓ.
"""

from __future__ import annotations

import math
from typing import Literal

from pydantic import BaseModel, Field

ZeroReason = Literal["ok", "b_zero", "v_zero", "no_cutting", "open"]

EPS_B = 1e-4
EPS_V = 1e-3
EPS_EMF = 1e-5


class EvaluateRequest(BaseModel):
    B: tuple[float, float, float]
    v: tuple[float, float, float]
    ell: tuple[float, float, float]
    R: float = Field(gt=0)
    closed: bool
    x: float


class EvaluateResponse(BaseModel):
    emf: float
    current: float
    phi: float
    dphiDt: float
    emfFaraday: float
    lenzForce: tuple[float, float, float]
    zeroReason: ZeroReason
    currentDirection: tuple[float, float, float]
    explanation: str


def _cross(a: tuple[float, float, float], b: tuple[float, float, float]) -> tuple[float, float, float]:
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def _dot(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _hypot(a: tuple[float, float, float]) -> float:
    return math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])


def _format(n: float, digits: int = 3) -> str:
    if not math.isfinite(n):
        return "—"
    abs_n = abs(n)
    if abs_n != 0 and (abs_n < 0.001 or abs_n >= 1000):
        return f"{n:.2e}"
    return f"{n:.{digits}f}"


def _field_phrase(b: tuple[float, float, float]) -> str:
    ax, ay, az = abs(b[0]), abs(b[1]), abs(b[2])
    if ay >= ax and ay >= az and ay > 0:
        return "into the page in the Front view" if b[1] >= 0 else "out of the page in the Front view"
    if ax >= az and ax > 0:
        return "to the right" if b[0] >= 0 else "to the left"
    if az > 0:
        return "upward" if b[2] >= 0 else "downward"
    return "nowhere"


def _explain(
    req: EvaluateRequest,
    emf: float,
    current: float,
    emf_faraday: float,
    zero_reason: ZeroReason,
) -> str:
    field = _field_phrase(req.B)
    motion = "to the right" if req.v[0] >= 0 else "to the left"
    current_way = "up the bar, from Q to P" if emf >= 0 else "down the bar, from P to Q"
    emf_text = f"{_format(emf)} V"

    if zero_reason == "b_zero":
        return (
            "The magnetic field is zero, so the bar cuts no field lines. "
            "Induced e.m.f. and current are both zero."
        )
    if zero_reason == "v_zero":
        return (
            f"The field points {field}, but the bar is stationary. "
            "A conductor induces an e.m.f. only while it cuts magnetic field lines, "
            "so ε = 0 and no current flows."
        )
    if zero_reason == "no_cutting":
        return (
            f"The bar is moving {motion} and the field points {field}. "
            "That motion does not cut field lines, because the velocity is parallel "
            "to the field or to the bar, so (v × B) · ℓ = 0. "
            "There is no induced current for Fleming's right-hand rule to point out."
        )

    simple = abs(req.B[0]) < 1e-4 and abs(req.B[2]) < 1e-4 and abs(req.v[1]) < 1e-4 and abs(req.v[2]) < 1e-4
    length = _hypot(req.ell)
    sin_theta = abs(req.ell[2]) / length if length > 1e-9 else 1.0
    slanted = abs(req.ell[0]) > 1e-4
    if simple and slanted:
        formula = (
            f"ε = Bℓv sinθ = ({_format(req.B[1], 2)})({_format(length, 2)})({_format(req.v[0], 2)})({_format(sin_theta, 2)}) "
            f"= {emf_text}. θ is the angle between PQ and the metal rods, so only ℓ sinθ, the gap between the rods, cuts the field. "
            "Faraday's law gives the same number."
        )
    elif simple:
        formula = (
            f"ε = Bℓv = ({_format(req.B[1], 2)})({_format(req.ell[2], 2)})({_format(req.v[0], 2)}) "
            f"= {emf_text}. Faraday's law gives the same number: ε = −dΦ/dt."
        )
    else:
        formula = (
            f"ε = (v × B) · ℓ = {emf_text}. Faraday's law gives the same number: "
            f"ε = −dΦ/dt = {_format(emf_faraday)} V."
        )
    fingers = (
        f"Fleming's right-hand rule: thumb {motion} (motion), first finger {field} (field), "
        f"second finger {current_way} (induced conventional current)."
    )
    if zero_reason == "open":
        return (
            f"{fingers} {formula} The circuit is open, so charge separates and no current flows. "
            "Close the circuit and the current is I = ε/R."
        )
    return (
        f"{fingers} {formula} The circuit is closed and R = {_format(req.R, 2)} Ω, "
        f"so I = ε/R = {_format(current)} A. Lenz's law: the magnetic force on this current "
        "opposes the motion of the bar."
    )


def evaluate(req: EvaluateRequest) -> EvaluateResponse:
    emf = _dot(_cross(req.v, req.B), req.ell)
    current = emf / req.R if req.closed and req.R > 1e-9 else 0.0
    phi = -req.B[1] * req.ell[2] * (req.x + 0.5 * req.ell[0])
    dphi_dt = -req.B[1] * req.v[0] * req.ell[2]
    emf_faraday = -dphi_dt
    lenz = (
        current * (-req.ell[2] * req.B[1]),
        current * (req.ell[2] * req.B[0] - req.ell[0] * req.B[2]),
        current * (req.ell[0] * req.B[1]),
    )
    b_mag = _hypot(req.B)
    v_mag = _hypot(req.v)
    zero_reason: ZeroReason = "ok"
    if b_mag < EPS_B:
        zero_reason = "b_zero"
    elif v_mag < EPS_V:
        zero_reason = "v_zero"
    elif abs(emf) < EPS_EMF:
        zero_reason = "no_cutting"
    elif not req.closed:
        zero_reason = "open"

    ell_mag = _hypot(req.ell)
    if abs(emf) < EPS_EMF or ell_mag < 1e-12:
        direction = (0.0, 0.0, 0.0)
    else:
        sign = 1.0 if emf > 0 else -1.0
        direction = (sign * req.ell[0] / ell_mag, sign * req.ell[1] / ell_mag, sign * req.ell[2] / ell_mag)

    return EvaluateResponse(
        emf=emf,
        current=current,
        phi=phi,
        dphiDt=dphi_dt,
        emfFaraday=emf_faraday,
        lenzForce=lenz,
        zeroReason=zero_reason,
        currentDirection=direction,
        explanation=_explain(req, emf, current, emf_faraday, zero_reason),
    )
