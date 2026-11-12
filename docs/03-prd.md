# Sidekick — Product Requirements Document (v1)

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | 2026-11-10 |
| **Owner** | Product |
| **Target** | v1 production, month 12 |
| **Platform** | Device firmware (ESP32-P4 + C6) + Android companion app |
| **Companion documents** | `01-concept.md`, `02-product-brief.md` |

---

## Contents

1. Overview and scope
2. Non-goals
3. Users and jobs
4. Platform constraints
5. System architecture
6. Hardware requirements
7. Functional requirements
8. Firewall requirements
9. Non-functional requirements
10. Metrics and instrumentation
11. Release gate and test plan
12. Deferred register
13. Open technical risks
14. Appendix A — Android API mapping
15. Appendix B — Power budget
16. Appendix C — Link protocol
17. Appendix D — Glossary

---

## 1. Overview and scope

Sidekick is a tethered companion display. An Android phone runs a companion app; a battery-powered card renders a fixed set of surfaces over BLE and Wi-Fi.

**In scope for v1:** pairing and link management, notification triage, thread reading and reply, call control, media control, navigation card, orientation, article reading, settings, and the firewall enforcement mechanisms.

**Out of scope for v1:** any browsing, video, app installation, cellular, camera, audio capture or playback, generative AI, book library, docks and mounts, iOS.

**Definition of v1:** a device that a person can carry for a week without charging, that never silently loses a message or a call, and that cannot be made to show a feed.

---

## 2. Non-goals

| Non-goal | Why it matters |
|---|---|
| Replacing the phone | The phone stays within BLE range and remains the source of truth |
| Working outside the home/office | No cellular. Distance is bounded by design. |
| Being a development platform | No third-party installs, no SDK, no scripting |
| Competing on notification volume | The device deliberately delivers fewer notifications than the phone |
| Being fashionable | It should look like a tool, not a gadget |
| Supporting every messaging app | v1 supports apps that expose reply actions; others are read-only |

---

## 3. Users and jobs

| User | Job | Success looks like |
|---|---|---|
| Self-aware heavy user | "Handle what just pinged me without picking up the internet" | Phone stays on the desk; reply sent in under 30 seconds |
| Deep-work professional | "Keep me reachable without putting the phone on my desk" | No missed messages during a 90-minute focus block |
| Parent | "Let me be contactable without a feed in my pocket" | School call answered from another room |

**Primary flow (the ninety-second window):**

```
Phone placed down
  → notification arrives, batched
  → haptic, card wakes
  → sender + message read in <5s
  → draft selected and sent in <20s
  → card returns to sleep
```

---

## 4. Platform constraints

Android only. These constraints are not implementation details; they shape the feature set.

| Constraint | Consequence | Mitigation |
|---|---|---|
| No public API to read the SMS database without restricted permissions | Full SMS thread history is unavailable | Reconstruct thread context from notification history (`THR-01`) |
| No public API to send SMS as a third party without restricted permissions | Direct SMS sending unavailable | Send replies through the notification's `RemoteInput`, so the messaging app performs the send |
| Play policy restricts `READ_SMS` / `SEND_SMS` / call permissions | Cannot ship a Play-distributed app that requests them casually | Do not request them in v1. Use notification actions. |
| No public map tile API | No map rendering | Navigation is a text card derived from the active navigation notification |
| No access to third-party app content beyond notifications | Some apps will show only a title | Document per-app behaviour; never promise parity |
| iOS has no equivalent outside the EU | iOS excluded | Android-only positioning |
| OEM battery managers kill background services | Link drops | `CompanionDeviceManager` association, foreground service, onboarding diagnostics |

---

## 5. System architecture

Three tiers.

### 5.1 Phone tier — Android companion app

- **Link manager** — BLE advertising scan, bonding, GATT connection, Wi-Fi credential handoff.
- **Collectors** — `NotificationListenerService`, `MediaSessionManager`, `CalendarContract`, weather, call state.
- **Thread model** — reconstructs per-sender conversation state from a rolling in-memory notification buffer.
- **Drafts engine** — v1 is deterministic and on-device: intent classification over the message text plus time/context rules, producing 2–3 candidate replies. No generative model, no network call.
- **Reading pipeline** — receives `ACTION_SEND`, extracts readable text, paginates, transmits.
- **Metrics store** — local only, opt-in export.
- **Foreground service** — `connectedDevice` type, persistent notification, survives Doze where the OEM permits.

