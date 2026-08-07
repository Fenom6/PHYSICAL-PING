# Physical Ping — pTCP/IP v3.1 FEDERATION

> A browser-based spatial sensing platform that fuses acoustic chirp ranging, device sensor fingerprinting, and multi-instance mesh networking into a unified 11-dimensional mediation framework.

**▶ Live (recommended, works on phones): https://fenom6.github.io/PHYSICAL-PING/**

The GitHub Pages deployment is the only zero-setup path with full sensor access: HTTPS gives the microphone, motion, orientation, and geolocation APIs everything they need.

---

## Abstract

Physical Ping introduces the **Physical Transport Control Protocol (pTCP)**, an experimental approach that bridges network-style diagnostics and real-world physical-layer sensing. The system computes a continuous **Mediation Coefficient μ(x,t)** across 11 dimensions — from acoustic propagation delay to RF density — and governs behavior through empirically framed **Phase-Laws**. Version 3.0 added SDK generation, a spatial mediation database, and statistical Phase-Law auto-discovery. **Version 3.1 adds multi-instance federation: a CRDT engine (vector clocks, G/PN-Counter, LWW, OR-Set, MV-Register) with gossip-based mesh sync and anti-entropy repair.**

## What is real and what is simulated

Physical Ping is a 見本市 (showcase): some dimensions are backed by real device sensors, others are simulations that demonstrate the architecture. The UI tags every dimension with a source badge, and the **Reality Index ρ** is the ratio of REAL sources among active dimensions.

| Signal | Source | Status |
|--------|--------|--------|
| Acoustic ranging | Microphone + speaker chirp (Web Audio / AudioWorklet) | **REAL** |
| Kinetic | DeviceMotion accelerometer | **REAL** (iOS requires permission grant) |
| EM field | Magnetometer where available; otherwise device tilt via DeviceOrientation | **REAL / EST** (tilt fallback is labeled `tilt °` — it is not µT) |
| Spatial | Geolocation API | **REAL** |
| Photonic | AmbientLightSensor (rare); otherwise time-of-day estimate | **EST** |
| Thermal | CPU-load proxy | **EST** |
| BLE mesh / RF spectrum / NFC | Simulated | **SIM** |
| Mesh peers (pTCP / Federation) | Real across browser tabs via BroadcastChannel; remote "instances" are simulated | **REAL (same device) / SIM (remote)** |
| ESP32 fleet, vehicles, warehouse, factory machines, cityscape | Simulated demo data | **SIM** |

## Architecture Overview

Physical Ping is a **single-file React SPA** (~7,900 lines) plus three PWA sidecar files (`sw.js`, `manifest.webmanifest`, icons). It runs entirely in the browser with zero server-side dependencies, organized into **26 tabs**:

```
┌─────────────────────────────────────────────────────────────┐
│  L3  Cerebrum         Claude API integration (LLM reasoning)│
├─────────────────────────────────────────────────────────────┤
│  L2  Spatial Intelligence   Routing / Digital Twin / Vehicle│
├─────────────────────────────────────────────────────────────┤
│  L1  Midbrain         Anomaly detection / Reflex gating     │
├─────────────────────────────────────────────────────────────┤
│  L0  Phase-Laws       12 governing laws + auto-discovery    │
├─────────────────────────────────────────────────────────────┤
│  HW  Hardware         ESP32 fleet / BLE / Sensors (SIM)     │
├─────────────────────────────────────────────────────────────┤
│  IND Industry         Warehouse / Factory / Plugin Arch     │
├─────────────────────────────────────────────────────────────┤
│  CITY Cityscape       Digital Twin / Vehicle Fleet / Site   │
├─────────────────────────────────────────────────────────────┤
│  PLAT Platform        SDK / Spatial DB / Auto-Discovery     │
├─────────────────────────────────────────────────────────────┤
│  FED Federation       Multi-instance mesh / CRDT state      │
└─────────────────────────────────────────────────────────────┘
```

### Tab Map (26 views)

The UI shows 5 primary tabs (MEASURE, PRECISION, SPECTRUM, PEERS, DASHBOARD); the remaining 21 are behind the **MORE** expander.

