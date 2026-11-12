# Sidekick — Product Brief

| | |
|---|---|
| **Status** | Draft v1.0 |
| **Date** | 2026-11-10 |
| **Working name** | Sidekick |
| **Stage** | Pre-prototype. No tooling committed. |
| **Companion documents** | `01-concept.md` (intent), `03-prd.md` (buildable requirements) |

---

## 1. Executive summary

Sidekick is a $149 palm-sized companion display for Android phones. It lets you read a thread, reply to it, control a call, skip a track, see your next turn, and read an article — while your phone stays in your pocket.

It is not a phone, a tablet, or a smartwatch. It has no browser, no app store, no video, no feed, no cellular radio, and no microphone. Those absences are enforced in firmware and processor choice rather than offered as settings, which is the difference between a product and a promise.

The bet is that a meaningful number of people do not want to use their phone less in general — they want to stop *reaching* for it ninety seconds after putting it down. A tethered card is the cheapest, thinnest, most reliable way to serve that moment.

**What makes this fundable rather than another AI pin:** the target BOM is $38–56, there is no subscription, and the product's core claim is a behaviour change that can be measured in a four-week trial with thirty users. The failure mode is not technical. It is that the product is nice but not necessary, and that is what the pilot is designed to detect before tooling.

---

## 2. Opportunity

Three things changed recently, and only one of them is a technology change.

**1. The platform opened, narrowly.** Android's `CompanionDeviceManager` and notification APIs have supported third-party companion devices with inline reply for years. Apple opened an equivalent door in iOS 26.5 with `AccessoryNotifications` — but EU-only, reply-only, under DMA licence terms that forbid using the data for anything else. The practical consequence: **this is an Android product**, and the iOS question is a v2 European experiment, not a launch dependency.

**2. The wellbeing market matured into a buying market.** Light Phone, Punkt, and a long tail of dumbphone and lockbox products have done the education work. People now accept that paying money to use a phone less is a reasonable transaction. What they do not accept is losing access — which is exactly the gap this product fills.

**3. AI pins failed in a way that clarified the category.** Rabbit and Humane did not fail because the hardware was impossible. They failed because they were vague about what they were for, they shipped a consumption surface, and they charged a subscription. Every one of those is an avoidable mistake, and the market now has a shared vocabulary for why.

---

## 3. Target user

### Primary — "the self-aware heavy user"

28–42, knowledge worker, urban or suburban. Knows their screen time is a problem, has already installed a screen-time app and defeated it. Owns an e-reader they like. Has considered a Light Phone and rejected it because they need Slack, maps, and their kid's school.

**Job to be done:** "Let me handle the thing that just pinged me without picking up the internet."

**What they will pay for:** not features. Distance, and the feeling of not being owned by a rectangle. $149 is an easy yes if the first week feels different.

**What loses them:** a device that needs charging daily, a device with a feed, or a device that disconnects and makes them miss something.

### Secondary — "the deep-work professional"

Founder, engineer, writer, designer. Already puts the phone in a drawer or another room during focus blocks and feels the cost: they miss messages, so they check "just in case," which defeats the point.

**Job to be done:** "Keep me reachable without putting the phone on my desk."

**What they will pay for:** reliability and latency. This buyer will tolerate a worse screen and will not tolerate a dropped connection.

### Tertiary — "the parent who wants to be reachable"

Wants to be contactable by family and school, does not want a feed in their pocket, is not ideologically anti-phone. Least likely to buy a new category, most likely to be delighted if gifted one.

**Explicitly not the target:** enterprise fleets, developers wanting a hackable display, AI early adopters, and anyone shopping for a cheap second screen. Each of these would pull the product toward becoming a platform, which is the one outcome the design forbids.

---

## 4. Positioning

> **For people who have already decided their phone is a problem and are not willing to become unreachable: Sidekick is a palm-sized companion that handles messages, calls, music, navigation and reading while your phone stays in your pocket. Unlike a smartwatch, it is big enough to read a conversation. Unlike a minimalist phone, it does not take your phone away.**

**Category:** companion display. Not "wearable," not "AI device," not "second screen."

**The one-line pitch:** the phone stays in your pocket, not in your hand.