### 5.2 Link tier

- **BLE 5.3** for state, control, and notifications. GATT service with characteristic per message class; MTU negotiated to 247; fragmentation for payloads over MTU.
- **Wi-Fi 6 (2.4 GHz)** for bulk transfer: article bodies, thread history backfill, firmware images.
- **Security:** BLE LE Secure Connections bonding at pairing. Application layer encrypts every payload with AES-256-GCM using a session key derived during pairing. Content is never written to device flash.

### 5.3 Device tier — firmware

- **RTOS on ESP32-P4**, LVGL for UI, no general-purpose OS, no package manager, no shell in production builds.
- **Surface renderer** — receives declarative surface state (JSON/CBOR), renders natively. No pixel transport.
- **Power manager** — display off by default; wake on lift, button, or batched notification.
- **Haptic driver** — single actuator, distinct patterns per event class.
- **Update client** — signed A/B images over BLE or Wi-Fi, verified before boot.

### 5.4 Data flow

```
App notification ──► NotificationListenerService
                         │
                         ├─► coalescing buffer (20s, grouped by sender)
                         │
                         └─► surface state ──► BLE encrypt ──► device render
                                                                    │
User taps draft ◄── BLE encrypt ◄── RemoteInput send ◄──────────────┘
```

---

## 6. Hardware requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| HWR-01 | Dimensions ≤ 101 × 63 × 9.0 mm | Measured on 10 production units |
| HWR-02 | Weight ≤ 90 g | Production unit, no lanyard |
| HWR-03 | 4.0" IPS LCD, 540 × 960, 16:9 | Panel datasheet + visual inspection |
| HWR-04 | Peak brightness ≥ 400 nits, contrast ≥ 800:1 | Measured at centre, 5 points |
| HWR-05 | Touch panel, single-point, glove-tolerant | Works with dry and slightly damp finger |
| HWR-06 | ESP32-P4 with ≥ 16 MB PSRAM, ≥ 16 MB flash | BOM confirmation |
| HWR-07 | ESP32-C6 for Wi-Fi 6 (2.4 GHz) and BLE 5.3 | Certification report |
| HWR-08 | Battery ≥ 1,200 mAh, ≥ 500 cycles to 80% | Cell datasheet + cycle test |
| HWR-09 | USB-C charging at ≥ 7.5 W, full charge ≤ 2 h | Measured from 5% to 100% |
| HWR-10 | Magnet array, N42 or better, ≥ 6 positions | Holds device on a vertical steel surface with lanyard attached |
| HWR-11 | Moulded lanyard loop, ≥ 15 N break strength | Pull test |
| HWR-12 | Haptic actuator with ≥ 3 distinguishable patterns | Blind discrimination test, 10 users |
| HWR-13 | 3-axis accelerometer for lift-to-wake and orientation | Wakes within 400 ms of lift |
| HWR-14 | Ambient light sensor for pocket suppression and auto-brightness | Suppression accurate at < 10 lux |
| HWR-15 | No microphone, no speaker, no audio amplifier | BOM audit |
| HWR-16 | Three physical buttons: power, volume up/down (action key optional) | Usable one-handed |
| HWR-17 | Polycarbonate enclosure, hard-coated PMMA window ≥ 3H | Pencil hardness test |
| HWR-18 | IP54 | IEC 60529 test |
| HWR-19 | 1.0 m drop to concrete, six faces, no functional loss | Drop test, 3 units |
| HWR-20 | Operating temperature 0–40 °C, surface ≤ 42 °C in use | Thermal camera under load |
| HWR-21 | FCC, CE, UKCA, RoHS, UN38.3 | Certificates on file before PVT |
| HWR-22 | No camera, no GPS, no cellular radio | BOM audit |

---

## 7. Functional requirements

Priorities: **P0** blocks release, **P1** required for release, **P2** nice to have.

