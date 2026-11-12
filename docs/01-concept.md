# Sidekick — Concept

> A palm-sized display that lets you read, reply, call, and orient yourself while your phone stays put — and that structurally cannot become another place to scroll.

| | |
|---|---|
| **Status** | Concept, v1.0 |
| **Date** | 2026-11-10 |
| **Working name** | Sidekick (placeholder) |
| **Horizon** | v1 hardware + software, with v1.5 and v2 direction |
| **Companion documents** | `02-product-brief.md`, `03-prd.md` |

---

## 1. The problem

The phone is no longer a device. It is the default interface to everything — messages, money, maps, music, identity, work. That is why "use your phone less" fails as advice: the advice asks you to give up access, not to give up a habit.

The behaviour we actually want to change is narrower and more mechanical than "phone addiction." It is this:

**You put the phone down, and ninety seconds later you pick it up again.**

Not to do anything. To check. The phone was on the desk, the notification arrived, and the only way to find out whether it mattered was to pick up the entire internet and hold it to your face. By the time you put it down, twenty minutes are gone and you cannot name what you read.

Every existing solution attacks the wrong end of that sequence:

- **Blocking apps** ask you to resist at the moment of temptation, with the temptation in your hand.
- **Screen-time dashboards** report the damage after it happens.
- **Phone lockboxes** work, but they work by removing your phone — so you miss the call from your kid's school.
- **Smartwatches** get the notification onto your wrist, which is genuinely good, and then cap out at a 1.4" screen where a real conversation cannot be read.

Nobody has built the thing that sits between the watch and the phone: something you can read a thread on, reply from, and then put down.

---

## 2. Three insights

**Distance beats discipline.**
Willpower is a terrible interface. The only intervention that survives a busy Tuesday is one that removes the decision entirely. If answering a message does not require holding the phone, most people will not hold the phone. The product does not need to persuade anyone to change; it needs to make the convenient path the restrained one.

**Consumption is the addiction. Creation is not.**
Scrolling, feeds, autoplay, and video are open loops with no natural end. Replying to a message is a closed loop — it has a beginning, a reply, and a finish. A device that can *compose* but cannot *consume* is not a phone in miniature; it is a different category of object. This distinction is the entire firewall, and it is why a keyboard is allowed while a browser is not.

**The interface should be smaller than the task, not the task smaller than the interface.**
We normally shrink a task until it fits a small screen, and the result feels like a compromise. The alternative is to choose tasks that *want* to be small: a thread, a reply, a turn, a page. Pick those, and a 4" panel stops being a limitation and becomes the correct size.

---

## 3. What it is, and what it is not

**It is** a tethered companion: a thin card, carried on a lanyard or in a pocket, that talks to your Android phone over Bluetooth and Wi-Fi and gives you a deliberate, bounded set of surfaces — notifications, threads and replies, call control, media, a navigation card, orientation, and reading.

**It is not:**

- a small phone, or a phone replacement;
- a second screen for the internet;
- a place to watch anything;
- a wearable that wants to be looked at;
- an AI assistant with a screen bolted on.

The device has no cellular radio, no camera, no browser, no app store, and no audio path of its own. Those absences are the product.

---

## 4. Principles

1. **The phone stays in your pocket, not in your hand.** The success condition is that the phone is *untouched*, not absent.
2. **Output in motion; input at rest.** In the car, or walking, the device only speaks — it never asks for a touch. Input happens when you have stopped.
3. **Brief, frequent, bounded.** Median session under 45 seconds. A good day is twelve short visits, not one long one.
4. **Refusal is a feature.** The list of things it cannot do is a specification, not a marketing line.
5. **The firewall lives in the build, not in a settings menu.** If a capability can be switched on by a user, it will be. Constraints are baked into firmware and silicon, not offered as a toggle.
6. **The device has a place to live.** A companion that lives in a bag becomes a dead battery. The lanyard is the home; the magnet array is the second home.
7. **No subscription.** A product that sells attention reduction and then charges monthly for engagement is structurally compromised. Hardware revenue only.

---

## 5. Contexts

| Context | What it is | Why it matters | Horizon |
|---|---|---|---|
| **Roam** (hero) | Phone docked on a desk, counter, or charger. You carry the card to another room. | This is where the ninety-second window happens, and the only context where BLE range, thin hardware, and week-long battery all agree. | v1 |
| **Car** | Phone navigates in a cradle or pocket; the card shows one glanceable navigation card. | Output-only by design. A map on a 4" screen at arm's length is a hazard, not a feature. | v1 |
| **Desk** | Same hardware, sitting on the magnet stand next to the workstation. | Functionally the same as Roam; the difference is posture, not capability. | v1 |
| **Reading** | A shared article, paginated, read in one hand. | The one task where a 4" panel is genuinely pleasant and a wrist is genuinely not. | v1 (articles), v1.5 (books) |