**The anti-pitch**, used deliberately in marketing because it builds trust: it cannot browse, it cannot play video, it has no app store, and it will not get one.

---

## 5. Competitive landscape

| Competitor | Price | Strength | Weakness vs. Sidekick |
|---|---|---|---|
| Apple Watch / Wear OS watches | $99–449 | Always on you, mature, trusted | 1.4" screen cannot hold a thread; needs nightly charging; strong social signal |
| Light Phone III | ~$400–800 | Total subtraction, strong brand | Replaces the phone; you lose Slack, maps, banking |
| Punkt MP02 | ~$350 | Beautiful, durable, principled | Same as above, plus a worse keyboard than a phone |
| Phone lockbox | $20–60 | Cheapest possible distance | No access at all; you miss real calls |
| Screen-time apps | $0–60/yr | Zero hardware | Asks you to resist with the temptation in hand |
| Rabbit / Humane | $199–699 | Proof of demand, strong narrative | Subscription, vague purpose, shipped consumption surfaces, discontinued hardware |
| Used small Android phone | $80–150 | Every app works | It is a phone. The thesis dies on contact |

**The defensible position:** the only product that is *better than a watch at reading* and *better than a minimalist phone at staying reachable*. Everything else is either too small, too total, or too much.

**Where there is no moat:** the hardware is not defensible. A competent ODM could clone this in nine months. The moat, such as it is, is the refusal list, the software discipline to keep it, and the brand permission to sell restraint.

---

## 6. Product shape

| | |
|---|---|
| Form | 100 × 62 × 8.5 mm card, ~85 g, polycarbonate, PMMA window |
| Display | 4.0" IPS LCD, 540 × 960, no always-on |
| Compute | ESP32-P4 (dual RISC-V, 16 MB PSRAM, MIPI-DSI) + ESP32-C6 (Wi-Fi 6 2.4 GHz, BLE 5.3) |
| Battery | ~1,200 mAh, USB-C 10 W, 7–10 days at target usage |
| Audio | None. Earbuds pair with the phone. |
| Output | Haptic actuator, single cell |
| Attach | Magnet array (mounting and attachment only), moulded lanyard loop |
| Radios | BLE 5.3, Wi-Fi 6 (2.4 GHz). No cellular, GPS, or camera. |
| Platform | Android companion app required. iOS out of scope for v1. |

Rationale for each choice is in `01-concept.md` §8 and `03-prd.md` §6.

---

## 7. Pricing hypothesis

Pricing is deliberately unresolved. What follows is a model, not a decision.

### Estimated BOM at 5k units

| Line | Low | High |
|---|---|---|
| 4.0" LCD + touch panel + PMMA window | $10 | $14 |
| ESP32-P4 + C6 + PSRAM + flash | $6 | $9 |
| PCB, passives, connectors, assembly | $4 | $6 |
| 1,200 mAh cell + PMIC + USB-C | $5 | $8 |
| Haptics, accelerometer, ambient light | $2 | $3 |
| Enclosure, magnets, lanyard hardware | $5 | $7 |
| Test, packaging, freight, yield | $6 | $9 |
| **Total** | **$38** | **$56** |

### Retail sensitivity

Assumes direct-to-consumer, ~10% payment and platform fees, ~4% fulfilment, ~6% return and warranty reserve.

| Retail | Realised | COGS (mid, $47) | Gross profit | Gross margin |
|---|---|---|---|---|
| $129 | $103 | $47 | $56 | 54% |
| **$149** | **$119** | **$47** | **$72** | **60%** |
| $179 | $143 | $47 | $96 | 67% |
| $199 | $159 | $47 | $112 | 70% |

### Break-even

Estimated one-time cost to first production: **$600k–1.1M**, dominated by firmware (the rebuilt-UI approach is the expensive part), industrial design, tooling, and certification (FCC, CE, UKCA, RoHS, UN38.3 for the battery).

At $149 with ~$72 gross profit, that is **8,300–15,000 units** to recover development cost, before any team salary. This is a viable small-batch product and not a venture-scale business without either a higher price or a second SKU.

**Recommendation when forced to choose: $149 as the launch price**, with the stand sold separately at $19–29 as the first margin expansion. $199 is defensible only if the reading experience is excellent, which v1 will not know until pilot data exists.