### 7.1 System and link

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| SYS-01 | Pair via QR code shown on the device and scanned by the phone | First-time pairing completes in < 45 s, 9 of 10 attempts | P0 |
| SYS-02 | Reconnect automatically when the phone returns in range | Reconnect < 3 s after range restore, 95% of attempts over 50 trials | P0 |
| SYS-03 | Show explicit link state: connected, reconnecting, out of range, phone off | State changes within 2 s of the event; never display stale data as live | P0 |
| SYS-04 | Unpair from either side wipes all cached content on the device | Verify by flash dump after unpair | P0 |
| SYS-05 | Firmware update with signature verification and A/B rollback | Tampered image rejected; failed update rolls back and boots | P0 |
| SYS-06 | Battery indication at 20%, 10%, 5% with escalating haptic | Observable at each threshold | P1 |
| SYS-07 | Wake from sleep to home surface in < 500 ms | Measured 100 times | P0 |
| SYS-08 | No account, no login, no cloud dependency for core function | Full feature test with no network on the phone except local | P0 |
| SYS-09 | Operate with last-known state for ≥ 10 minutes while disconnected | All surfaces render cached data with a clear stale marker | P1 |
| SYS-10 | Onboarding diagnostics that detect OEM battery restrictions | Reports pass/fail for the 10 highest-volume OEMs | P1 |

### 7.2 Notifications

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| NOT-01 | Receive notifications with app name, sender, and body text | Rendered within 1.5 s of arrival, p95 | P0 |
| NOT-02 | Coalesce deliveries in a 20 s window, grouped by sender | 5 rapid notifications produce one wake and one grouped surface | P0 |
| NOT-03 | Dismiss on device removes the notification on the phone | Verified on the phone within 2 s | P0 |
| NOT-04 | Group conversation stacks by sender, not by app | Threads from one sender appear together across apps | P1 |
| NOT-05 | Never display a numeric badge or unread count | Visual audit across all surfaces | P0 |
| NOT-06 | Suppress delivery when face-down or in a pocket | 0 wakes in a 2-hour pocket test | P1 |
| NOT-07 | Per-app allowlist configured on the phone | Blocked apps never appear on the device | P0 |
| NOT-08 | Strip images and media from notifications | Body renders as text only | P0 |
| NOT-09 | Respect quiet hours configured on the phone | 0 deliveries during the window, except starred contacts | P1 |

### 7.3 Threads and reply

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| THR-01 | Reconstruct conversation context from notification history, up to 8 prior messages per sender | A 6-message exchange renders in order with timestamps | P0 |
| THR-02 | Offer 2–3 contextual draft replies, generated on-device with no network call | Drafts appear within 300 ms of opening a thread; no network egress during generation | P0 |
| THR-03 | Send a selected draft through the notification's `RemoteInput` action | Message arrives on the recipient's device; no `SEND_SMS` permission requested | P0 |
| THR-04 | Provide a keyboard fallback for free-text replies | Text entry usable with one hand; ≤ 3 taps to reach | P1 |
| THR-05 | Queue replies when disconnected and send on reconnect | Queued reply visibly marked; delivered within 5 s of reconnect | P0 |
| THR-06 | Surface send failure with a retry action | No silent loss; failure visible within 3 s | P0 |
| THR-07 | Do not support attachments, media, or group administration | No such control exists in the UI | P0 |
| THR-08 | Paginate threads at 4 messages per page with an explicit next action | No free scrolling through an unbounded list | P0 |
| THR-09 | Mark read-only apps clearly when no reply action exists | A "reply not available" state, not a disabled-looking button | P1 |

### 7.4 Calls

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| CAL-01 | Show incoming call with caller name and number | Rendered within 1 s of ringing, p95 | P0 |
| CAL-02 | Answer and decline from the device | Call connects on the phone; audio uses the phone's active route (earbuds) | P0 |
| CAL-03 | Mute and unmute during an active call | Mute state reflected on the phone within 1 s | P1 |
| CAL-04 | Never route call audio through the device | No audio hardware present; verified by BOM and test | P0 |
| CAL-05 | Show missed call summary | Missed calls appear once, grouped | P1 |
| CAL-06 | Decline without sending a message | No SMS is sent on decline | P0 |

