# Sidekick — industrial design concept 01

> A tactile companion card, designed as an instrument rather than a glass slab.

This folder contains a 1:1 Blender model, the four concept renders, and the
script that builds them. Nothing here changes the product thesis in
`../docs/`; it is a physical design direction for the same 4.0" companion.

---

## 1. The design problem

The brief says *card*, and the spec says *4.0" display in 101 × 63 × 9 mm*. Put
those together carelessly and you get a small phone: almost all front surface,
almost no physical controls, and the exact object the product is trying to
distance itself from.

The concept takes the opposite route. The screen keeps its 4.0" panel, but the
body is built as a **two-part instrument**:

- a warm bone polycarbonate shell that is carried, not protected;
- a matte charcoal faceplate that reads as a panel, not a window;
- exposed fasteners, a knurled scroll wheel, a physical focus switch, and a
  three-key chin;
- one saturated orange action key that maps directly to the orange reply chip
  on screen.

The result is still a card, but it has a *front*, a *back*, *edges*, and
*things to press*. That is the difference between a device you check and a
device you put down.

---

## 2. Teenage Engineering, translated — not copied

| TE cue | How it appears here | Why it belongs |
|---|---|---|
| Instrument, not appliance | Exposed Torx screws, a labelled faceplate, a machined wheel | Makes the object feel serviceable and owned |
| Honest materials | Bone PC + charcoal PC + anodised aluminium wheel + steel fasteners | No fake chrome, no glass sandwich |
| One loud colour | TE orange on the send key, reply chip, focus switch and wheel ring | A single action colour, used consistently |
| Physical controls with a job | Scroll wheel, focus slider, three chin keys, side volume/power | Every control maps to a real, bounded task |
| Technical silkscreen | `SIDEKICK`, `FOCUS`, `BACK`, `HOME`, serial line, refusal list | Small type is part of the object's language |
| Tactile asymmetry | Lanyard loop at one corner, wheel on one edge, red power key | Prevents the "sealed rectangle" read |

The goal is not a pastiche of an OP-1. It is the same design values applied to
a different job: **few controls, obvious materials, and no surface that invites
aimless scrolling.**

---

## 3. The physical control map