| # | Tab | Layer | Description |
|---|-----|-------|-------------|
| 1 | `measure` | Core | Primary ping measurement with acoustic ranging |
| 2 | `precision` | Core | Multi-chirp, SNR, cross-validation |
| 3 | `spectrum` | Core | RF spectrum (SIM), BLE (SIM), thermal mapping |
| 4 | `peers` | Core | BroadcastChannel / WebRTC mesh |
| 5 | `heatmap` | Viz | Spatial heatmap of μ (positions are SIM random-walk) |
| 6 | `timeline` | Viz | Time-series multi-dimension chart |
| 7 | `dashboard` | Viz | Aggregate statistics dashboard |
| 8 | `profiles` | Viz | Saved environment fingerprints |
| 9 | `network` | L2 | Hybrid network topology analyzer |
| 10 | `midbrain` | L1 | 4-layer cognitive processing pipeline |
| 11 | `intelligence` | L2 | Safety zones, KY alerting, worker tracking (SIM) |
| 12 | `routing` | L2 | Phase-Law-aware adaptive routing |
| 13 | `memory` | L2 | IndexedDB persistent mediation history |
| 14 | `hardware` | HW | ESP32 fleet management (SIM) |
| 15 | `warehouse` | IND | Zone tracking, forklift monitoring (SIM) |
| 16 | `factory` | IND | Acoustic FFT machine health (mic REAL, machines SIM) |
| 17 | `plugins` | IND | Plugin registry and lifecycle management |
| 18 | `cityscape` | CITY | Digital Twin entity management (SIM) |
| 19 | `testbed` | CITY | Verification test suite runner |
| 20 | `vehicle` | CITY | Vehicle fleet tracking (SIM) |
| 21 | `site` | CITY | Multi-site deployment management |
| 22 | `patent` | Core | Measurement dataset collection and metrics |
| 23 | `sdk` | PLAT | Multi-language SDK code generation |
| 24 | `spatialdb` | PLAT | Spatial Mediation query engine |
| 25 | `autodiscovery` | PLAT | Statistical Phase-Law discovery |
| 26 | `federation` | FED | Multi-instance mesh: CRDT shared state, gossip sync, anti-entropy, node roles |

---

## 11-Dimensional Mediation System

The **Mediation Coefficient μ(x,t)** is a weighted composite of 11 dimension values, each normalized to [0,1].

### Dimensions (actual keys and default weights)

| Key | Weight | Source | Status |
|-----|--------|--------|--------|
| `acoustic` | 0.20 | Chirp ranging confidence | REAL |
| `emField` | 0.10 | Magnetometer / orientation tilt | REAL / EST |
| `photonic` | 0.08 | AmbientLightSensor / time-of-day | EST |
| `kinetic` | 0.08 | Accelerometer energy | REAL |
| `rfDensity` | 0.10 | Simulated RF spectrum | SIM |
| `nfcField` | 0.05 | Simulated (no Web NFC implementation) | SIM |
| `thermal` | 0.07 | CPU-load thermal proxy | EST |
| `spatial` | 0.10 | Geolocation accuracy | REAL |
| `bleMesh` | 0.10 | Simulated BLE scan | SIM |
| `network` | 0.08 | Real (non-simulated) mesh peers | REAL |
| `collaborative` | 0.04 | Peer collaboration state | REAL |

```
μ(x,t) = Σ(wᵢ × dᵢ) / Σ(wᵢ)
```

Source tags: `REAL` (direct sensor), `EST` (derived estimate), `SIM` (simulation), `N/A`. The **Reality Index** is the REAL ratio among active dimensions.

---

## Acoustic Ranging (how the measurement works)

1. The speaker fires a chirp (default 1→5 kHz, 30 ms).
2. The microphone records ~800 ms via AudioWorklet (ScriptProcessor fallback).
3. Normalized cross-correlation against the reference chirp finds the **direct speaker→mic peak**, then the **first echo peak** after it.
4. Distance = Δt(direct→echo) / 2 × c (343 m/s). Using the direct-path peak as the time reference cancels device audio latency.
5. When no echo peak is resolvable, the calibrated loopback time is subtracted instead (`CALIBRATE` measures it; up to 250 ms is accepted — real phones commonly sit at 30–150 ms).
6. A Kalman filter (seeded with the first valid measurement, reset on signal/calibration change) smooths the history.

The result card shows which method produced the number: `ECHO(直接波基準)` or `LB(較正減算)`.

---

## Phase-Law Framework

### Built-in Phase-Laws (12)

| ID | Name |
|----|------|
| PL-001 | Acoustic-Spatial Coupling |
| PL-002 | EM Continuity |
| PL-003 | Spectral Openness |
| PL-004 | Kinetic Stability |
| PL-005 | RF Density |
| PL-006 | Sensor Completeness |
| PL-007 | Network Connectivity |
| PL-008 | Thermal-Photonic Coupling |
| PL-009 | Cross-Modal Coherence |
| PL-010 | Spatial Consistency |
| PL-011 | Temporal Stability |
| PL-012 | Environmental Context |