### 7.5 Media

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| MED-01 | Show now-playing title, artist, and app | 1.5 s after session activation | P1 |
| MED-02 | Play, pause, next, previous | Control reflected on the phone within 500 ms | P1 |
| MED-03 | Relative volume up/down in defined steps | 10 steps, matches phone media volume | P1 |
| MED-04 | No library browsing, search, or recommendations | No such surface exists | P0 |
| MED-05 | Select the most recently active session when multiple exist | Correct session chosen in 9 of 10 trials | P2 |

### 7.6 Navigation

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| NAV-01 | Display next instruction and distance from the active navigation notification | Render within 1 s of instruction change | P1 |
| NAV-02 | Display ETA when present in the notification | Correct value, refreshed at least every 60 s | P1 |
| NAV-03 | Enter navigation mode automatically when navigation is active | No manual mode selection required | P1 |
| NAV-04 | Render no map tiles and no route line | Visual audit | P0 |
| NAV-05 | Fail silently and gracefully when the navigation app does not publish usable state | Surface does not appear; no empty card | P1 |
| NAV-06 | Wake the display on instruction change in car mode | Display wakes without touch | P1 |

### 7.7 Orientation

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| ORI-01 | Time and date, always available offline | Drift < 1 s/day | P1 |
| ORI-02 | Next meeting within 24 h, with time and title | Accurate to the phone calendar | P1 |
| ORI-03 | Current conditions and today's high/low | Matches the phone's source | P2 |
| ORI-04 | No calendar editing or agenda planning | Read-only surface | P0 |

### 7.8 Reading

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| REA-01 | Accept an article via the Android share sheet from any app | Appears on the device within 5 s of share | P1 |
| REA-02 | Extract readable text and discard navigation, ads, and related links | Body text only; no chrome | P1 |
| REA-03 | Paginate into fixed pages with explicit next/previous | No vertical scrolling through the article | P0 |
| REA-04 | Typographic spec: 38–45 characters per line, ≥ 18 px body, 1.5 line height | Measured on device | P1 |
| REA-05 | Persist reading position per article | Returns to the same page after sleep | P1 |
| REA-06 | No links, images, or in-article navigation surfaces | Visual audit | P0 |
| REA-07 | Truncate articles over 12,000 words with a clear end-of-article state | No partial sentence; explicit truncation notice | P2 |
| REA-08 | Show elapsed reading time after 10 continuous minutes | Interruption appears once per session | P1 |

### 7.9 Settings

| ID | Requirement | Acceptance criteria | Pri |
|---|---|---|---|
| SET-01 | Brightness, adjustable in 5 steps | Persists across reboot | P1 |
| SET-02 | Haptic intensity, 3 levels, plus silent | Persists across reboot | P1 |
| SET-03 | About: firmware version, battery health, paired phone, unpair | All values accurate | P1 |
| SET-04 | No account, no cloud, no telemetry upload | Network audit of the device shows zero outbound internet | P0 |
| SET-05 | Factory reset reachable without the phone | Hold power 10 s; requires confirmation | P1 |

---

## 8. Firewall requirements

These are release-blocking and testable. Each maps to a verification method.

| ID | Requirement | Verification |
|---|---|---|
| FW-01 | The firmware image contains no browser engine | Build manifest audit; no HTML/CSS/JS runtime linked |
| FW-02 | The firmware image contains no video decoder or player | Build manifest audit; no media pipeline component |
| FW-03 | No mechanism exists to install or run third-party code | No interpreter, no package manager, no executable loader in production build |
| FW-04 | Every list paginates; no scrollable unbounded list exists | UI audit across all surfaces |
| FW-05 | No autoplay, auto-advance, or pull-to-refresh gesture | Interaction audit |
| FW-06 | A continuous session of 5 minutes on any triage surface triggers a full-screen interruption with "done" and "back to phone". Reading is exempt up to 10 minutes, where REA-08 applies. | Automated session test |
| FW-07 | No recommendation, "suggested", or "related" surface | Copy and UI audit |
| FW-08 | Notifications are coalesced, never delivered one-at-a-time as they arrive | Behavioural test with 20 rapid notifications |
| FW-09 | The device makes zero outbound internet connections | Packet capture over 72 h |
| FW-10 | Reading surfaces contain no tappable external references | UI audit |
| FW-11 | No engagement metric exists in the codebase; session length is reported only as a guardrail | Code review of the metrics module |
| FW-12 | Build fails CI if FW-01, FW-02, or FW-03 regress | Automated image-manifest check in CI |