| Control | Where | What it does |
|---|---|---|
| Knurled scroll wheel | Right edge (viewer's left in the render) | Moves through a thread or a page, one detent at a time |
| Orange action key | Chin, right | Sends the highlighted reply / confirms |
| `BACK` / `HOME` | Chin, left | Bounded navigation; no gesture labyrinth |
| `VOL + / VOL −` | Left edge | Volume passthrough for earbuds paired to the phone |
| Power (red) | Left edge | Wake / sleep / pair |
| FOCUS switch | Top edge | Hardware focus state; the tactile version of the refusal list |
| Lanyard loop | Top-left | The device's home, moulded into the shell |
| Magnet ring | Back, six positions | Stand, car mount, fridge; attachment only |

The **FOCUS switch** is the concept's best idea and its clearest departure from
the current PRD. Today the firewall is firmware. A two-position physical switch
makes it a thing you can feel: *focus* batches notifications and dims the
surface; *open* restores the normal triage set. It cannot enable a browser. It
only makes the existing restraint tangible.

---

## 4. What is deliberately absent

- **No speaker grille.** The product has no audio path; the back has a magnet
  ring, not decorative perforations.
- **No camera island, no logo badge, no chrome.** The only bright metal is the
  wheel and the screws, where it does structural work.
- **No edge-to-edge glass.** The screen sits 0.8 mm into a charcoal bezel, under
  a hard-coated PMMA window. The bezel is the thing your thumb finds first.
- **No on-screen chrome that could become a feed.** The UI is a thread, two
  draft replies, a session timer, and a key map. No badges, no counts, no
  "related".

---

## 5. Specification fit

| Item | Concept | PRD |
|---|---|---|
| Envelope | 101 × 63 × 9.0 mm body; keys stand 1.55 mm proud, wheel 0.8 mm | HWR-01: ≤ 101 × 63 × 9.0 mm |
| Display | 4.0" portrait, 49.2 × 87.5 mm active area | HWR-03: 4.0" IPS, 540 × 960 |
| Weight target | 85 g | HWR-02: ≤ 90 g |
| Shell | Polycarbonate, two-part, moulded lanyard loop | HWR-11, HWR-17 |
| Window | Hard-coated PMMA, recessed | HWR-17 |
| Charging | USB-C, bottom edge | HWR-09 |
| Attach | Six-magnet ring, back | HWR-10 |
| Radios / sensors | BLE 5.3, Wi-Fi 6 2.4 GHz, accel, ALS | HWR-06/07/13/14 |
| Audio | None | HWR-15 |
| Buttons | Power, vol +/− on the left edge; three chin action keys | HWR-16 asks for three physical buttons; the chin keys are an **added** tactile layer |

These are body dimensions. On a tactile object the controls have to stand proud
of the shell: the chin keys add 1.55 mm to the front, the wheel adds 0.8 mm to
the width, and the lanyard loop adds 6 mm to the top. The wheel is an 8 mm
thumbwheel recessed into the 9 mm edge, so it no longer breaks the front or back
profile. If HWR-01 is measured as a bounding box, the chin keys drop to 0.9 mm
travel and the loop becomes a flush slot.

**The honest deviation:** the PRD's HWR-16 specifies three physical buttons
(power, volume up/down). This concept adds three chin keys and a focus switch.
If the BOM or the industrial-design gate rejects the extra keys, remove
`BACK`/`HOME` and keep the orange send key: the screen already has touch, and
the object still reads as tactile. The focus switch is the part worth fighting
for.

---

## 6. Material and colour spec (as rendered)

| Part | Colour | Finish |
|---|---|---|
| Shell | warm bone `#D6D0C1` | Matte PC, fine orange-peel, 0.05 coat |
| Faceplate | charcoal `#1D1E1B` | Soft-touch PC, very low sheen |
| Keycaps | cream `#EEE9DC` | Satin PC, 0.46 mm top bevel |
| Action key / switch | TE orange `#FF3D02` | Satin, single accent colour |
| Power key | safety red `#C02F18` | Satin |
| Scroll wheel | anodised aluminium `#BEBEB8` | 8 mm, 30-tooth knurl, 0.8 mm proud, orange index ring |
| Fasteners | steel | Torx / hex socket, exposed |
| Window | matte black | Recessed 0.8 mm, hard-coated PMMA (rendered anti-glare) |
| Silkscreen | warm grey | Technical mono, 1.2–2.4 mm |

The orange is deliberately the *only* high-chroma surface on the front. It
marks the one action that leaves the device: send.

---

## 7. Colourways

The palette system is four material stories over the same geometry:

| Name | Shell | Faceplate | Accent | Character |
|---|---|---|---|---|
| **Studio** | warm bone `#D6D0C1` | charcoal `#1D1E1B` | TE orange `#FF3D02` | The reference object: warm, tool-like |
| **Night** | warm graphite `#4A4A44` | near-black `#121311` | signal orange `#FF5A1F` | Stealth, low-light, orange only where it matters |
| **Field** | cool silver `#C6C9C4` | charcoal `#2A2B29` | mint `#3FB98F` | Instrument-panel clean; the accent reads as a status colour |
| **Clay** | warm sand `#C8B69E` | umber `#2B2420` | tomato `#E0472B` | A 1970s calculator that happens to be a companion |

The accent is not only a cap colour: it drives the physical send key, focus
slider, wheel ring, the screen's active-thread rule, the FOCUS indicator and the
reply chip. A colourway is therefore a coherent system, not a recoloured shell.
The power key stays safety red in every palette.

---

## 8. Renders

| File | Use |
|---|---|
| `renders/sidekick_hero.png` | 3/4 hero for a deck, landing page, or investor one-pager |
| `renders/sidekick_front.png` | Front elevation; reads the complete UI and chin |
| `renders/sidekick_back.png` | Back; magnets, refusal list, serial, lanyard loop |
| `renders/sidekick_detail.png` | Macro; wheel knurl, orange ring, key travel, screw heads |
| `renders/sidekick_sheet.png` | Contact sheet with the concept statement (`python make_sheet.py`) |
| `renders/sidekick_hero_night.png` | Night colourway hero |
| `renders/sidekick_hero_field.png` | Field colourway hero |
| `renders/sidekick_hero_clay.png` | Clay colourway hero |
| `renders/sidekick_colourways.png` | Four-up colourway board (`python make_colourways.py`) |

The renders are Cycles, 1:1 geometry, studio cyclorama, no image textures, no
AI-generated assets. The model is procedural so dimensions, materials, and
camera angles can be changed in one place.

---

## 9. What I would test next

1. **Thumb reach.** The wheel and the orange key are on opposite sides in the
   render's view. Confirm one-handed reach with 20 right- and left-handed users.
2. **Wheel detents.** The 8 mm / 30-tooth knurl is a visual guess. Test 24 vs
   30 vs 40 detents, and 0.5 vs 0.8 mm proud, for thumb feel and dust ingress.
3. **Chin key travel.** 1.55 mm proud is a lot on a 9 mm card. Test 0.8, 1.2,
   1.55 mm and the click force.
4. **Focus switch detent.** It has to be impossible to nudge in a bag, and
   obvious by touch in a pocket.
5. **Lanyard pull.** The loop is moulded into the shell; test 15 N and a 1 m
   drop with the lanyard attached.
6. **Matte screen legibility.** The render trades the PMMA reflection for
   readability. Test the actual window under a window and a desk lamp.

---

## 10. Rebuilding

```bash
# one preview (EEVEE, fast)
blender -b --python build_sidekick.py -- --preview

# one preview in Cycles
blender -b --python build_sidekick.py -- --preview --slow

# final frames
blender -b --python build_sidekick.py -- --shot=hero --shot=front --shot=back --shot=detail

# everything (Studio)
blender -b --python build_sidekick.py -- --all

# colourway heroes
blender -b --python build_sidekick.py -- --shot=hero --palette=night
blender -b --python build_sidekick.py -- --shot=hero --palette=field
blender -b --python build_sidekick.py -- --shot=hero --palette=clay

# boards
python make_sheet.py
python make_colourways.py
```

All dimensions live at the top of `build_sidekick.py`. The studio, camera
shots, and material palette are in the same file. `sidekick.blend` is saved
after each run.

---

*Concept 01, 2026-11-10. The product name is a placeholder; the design
direction is not.*
