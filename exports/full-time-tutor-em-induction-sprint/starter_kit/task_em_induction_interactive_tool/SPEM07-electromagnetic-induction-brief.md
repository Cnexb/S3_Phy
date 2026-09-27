# SPEM07 Electromagnetic induction 電磁感應

Hong Kong DSE Physics. Teach this with an interactive tool. Do not teach the force on a current-carrying wire (Fleming’s left-hand rule). That is a different topic.

## What a student must be able to do

1. Find the magnetic flux through a coil, and the flux linkage.
2. Find the magnitude of an induced emf when the flux changes.
3. Use Lenz’s law to decide the direction, and say why.

## Magnetic flux 磁通量

For a flat coil of area A in a uniform field B:

Φ = BA cos θ

- B is the magnetic field strength, in tesla (T).
- A is the area of one turn, in m².
- θ is the angle between the field and the **normal** to the coil (the line sticking straight out of the face). θ = 0° means the field goes straight through the coil. θ = 90° means the field slides across the face and the flux is zero.
- Φ is in weber (Wb). 1 Wb = 1 T m².

Flux linkage for N turns is NΦ.

A student who says “bigger angle always means more flux” is wrong. From 0° to 90°, cos θ falls, so the flux falls.

## Faraday’s law 法拉第定律

An emf is induced when the flux linkage changes:

ε = − d(NΦ) / dt

For a quick estimate with a steady change:

|ε| = N |ΔΦ| / Δt

- The minus sign is Lenz’s law. It is about direction, not about the size.
- Same change of flux in less time means a larger emf.
- More turns means a larger emf, for the same change in one turn.

## Lenz’s law 楞次定律

The induced current opposes the **change** that produces it.

- A north pole pushed toward a coil is opposed: the near face of the coil becomes a north pole, so it repels the approaching magnet.
- That same north pole pulled away is also opposed: the near face becomes a south pole, so it attracts the leaving magnet.
- The direction flips when the motion flips. The size of the emf depends on how fast the flux changes, not on which pole it is.

A student who says “the coil always attracts the magnet” is wrong. It opposes the change, so it sometimes repels and sometimes attracts.

## Clean numbers worth using

| Situation | Result |
| --- | --- |
| B = 0.40 T, A = 0.020 m², θ = 0° | Φ = 0.0080 Wb |
| Same coil, θ = 60° | Φ = 0.0040 Wb |
| N = 200, Φ falls from 0.0080 Wb to 0 in 0.050 s | \|ε\| = 32 V |
| Same change in 0.10 s | \|ε\| = 16 V |

## What the tool should do

The student changes at least two quantities, predicts before seeing the result, and is told whether they are right and why. Include a worked example and a fresh question. One HTML file. No external libraries.