Bedside is deliberately excluded from v1. Reading in bed is the highest-value use case for e-paper and the lowest-value use case for a backlit LCD, and shipping both display technologies at once is how first hardware products die.

---

## 6. The vision

The original brief asked for nine things. They are not equally good ideas, and they do not all belong in the same release. This is the honest horizon for each.

| # | Capability | Horizon | Maturity looks like | What stays refused |
|---|---|---|---|---|
| 1 | Notification triage | **v1** | Grouped by sender, batched, dismissable, no growing badges | Per-app unread counts, badges, "inbox zero" mechanics |
| 2 | Messaging + reply | **v1** | Read a thread with context, tap a drafted reply, keyboard only as fallback | Attachments, media, group administration |
| 3 | Calls | **v1** | Answer, decline, mute; audio through your earbuds | Speakerphone, video, voicemail browsing |
| 4 | Media control | **v1** | Play/pause/skip/volume and now-playing | Library browsing, recommendations, autoplay |
| 5 | Navigation | **v1** | Next turn, distance, ETA — one card, glanceable, no touch | Map tiles, route editing, place search |
| 6 | Orientation | **v1** | Time, date, next meeting, weather | Calendar editing, agenda planning |
| 7 | Reading | **v1** articles / **v1.5** books | Shared articles paginated and typeset; later, a managed book queue | In-device discovery, links, web rendering |
| 8 | Quick search / answers | **v1.5** | Ask a question, get a short answer, no results page to browse | Any browsing, any list of links, any "related" surface |
| 9 | Reverse / wireless charging | **v2** | Charge from a phone or a magnetic puck | — |

Note what happened to #8. "Quick search" is the most dangerous item on the original list, because a search box is a slot machine: it always returns more than you asked for. When it ships, it ships as an **answer**, single-screen, with no results list and no "see more." If that proves impossible to hold, it does not ship at all.

---

## 7. The refusal list

This is the most important table in the document set. Every item is enforceable and testable in `03-prd.md`.

### Never

| Refused | Reason |
|---|---|
| Web browser / rendering engine | A browser is the phone. There is no partial browser. |
| Social feeds, aggregators, "for you" surfaces | The core behaviour being displaced. |
| Video playback of any kind | An open loop with no natural end, and the fastest way to ruin the battery budget. |
| App store or third-party installation | Every installable platform eventually becomes the phone. Fixed firmware is the firewall. |
| Infinite scroll, autoplay, pull-to-refresh | Mechanical loop generators. Lists paginate; nothing continues without an explicit act. |
| Recommendation engines of any kind | The device should never suggest what to consume next. |
| A subscription | Structurally incompatible with the promise. |

### Deliberately constrained

| Constraint | Mechanism |
|---|---|
| Notification delivery is batched by sender | A 20-second coalescing window prevents the device from becoming a slot machine |
| Reading is text-only, pushed from the phone | No links, no images, no in-device discovery |
| Sessions are bounded | After five minutes of continuous triage, a full-screen interruption offers "done" or "back to phone"; reading is exempt to ten minutes, then asks the same question |
| No notifications while the device is face-down or in a pocket | Ambient light and accelerometer gate delivery |

---

## 8. Form and interaction

**A card, not a watch.** A watch is glanceable and unwearable for reading. A card is readable in one hand and can be put down. The 4.0" 16:9 panel gives roughly 540 × 960 pixels — enough for a six-message thread or a page of typeset text, and not enough bodies for a feed to hide in.

**Polycarbonate, not glass and aluminium.** Roughly 100 × 62 × 8.5 mm at ~85 g. Injection-moulded shell with a hard-coated PMMA window. Glass and metal would look better and cost twice as much, weigh half again as much, and make the device feel like something to be protected rather than carried.

**A lanyard loop, moulded in.** The loop is the answer to the question every accessory fails: where does it live? Neck-carried reads as a badge or a tool rather than a watch, which is a different and much less hostile social signal. Pocket-carry remains the default in marketing; the loop is the option that makes the device always-available.