---

## 8. Business model

- **Hardware margin only.** One SKU at launch. No subscription, ever, because a recurring fee for attention reduction creates a structural incentive to increase engagement.
- **Accessories from v1.5.** Desk stand with magnet alignment ($19–29), car mount ($29–39), spare lanyard. Low BOM, high margin, and they solve the "where does it live" problem that kills wearables.
- **No app revenue.** No store, no in-app purchases, no partner placements. This is also a firewall requirement, not only a business choice.
- **Repairability as brand.** User-replaceable battery and a published tear-down. It supports the values story and partially offsets the lack of a subscription.

---

## 9. Roadmap

| Phase | Timing | Contains | Gate to proceed |
|---|---|---|---|
| **v1 — Core** | Months 0–12 | Roam, car card, desk, articles. Notifications, threads + replies, call control, media, nav card, orientation. No accessories. | 30-user, 4-week pilot: phone unlocks down ≥20%, companion use ≤30 min/day, D30 retention ≥40%, zero missed-call complaints |
| **v1.5 — Ecosystem** | Months 12–18 | Desk stand and car mount, generative reply drafts, book queue, offline article library | Accessory attach rate ≥25%; draft acceptance rate ≥40% |
| **v2 — Reach** | Months 18–30 | One of: reflective reading variant, wireless/reverse charging, or cellular. **Only one.** | Chosen by which pilot metric is weakest, not by enthusiasm |
| **v2 — Europe (conditional)** | Months 18+ | iOS companion app using `AccessoryNotifications`, EU only, reply-only | Only if EU demand exceeds 20% of waitlist |

**Deliberately absent from the roadmap:** a browser, a store, video, home automation, health tracking, and a general AI assistant. Adding any of them is a different product and should require a new concept document.

---

## 10. Go-to-market

**Phase 0 — Proof (now).** Build 5–8 hand-built units with off-the-shelf dev boards in a 3D-printed shell. Give them to people who already use screen-time apps. The only output that matters is whether the phone stays down.

**Phase 1 — Seed (pre-launch).** 200–500 units. Channels, in order of expected efficiency:

1. **Community-led, not paid.** Digital-minimalism communities, r/dumbphones, Hacker News, small newsletters. This audience is sceptical, technically literate, and will punish a dishonest spec sheet.
2. **Long-form video reviews.** One credible reviewer who uses it for 30 days is worth more than any ad spend at this scale.
3. **The pilot data as marketing.** Publishing "our users' phone unlocks dropped 34% and their time on our device stayed under 20 minutes a day" is the single most differentiated claim available, and no competitor can make it without admitting their own engagement metrics.

**Explicitly not doing:** paid social, influencer seeding at scale, retail, enterprise sales, and crowdfunding. Crowdfunding in particular invites a spec that the refusal list cannot survive.

---

## 11. Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | **It is nice but not necessary.** Users like it, do not change behaviour, do not recommend it. | Critical | The 30-user pilot exists to kill this before tooling. Measure unlocks, not satisfaction. |
| R2 | **A $99 watch does the comms half.** | High | Compete on reading and thread context, which a 1.4" screen physically cannot do. Never compete on notification count. |
| R3 | **OEM background-killing breaks the link.** Xiaomi, Samsung, OnePlus, Oppo all murder companion services. | High | `CompanionDeviceManager` association, foreground service, per-OEM onboarding guide, and a "connection lost" state that is honest rather than silent. |
| R4 | **iOS is half the market and closed.** | Medium | Accepted. Android-only positioning; EU iOS as a conditional v2. |
| R5 | **Scope creep into a platform.** Every reviewer will ask for a browser or a store. | High | Refusal list as a published commitment. No third-party installs at the firmware level. |
| R6 | **The lanyard reads as an AI pin.** Neck-worn hardware has a stigma. | Medium | Pocket-first marketing and photography; lanyard as the option, not the identity. |
| R7 | **Small-volume manufacturing.** 1–5k units means poor pricing, high MOQs, and a hard time getting a good ODM's attention. | Medium | Choose a display and SoC that are already in volume elsewhere; avoid custom tooling beyond the enclosure. |
| R8 | **Return rate.** Hardware in a new category returns at 8–15%. | Medium | Over-invest in onboarding, connection reliability, and the first-week experience. A return costs more than a review. |
| R9 | **No moat.** | Medium | Accepted. Speed, community, and brand permission for restraint are the only defences. |