Each law evaluates to a per-law state (e.g. `COUPLED`/`PARTIAL`/`DECOUPLED`, `CONTINUOUS`/`DISCONTINUOUS`, …) with a continuous score in [0,1]. Law states drive the Midbrain mode FSM (NOMINAL → ALERT → CRITICAL → EMERGENCY).

### Phase-Law v3 Auto-Discovery

Statistical discovery of candidate laws from accumulated data: Pearson correlation matrix, lagged correlation (steps 1/2/3/5), bimodal distribution detection. Requires ≥20 samples; p < 0.05. Candidates are confirmed or rejected by the user, then integrated with live `evaluate()` functions.

---

## v3.1 FEDERATION

- **CRDT engine** — VectorClock plus five CRDT types: G-Counter, PN-Counter, LWW-Register, OR-Set, MV-Register
- **Federation mesh** — BroadcastChannel-based multi-instance discovery (`ptcp_v31_federation`): open the page in multiple tabs/windows to federate them for real; additional remote instances are simulated
- **Gossip + anti-entropy** — periodic state fragments plus a repair sweep; partition detection and healing
- **Node roles** — origin / replica / relay / observer

## L3 Cerebrum (Claude API)

The Midbrain filters salient signals and can escalate to Claude for a natural-language situation report.

- **No key set (default):** the query button falls back to a rule-based LOCAL summary — it always produces something.
- **With an API key:** open the CEREBRUM card (MIDBRAIN tab), set your Anthropic API key. It is stored **only in this browser's localStorage** and sent **directly to api.anthropic.com** (`anthropic-dangerous-direct-browser-access`). Use a low-limit dedicated key; never commit a key to the repo — the page is public.

---

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Browser (Chrome 90+, Safari 15+, Firefox 90+) |
| Framework | React 18.2 (UMD via cdnjs, no build step; `React.createElement`, no JSX) |
| State Management | 43 custom React hooks |
| Persistence | IndexedDB + localStorage |
| P2P Networking | BroadcastChannel (+ WebRTC scaffolding) |
| Audio Processing | Web Audio API (AudioWorklet capture, FFT, cross-correlation) |
| Visualization | Canvas 2D (charts, heatmaps, radar, mesh) |
| Compression | lz-string 1.5.0 (cdnjs) |
| QR | qrcode-generator (MIT, inlined) |
| Typography | IBM Plex Mono (Google Fonts, non-blocking; monospace fallback) |
| Installability | PWA — real `sw.js` (network-first page / cache-first assets) + `manifest.webmanifest` + icons |

### Dependencies (CDN)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js"></script>
```

If the CDN is unreachable the boot screen shows an explicit error (and after the first visit, the service worker serves the cached copies offline).

---

## Getting Started

### 1. Live (recommended)

Open **https://fenom6.github.io/PHYSICAL-PING/** on your phone, tap **PING**, and allow microphone access. On iOS, also tap **GRANT SENSOR ACCESS** (banner under the header) for motion/orientation.

### 2. Local

```bash
# Simplest: open the file directly (sensors limited on file://)
open index.html

# Better: serve over HTTP — localhost is a secure context, so all sensor APIs work
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

Note: testing from another device via `http://<PC-IP>:8080` is NOT a secure context — the mic API will be unavailable (the app shows an explicit message instead of freezing). Use the GitHub Pages URL for real-phone testing.

### First measurement checklist

1. Open the page → the demo overlay explains the flow on first visit
2. Tap **PING** → allow microphone
3. Run **CALIBRATE** once per device (measures speaker→mic loopback latency)
4. Optionally grant motion/orientation (iOS banner) and location for more REAL dimensions

---

## API Reference (selected hooks)

| Hook | Purpose |
|------|---------|
| `useMultiChirp()` | 3-band chirp measurement with SNR gating |
| `useSP()` | iOS sensor permission flow (DeviceOrientation/Motion) |
| `usePTCPNetwork()` | BroadcastChannel mesh (SYN/ACK/heartbeat/checksums) |
| `useMultiPeer()` | Secondary BroadcastChannel mesh |
| `useMidbrain(...)` | Reflex gate, salience filter, mode FSM, embodiment checks |
| `useCerebrumAPI()` | Claude API integration + LOCAL fallback |
| `useESP32Fleet()` | Simulated fleet management |
| `useSpatialMediationDB(...)` | Spatial query engine (`composite>0.5 space:office tag:x since:1h dim:acoustic/gt/0.5 near:<id>`) |
| `usePhaseAutoDiscovery(...)` | Statistical Phase-Law discovery |
| `useCRDTState(nodeId)` | CRDT registers with vector clocks |
| `useFederation(nodeId, mediationRef, phaseLawsRef)` | v3.1 federation mesh |