**A magnet array, for attachment only.** Roughly fifty cents of BOM, doing three jobs: it lets the card sit on a stand, stick to a car mount, and snap to a fridge or a metal desk edge. Charging is USB-C in v1; wireless charging is a v2 hypothesis and is not in the enclosure design.

**No audio path.** No microphone, no speaker, no amplifier. Audio goes to earbuds that pair with the *phone*, not with the device. This removes acoustic design, saves roughly 3 mm³ of every dimension, cuts the BOM, and produces two consequences that are improvements:
- calls become a control surface (answer, decline, mute) rather than a phone;
- voice input does not exist, so nothing on this device is ever a conversation with a microphone in the room.

**Haptics instead of sound.** A linear actuator carries every confirmation, alert, and boundary event. A device that can only speak through touch is a device you check and put down.

**LCD, not e-paper.** E-paper would double the reading experience and halve the usefulness everywhere else — no navigation card in sunlight refresh, no motion-smooth UI, a different supply chain, and a different interaction model. v1 is LCD. A reflective reading variant is a credible v2 product, and it should be a *second* product rather than a compromise on the first.

---

## 9. Where it sits in the world

| Comparable | What it got right | Where Sidekick differs |
|---|---|---|
| **Smartwatch (Wear OS, Apple Watch)** | Always with you, zero-friction notifications, solved supply chain | A 1.4" screen cannot hold a thread. The watch answers "who pinged me"; this answers "what did they say, and what do I say back" |
| **Pebble** | Proved people want a notification relay and nothing more | Pebble was glance-only by hardware. This is read-and-reply by design |
| **Light Phone / Punkt** | Proved subtraction is a viable product and a real market | They replace the phone, so you lose calls and messages. This complements it, so you lose nothing but the feed |
| **Palm Phone / AI pins (Rabbit, Humane)** | Proved the demand exists | All of them tried to be a phone, or a phone-plus-assistant. All of them shipped a consumption surface eventually |
| **Phone lockbox** | Cheapest possible distance | Distance without access. You miss the school call |

The position nobody occupies: **a companion that is better at the three things a watch is bad at, and deliberately worse at everything else.**

---

## 10. What has to be true

This concept only works if four assumptions hold. They are the things to test before committing tooling.

1. **The ninety-second window is real and repeated.** People reach for the phone dozens of times a day for reasons that a 4" card could serve. If real usage is dominated by feed-scrolling rather than triage, this product has no job.
2. **Reading a thread is meaningfully better on a card than a wrist.** If it is not, the product is a $149 smartwatch without a strap and the thesis collapses.
3. **A tethered device feels reliable enough to trust.** BLE reconnection, OEM background-killing, and a companion app that survives a week of not being opened are the failure modes that will kill it in reviews.
4. **People will pay $149 for distance.** The value is a behaviour change, not a specification. That is a harder sale than a screen, and it needs a demo that changes how someone feels in thirty seconds.

---

## 11. Corrections to the original brief

Recorded deliberately, because the brief and the product should not quietly disagree.

| Original brief | Correction | Why |
|---|---|---|
| "Very small and thin, palm-sized" | 100 × 62 × 8.5 mm, ~85 g | Thin and palm-sized and *readable* are a triangle; 4" is the smallest panel that holds a thread |
| "Pairs with my phone" (implicitly any phone) | Android only | iOS exposes no third-party path to messages, calls, or search outside the EU, and even there it is reply-only |
| "Take calls" | Call *control*; audio via earbuds | No mic or speaker in the chosen hardware |
| "Quick search" | v1.5, answers only, no results | A search box is a slot machine |
| "Use as a navigation device" | Navigation *card*, no map | Android exposes turn state, not map tiles; a map here is a hazard |
| "Read books or articles" | Articles v1, books v1.5 | Books want e-paper; articles work on LCD |
| "Charged through reverse charging or mag charge" | USB-C in v1, magnets for attachment only | Reverse charging needs a face-down phone and ~5 W; it is a v2 hypothesis |
| "Acts like a remote control to minimise phone usage" | Tethered within a room or building | Location independence requires a cellular radio, which makes this a phone |

---

## 12. Naming

"Sidekick" is a working name. It is descriptive, unclaimed in this category, and slightly generic — which is fine for a concept and a liability for a brand. Candidate territory when the product firms up: words about restraint, edges, bearings, quiet instruments. Avoid anything with *ai*, *smart*, *pal*, or a missing vowel.

---

*This document describes intent. Buildable requirements, acceptance criteria, and the release gate live in `03-prd.md`. Positioning, pricing, and roadmap live in `02-product-brief.md`.*