---

## 12. Metrics

### Product

| Metric | Target | Why |
|---|---|---|
| Phone unlocks per day | **−30% at week 4** vs. baseline | The promise |
| Companion daily active time | **< 25 min** | The guardrail. If this climbs, the product has become the thing it replaced |
| Median session length | **< 45 s** | Proves the shape is triage, not consumption |
| Sessions per day | 6–15 | Brief and frequent, not long and rare |
| D30 retention | ≥ 40% | The only honest signal that it earned a place in a life |
| Missed-call complaints | 0 in pilot | Reliability is the whole product |

### Business

| Metric | Target |
|---|---|
| Gross margin | ≥ 55% at $149 |
| Return rate | < 8% |
| Accessory attach (v1.5) | ≥ 25% |
| CAC (once paid is attempted) | < $35 |

**The metric that must never be optimised:** time on device. Any dashboard that treats it as a growth metric is a leading indicator that the refusal list is being negotiated away.

---

## 13. Decision log

| # | Decision | Alternatives rejected | Rationale |
|---|---|---|---|
| D1 | Necessity-only companion; firewall behaviour | Full remote control; pure subtraction | Only version with a defensible "why not just use your phone" answer |
| D2 | Tethered (BLE + Wi-Fi), same room/building | Cellular, independent device | Cellular turns this into a $250 phone, which is the graveyard |
| D3 | Roam is the hero context; car is display-only | Car-first; bedside-first | Roam is where the ninety-second window actually happens |
| D4 | Drafted replies + hidden keyboard fallback | Voice-first; full keyboard; keys-only | Voice needs a mic and fails in quiet places; a full keyboard rebuilds the phone |
| D5 | 4" LCD; atomic unit = read a thread | Glance-only; sustained reading / e-paper | Smallest panel that holds a conversation; e-paper is a different product |
| D6 | Everything in the *vision*; hard v1 gate in the PRD | Cut the brief to five features | Honours the ambition without shipping an unprioritised wish list |
| D7 | Pricing deferred; model published | Pick a price now | Cost model is not yet validated at volume |
| D8 | Rebuilt UI on Android native APIs | Pixel streaming; hybrid | Streaming makes the device a bad remote desktop and is the wrong interaction model |
| D9 | Unlocks −30% **and** bounded-use guardrail | Engagement-first metrics | Prevents success being defined as relocation |
| D10 | ESP32-P4 + C6 | i.MX 93 / 8M Mini; Snapdragon W5+ | Cheapest, lowest power, and the firewall becomes a property of the hardware rather than a policy |
| D11 | Polycarbonate + PMMA window | Glass and aluminium | Half the cost, less weight, and a device that is carried rather than protected |
| D12 | No audio path | Mic + speaker + amp | Removes acoustic design and a whole class of privacy objection; earbuds already exist |
| D13 | USB-C only; magnets for attachment | Qi / reverse wireless charging | Reverse charging needs a face-down phone and ~5 W; it is a v2 hypothesis |
| D14 | Reading in v1 (articles) | Defer reading entirely | It is the strongest differentiator against a smartwatch |

---

## 14. Open questions

1. **Does the ninety-second window actually dominate?** Needs usage data from 10 diary-study participants before any hardware spend.
2. **Can call control be done without restricted permissions on the top 20 Android devices?** If not, calls drop out of v1 and the value proposition weakens.
3. **Is the reading surface good enough on a 540 × 960 LCD?** Test with 20 articles and 10 readers before committing the panel.
4. **Lanyard or pocket as the default?** Photography and packaging depend on the answer.
5. **Does an article's *presence* on the device re-introduce consumption?** The reading surface is the most plausible route back to a feed. Instrument it separately.
6. **What is the name?** "Sidekick" is a placeholder and too generic for a brand.
7. **Is 5k units the right first run?** Depends on ODM terms and pilot conversion.
8. **Does the pilot need a v0.5 with a worse screen to test the thesis cheaply?** Likely yes — an off-the-shelf dev board in a 3D print can answer D1–D3 for under $10k.