Measurement/mediation core is inline App state driven by a fixed 2-second timer (`calcMediation` + `evaluatePhaseLaws`).

The SDK tab generates JS / Python / Rust client code against a hypothetical REST/WS surface. The generated `@physical-ping/sdk` package name is **not published to npm** — copy the generated code from the SDK tab.

---

## Version History

| Version | Codename | Lines | Tabs | Key Additions |
|---------|----------|-------|------|---------------|
| v1.0 | CORE | ~1,200 | 4 | Basic ping, acoustic ranging, mediation |
| v1.1 | SPECTRUM | ~1,800 | 7 | RF spectrum, BLE, NFC, EM fingerprinting |
| v1.2 | VISUAL | ~2,300 | 10 | Heatmap, timeline, dashboard, profiles |
| v1.3 | PRECISION | ~2,700 | 11 | SNR, cross-validation, quality metrics |
| v1.4 | NETWORK | ~3,200 | 13 | Mesh, hybrid topology, memory |
| v1.5 | APPLICATION | ~3,600 | 15 | Midbrain, intelligence, routing, patent |
| v2.0 | INTELLIGENCE | ~4,200 | 17 | 4-layer brain, safety zones, Claude L3 |
| v2.1 | HARDWARE | ~4,500 | 18 | ESP32 fleet, OTA, hardware management |
| v2.2 | INDUSTRY | ~4,900 | 20 | Warehouse, factory, plugin architecture |
| v2.5 | CITYSCAPE | ~5,750 | 22 | Digital twin, vehicle fleet, testbed, site |
| v3.0 | PLATFORM | ~6,900 | 25 | SDK infra, spatial DB, auto-discovery |
| v3.1 | FEDERATION | ~7,900 | 26 | CRDT engine, federation mesh, gossip + anti-entropy, node roles |

### 2026-08 practical brush-up (v3.1, same codename)

- **Measurement**: distance now uses direct-path→first-echo Δt/2×c (device latency cancels); loopback calibration accepts up to 250 ms; Kalman seeds from first measurement; BURST no longer overlaps concurrent pings
- **Core loop**: fixed the mediation/Phase-Law 2-second timer that previously never fired; fixed an infinite re-render loop in the Midbrain embodiment check; sensor events throttled to 150 ms
- **PWA**: real `sw.js` + `manifest.webmanifest` + icons (installable, offline after first visit); CDN failure now shows an explicit error
- **Cerebrum**: correct Anthropic headers, user-supplied key UI, HTTP error surfacing, current model, LOCAL fallback without a key
- **Mobile UX**: 5 primary tabs + MORE expander, iOS permission banner moved above the fold, pinch-zoom re-enabled, first-visit demo, safe-area padding
- **Honesty**: SIM/EST badges on BLE/lux/thermal/tilt readouts, sim peers excluded from the Reality Index, cross-validator labeled as SIM comparison

---

## Reproducibility

All measurement sessions report sample count, mean, σ, CI95 (±1.96σ/√n), and a reproducibility grade: EXCELLENT (σ < 0.02), GOOD (σ < 0.05), FAIR (σ < 0.1), POOR (σ ≥ 0.1).

Acoustic accuracy depends on device speaker/mic geometry, room acoustics, and noise floor; treat sub-meter figures as indicative, and always run CALIBRATE per device.

---

## License

Source is publicly viewable at https://github.com/Fenom6/PHYSICAL-PING and deployed at https://fenom6.github.io/PHYSICAL-PING/. No open-source license is granted; all other rights reserved. For collaboration inquiries, open an issue.

---

*Physical Ping — pTCP/IP v3.1 FEDERATION*
*L0 Phase-Law v3 · L1 Midbrain · L2 Spatial Intelligence · L3 Cerebrum Claude API · HW ESP32 Fleet (SIM) · IND Plugin Arch · CITY Digital Twin · PLAT SDK JS/Py/Rust + Spatial MediationDB + Auto-Discovery · FED Mesh + CRDT*
*pTCP Protocol 2026*