---

## 9. Non-functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| NFR-01 | Notification to rendered surface < 1.5 s, p95 | 500-event measurement |
| NFR-02 | Reply send to phone dispatch < 2 s, p95 | 200-event measurement |
| NFR-03 | Navigation update < 1 s, p95 | 100-instruction measurement |
| NFR-04 | Battery ≥ 7 days at 25 min/day screen-on; ≥ 5 days at 60 min/day | Bench test, Appendix B model |
| NFR-05 | Standby drain ≤ 3 mA with BLE connected, display off | Current measurement over 24 h |
| NFR-06 | No unhandled crash or watchdog reset over 7 days of continuous operation | Soak test |
| NFR-07 | Content encrypted in transit; no message content written to device flash | Flash dump after 24 h of use |
| NFR-08 | Pairing resistant to a passive eavesdrop and a man-in-the-middle within BLE range | Security review; LE Secure Connections verified |
| NFR-09 | Reconnect succeeds 95% of the time within 3 s over 50 trials on each of the top 5 OEMs | Device matrix test |
| NFR-10 | UI legible at 200 lux and at 20,000 lux | Field test in daylight |
| NFR-11 | Two font size options (default, large) without layout breakage | Visual audit of all surfaces |
| NFR-12 | Surface temperature ≤ 42 °C under sustained load | Thermal camera |
| NFR-13 | Localisation: Latin scripts at launch; CJK supported by font fallback; complex scripts declared unsupported | Font coverage test |
| NFR-14 | Boot and update are power-fail safe | Abrupt power cut during update × 20 |

---

## 10. Metrics and instrumentation

All computation happens **on the phone**, stored locally, exported only with explicit opt-in. The device reports nothing.

| ID | Metric | Definition | Target | Purpose |
|---|---|---|---|---|
| MET-01 | Phone unlocks per day | Device-unlock events via `UsageStatsManager`, 28-day rolling baseline | −30% at week 4 | The promise |
| MET-02 | Companion daily active time | Sum of display-on seconds | < 25 min/day | Guardrail |
| MET-03 | Median session length | Median of display-on sessions | < 45 s | Shape |
| MET-04 | Sessions per day | Count of display-on sessions | 6–15 | Shape |
| MET-05 | D30 retention | Users active in week 4 / cohort | ≥ 40% | Fit |
| MET-06 | Draft acceptance rate | Replies sent via draft / total replies | ≥ 40% | Usefulness of the core mechanic |
| MET-07 | Missed-call incidents | Calls missed while the device was in use | 0 | Reliability |
| MET-08 | Reconnect failures per day | Link drops not recovered in 10 s | < 1 | Reliability |
| MET-09 | Reading time share | Reading seconds / total display-on seconds | < 25% | Firewall health |
| MET-10 | Queue depth at send | Replies queued due to disconnection | < 5% | Reliability |

**Instrumentation rule:** no metric may be added to this table without stating which decision it informs. If a metric cannot change a decision, it is not collected.

---

## 11. Release gate and test plan

### 11.1 Definition of done for v1

All of the following, simultaneously:

1. All P0 requirements pass.
2. ≥ 90% of P1 requirements pass; the remainder have documented waivers with a v1.5 ticket.
3. FW-01 through FW-12 verified, with the CI check live.
4. Battery ≥ 7 days at 25 min/day on 3 units.
5. 7-day soak with zero watchdog resets.
6. 50-trial reconnect test passes on Pixel, Samsung, Xiaomi, OnePlus, and Motorola.
7. 30-user, 4-week pilot: unlocks −20% or better, companion time ≤ 30 min/day, D30 ≥ 40%, zero missed-call complaints.
8. Flash dump after pilot shows no message content at rest.
9. Certification files complete.

### 11.2 Test plan

| Layer | Method | Coverage |
|---|---|---|
| Pairing and link | Automated harness, 50 cycles per OEM | SYS-01, SYS-02, NFR-09 |
| Notifications | Scripted notification injection across 12 apps | NOT-01 to NOT-09 |
| Reply | End-to-end with 6 messaging apps, 3 account types | THR-01 to THR-09 |
| Calls | 100 answer/decline cycles across 5 OEMs, earbuds connected | CAL-01 to CAL-06 |
| Navigation | 4 navigation apps, 20 routes, daylight and night | NAV-01 to NAV-06 |
| Reading | 20 articles, 10 readers, comprehension and fatigue | REA-01 to REA-08 |
| Firewall | Manifest audit + packet capture + UI audit | FW-01 to FW-12 |
| Power | Bench with scripted usage profiles | NFR-04, NFR-05 |
| Security | Flash dump, BLE sniffing, pairing MITM | NFR-07, NFR-08 |
| Field | 30 users, 4 weeks, diary + instrumented metrics | MET-01 to MET-10 |

---

## 12. Deferred register

Every item removed from v1, with the reason and the condition for reconsideration.

| Feature | Reason deferred | Reconsider when |
|---|---|---|
| Generative reply drafts | Adds a network dependency, per-reply cost, and a privacy question to the core flow; v1 ships deterministic drafts | Draft acceptance ≥ 40% in pilot and an on-phone model meets the 300 ms budget |
| Book library | Wants e-paper; a book UI on LCD is a compromise product | A reflective variant exists, or pilot shows articles are heavily used |
| Docks and mounts | Not required to test the thesis; sold separately in v1.5 | v1 ships and attach rate can be measured |
| Reverse / wireless charging | Needs a face-down phone and ~5 W; magnets already solve attachment | A phone-side power standard stabilises, or a magnetic puck is designed |
| Voice input | No microphone in the chosen hardware | Never, unless audio hardware is added for a different reason |
| Video | Refused permanently | Never |
| Browser | Refused permanently | Never |
| App store | Refused permanently | Never |
| AI quick answers | Slot-machine risk; single-screen answer UX is unresolved | A single-answer, no-results UX is proven and the firewall audit passes |
| Cellular / standalone | Turns the product into a phone | A separate product, with its own concept document |
| iOS support | EU-only, reply-only, DMA licence constraints | EU demand exceeds 20% of waitlist |
| Multi-language complex scripts | ESP32-P4 text shaping limits | A Linux-class SoC is chosen, or demand justifies a font pipeline |

---

## 13. Open technical risks

| # | Risk | Impact | Early test |
|---|---|---|---|
| T1 | Call answer/decline may not be possible via notification actions on all OEMs | Calls drop out of v1 | Build a 1-week spike on 5 devices before committing the call surface |
| T2 | OEM battery managers kill the companion service | Link reliability collapses | Onboarding diagnostics + 50-trial reconnect on the top 5 OEMs |
| T3 | Navigation notification formats vary by app and region | Nav card is unreliable | Test against the 4 most-used navigation apps per target market |
| T4 | LVGL text rendering quality for long-form reading | Reading fails as a differentiator | Prototype the reading surface on the dev board before panel selection |
| T5 | PSRAM bandwidth with a 540 × 960 framebuffer | UI feels sluggish | Measure frame time at 30 fps on the reference board |
| T6 | BLE throughput for article transfer | Reading flow feels slow | Measure sustained throughput; fall back to Wi-Fi earlier |
| T7 | Deterministic drafts feel dumb | Core mechanic fails | Pilot MET-06; if < 25%, escalate generative drafts |
| T8 | Device gets warm during Wi-Fi article sync | Comfort and battery | Thermal test during a 12,000-word transfer |

---

## 14. Appendix A — Android API mapping

| Capability | API | Permission / access | Notes |
|---|---|---|---|
| Notification capture | `NotificationListenerService` | Notification access (special access grant) | User must enable manually; onboarding must explain it |
| Notification dismiss | `NotificationListenerService.cancelNotification` | Notification access | — |
| Inline reply | `Notification.Action` + `RemoteInput` | Notification access only | **No SMS permission required.** The messaging app performs the send |
| Conversation context | Rolling in-memory buffer of `StatusBarNotification` | Notification access | No SMS database access |
| Media control | `MediaSessionManager.getActiveSessions` + `MediaController` | Notification access | — |
| Call answer/decline | Notification action `PendingIntent`; fallback `TelecomManager` | Notification access; `ANSWER_PHONE_CALLS` only if granted | See T1 |
| Calendar | `CalendarContract.Instances` | `READ_CALENDAR` | Runtime permission |
| Contacts | `ContactsContract` | `READ_CONTACTS` (optional) | Used for display names only; no photos |
| Weather | Provider HTTP call from the phone | `INTERNET` | Device never calls the internet |
| Article ingestion | `ACTION_SEND` share target | None | Text extraction on the phone |
| BLE | `BluetoothGatt`, `BluetoothLeAdvertiser` | `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` | LE Secure Connections bonding |
| Wi-Fi | Local network / `WifiNetworkSpecifier` | `NEARBY_WIFI_DEVICES` | 2.4 GHz only |
| Companion association | `CompanionDeviceManager` | User consent dialog | Enables background presence and reduced permission friction |
| Foreground service | `startForeground` with `connectedDevice` type | `FOREGROUND_SERVICE_CONNECTED_DEVICE` | Required for link stability |
| Unlock counting | `UsageStatsManager` | `PACKAGE_USAGE_STATS` (special access) | Used only for MET-01 |

**Permissions deliberately not requested in v1:** `READ_SMS`, `SEND_SMS`, `READ_CALL_LOG`, `ANSWER_PHONE_CALLS` (unless T1 forces it), `CAMERA`, `RECORD_AUDIO`, `ACCESS_FINE_LOCATION` (except legacy Wi-Fi paths on pre-Android 13).

---

## 15. Appendix B — Power budget

Assumptions: 1,200 mAh at 3.8 V (4.56 Wh), 4.0" LCD backlight ~100 mA, ESP32-P4 system with Wi-Fi off ~50 mA, C6 BLE-connected average ~2.5 mA.

| State | Current | Notes |
|---|---|---|
| Display on, BLE connected | ~150 mA | Backlight dominant |
| Display off, BLE connected | ~2.5 mA | Light sleep, advertising maintained |
| Wi-Fi article sync | ~180 mA | Burst only, seconds |

| Usage profile | Screen-on | Daily draw | Endurance |
|---|---|---|---|
| Target (25 min/day) | 25 min | ~62 + 60 = 122 mAh | **~9.8 days** |
| Light (15 min/day) | 15 min | ~37 + 60 = 97 mAh | ~12.4 days |
| Heavy (60 min/day) | 60 min | ~150 + 60 = 210 mAh | ~5.7 days |

Firmware must hold standby at ≤ 3 mA. Every 0.5 mA of standby costs roughly two days of endurance, which makes power a UI concern, not only a hardware one.

---

## 16. Appendix C — Link protocol

Minimal contract; the implementation may change as long as behaviour holds.

```
Transport: BLE GATT, MTU 247, fragmentation for > 240 byte payloads
Fallback:  Wi-Fi 6 (2.4 GHz) for payloads > 8 KB
Encoding:  CBOR
Security:  AES-256-GCM, session key from LE Secure Connections pairing
```

| Message | Direction | Payload |
|---|---|---|
| `hello` | both | protocol version, device id, capability flags |
| `surface.state` | phone → device | surface type, model, revision |
| `surface.patch` | phone → device | surface id, field deltas |
| `action` | device → phone | action id, surface id, parameters |
| `ack` | both | message id, status |
| `link.status` | device → phone | rssi, battery, uptime |
| `bulk.begin` / `bulk.chunk` / `bulk.end` | both | transfer id, offset, bytes |
| `time.sync` | phone → device | epoch ms |

Surfaces are declarative. The phone never sends pixels, and the device never interprets arbitrary layout.

---

## 17. Appendix D — Glossary

| Term | Meaning |
|---|---|
| **Surface** | A fixed screen type the device can render: notification list, thread, call, media, navigation, orientation, reading, settings |
| **Batch window** | The 20-second coalescing period before notifications are delivered |
| **Draft** | A deterministic, on-device suggested reply |
| **Roam** | The hero context: phone docked, device carried |
| **Firewall** | The enforced set of capabilities the device does not have |
| **Guardrail metric** | A metric whose degradation means success is illusory |
| **Stale marker** | Visible indication that displayed data is cached and not live |
