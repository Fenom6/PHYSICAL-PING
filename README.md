# Physical Ping — pTCP/IP v3.0 PLATFORM

> A browser-based hybrid network measurement and environmental sensing platform that fuses acoustic ranging, electromagnetic field fingerprinting, and multi-device mesh networking into a unified 11-dimensional mediation framework.

---

## Abstract

Physical Ping introduces the **Physical Transport Control Protocol (pTCP)**, a novel approach to network diagnostics that bridges the gap between traditional ICMP-based measurement and real-world physical-layer sensing. The system computes a continuous **Mediation Coefficient μ(x,t)** across 11 orthogonal dimensions — ranging from acoustic propagation delay and RF signal strength to kinetic sensor data and photonic ambient readings — and governs system behavior through a set of empirically derived **Phase-Laws**. Version 3.0 extends the platform with SDK infrastructure, a spatial mediation database, and automated Phase-Law discovery through statistical analysis.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [11-Dimensional Mediation System](#11-dimensional-mediation-system)
- [Phase-Law Framework](#phase-law-framework)
- [v3.0 PLATFORM Systems](#v30-platform-systems)
- [Cognitive Architecture](#cognitive-architecture)
- [Hardware Integration](#hardware-integration)
- [Industry Deployment Modes](#industry-deployment-modes)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Data Export Formats](#data-export-formats)
- [Version History](#version-history)
- [License](#license)

---

## Architecture Overview

Physical Ping is a **single-file React SPA** (~6,900 lines) that runs entirely in the browser with zero server-side dependencies. The application is organized into **25 tabs** across six functional layers:

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
│  HW  Hardware         ESP32 fleet / BLE / Sensors           │
├─────────────────────────────────────────────────────────────┤
│  IND Industry         Warehouse / Factory / Plugin Arch     │
├─────────────────────────────────────────────────────────────┤
│  CITY Cityscape       Digital Twin / Vehicle Fleet / Site   │
├─────────────────────────────────────────────────────────────┤
│  PLAT Platform        SDK / Spatial DB / Auto-Discovery     │
└─────────────────────────────────────────────────────────────┘
```

### Tab Map (25 views)

| # | Tab | Layer | Description |
|---|-----|-------|-------------|
| 1 | `measure` | Core | Primary ping measurement with acoustic ranging |
| 2 | `precision` | Core | Statistical analysis, SNR, cross-validation |
| 3 | `spectrum` | Core | RF spectrum, BLE scan, NFC, thermal mapping |
| 4 | `peers` | Core | WebRTC/BroadcastChannel mesh network |
| 5 | `heatmap` | Viz | Spatial heatmap of mediation values |
| 6 | `timeline` | Viz | Time-series multi-dimension chart |
| 7 | `dashboard` | Viz | Aggregate statistics dashboard |
| 8 | `profiles` | Viz | Saved environment fingerprints |
| 9 | `network` | L2 | Hybrid network topology analyzer |
| 10 | `midbrain` | L1 | 4-layer cognitive processing pipeline |
| 11 | `intelligence` | L2 | Safety zones, KY alerting, worker tracking |
| 12 | `routing` | L2 | Phase-Law-aware adaptive routing |
| 13 | `memory` | L2 | IndexedDB persistent mediation history |
| 14 | `hardware` | HW | ESP32 fleet management and OTA |
| 15 | `warehouse` | IND | Zone tracking, forklift BLE monitoring |
| 16 | `factory` | IND | Acoustic FFT machine health monitoring |
| 17 | `plugins` | IND | Plugin registry and lifecycle management |
| 18 | `cityscape` | CITY | Digital Twin entity management |
| 19 | `testbed` | CITY | Verification test suite runner |
| 20 | `vehicle` | CITY | Vehicle fleet tracking and telemetry |
| 21 | `site` | CITY | Multi-site deployment management |
| 22 | `patent` | Core | Patent dataset collection and metrics |
| 23 | `sdk` | PLAT | Multi-language SDK code generation |
| 24 | `spatialdb` | PLAT | Spatial Mediation query engine |
| 25 | `autodiscovery` | PLAT | Statistical Phase-Law discovery |

---

## 11-Dimensional Mediation System

The core innovation is the **Mediation Coefficient μ(x,t)**, a composite scalar that fuses 11 independent physical measurements into a single environmental state descriptor.

### Dimension Definitions

| Dim | Key | Source | Range | Description |
|-----|-----|--------|-------|-------------|
| D0 | `acoustic` | Web Audio API | 0–1 | Sound propagation delay and ambient noise floor |
| D1 | `network` | RTT measurement | 0–1 | Network latency normalized to baseline |
| D2 | `spatial` | Geolocation API | 0–1 | GPS accuracy and position stability |
| D3 | `temporal` | High-res timer | 0–1 | Clock drift and timing jitter |
| D4 | `emField` | Magnetometer | 0–1 | Electromagnetic field strength and variance |
| D5 | `kinetic` | Accelerometer | 0–1 | Device motion energy |
| D6 | `photonic` | Ambient Light | 0–1 | Light level and spectral estimation |
| D7 | `barometric` | Pressure sensor | 0–1 | Atmospheric pressure relative to baseline |
| D8 | `thermal` | Estimated | 0–1 | Temperature proxy from sensor characteristics |
| D9 | `quantum` | Entropy pool | 0–1 | Random number generator entropy quality |
| D10 | `rf` | WiFi/BLE RSSI | 0–1 | Radio frequency signal density |

### Composite Calculation

```
μ(x,t) = Σ(wᵢ × dᵢ) / Σ(wᵢ)    where i ∈ [0,10]

wᵢ = user-adjustable weight per dimension (default: 1.0)
dᵢ = normalized dimension value at position x, time t
```

Each dimension carries a **source tag** indicating data provenance:

- `REAL` — Direct sensor reading
- `SIM` — Simulated/estimated value
- `EST` — Derived from correlated dimensions
- `N/A` — Sensor unavailable

The **Reality Index** is the ratio of REAL sources to total active dimensions, providing a confidence measure for the composite value.

---

## Phase-Law Framework

Phase-Laws are empirically derived rules that describe stable relationships between dimensions. They govern system behavior, trigger alerts, and provide predictive capability.

### Built-in Phase-Laws (12)

| ID | Name | Type | Formula |
|----|------|------|---------|
| PL-001 | Acoustic-Spatial Coupling | COUPLED | `\|acoustic - spatial\| < 0.3` |
| PL-002 | EM-RF Resonance | RESONANCE | `emField × rf > 0.15` |
| PL-003 | Temporal Stability Bound | STABILITY | `temporal > 0.4` |
| PL-004 | Kinetic-Barometric Inverse | INVERSE | `kinetic + barometric ∈ [0.6, 1.4]` |
| PL-005 | Photonic Floor | THRESHOLD | `photonic > 0.1` |
| PL-006 | Network Degradation Cascade | CASCADE | network → acoustic → spatial |
| PL-007 | Quantum Entropy Floor | THRESHOLD | `quantum > 0.3` |
| PL-008 | Thermal-Kinetic Correlation | COUPLED | `\|thermal - kinetic\| < 0.4` |
| PL-009 | RF Saturation Limit | LIMIT | `rf < 0.95` |
| PL-010 | Multi-Source Agreement | CONSENSUS | `≥ 6 sources agree within σ` |
| PL-011 | Composite Stability | STABILITY | `Δμ/Δt < 0.1 per second` |
| PL-012 | Reality Minimum | THRESHOLD | `realityIndex > 0.3` |

Each law evaluates to a state: `COUPLED`, `DECOUPLED`, `VIOLATED`, or `UNKNOWN`, with a continuous score in [0, 1].

### Phase-Law v3 Auto-Discovery

The v3.0 auto-discovery system detects **new Phase-Laws** from accumulated measurement data using statistical methods:

1. **Pearson Correlation Matrix** — Computes pairwise r-values across all 11 dimensions
2. **Unknown Pattern Detection** — Identifies r > 0.6 correlations not covered by existing laws
3. **Temporal/Lagged Analysis** — Detects time-delayed correlations at lag steps 1, 2, 3, 5
4. **Bimodal Distribution Detection** — Finds dimensions exhibiting two-cluster behavior (gap > 1.5σ)
5. **Candidate Generation** — Produces candidate laws with confidence scores and p-values

Requires minimum 20 samples. Significance threshold: p < 0.05.

---

## v3.0 PLATFORM Systems

### SDK Infrastructure

Generates complete, runnable client SDKs in three languages from a unified API surface definition.

**API Surface:** 21 endpoints across 7 resource groups:

| Group | Endpoints | Methods |
|-------|-----------|---------|
| Mediation | getMediation, getMediationHistory, triggerMeasurement | GET, POST |
| Phase-Laws | getPhaseLaws, getPhaseLaw, discoverLaws | GET, POST |
| Spatial DB | querySpatial, insertSpatial, updateSpatial, deleteSpatial | GET, POST, PUT, DELETE |
| Fleet | getESP32Fleet, getVehicleFleet | GET |
| Sensors | getSensors, triggerCalibration | GET, POST |
| Streams | streamMediation, streamPhaseLaws, streamAnomalies | WebSocket (SUB) |
| Cityscape | getCityscapeEntities, createEntity | GET, POST |

**Generated SDKs:**

- **JavaScript (ES6+)** — Async/await class with fetch API and WebSocket subscriptions. Published as `@physical-ping/sdk` on npm.
- **Python (3.8+)** — asyncio/aiohttp client with dataclasses and type hints. Dependencies: aiohttp>=3.9, pydantic>=2.0.
- **Rust** — reqwest/tokio client with serde serialization and thiserror. Full type safety with `MediationState`, `PhaseLaw`, `SpatialRecord` structs.

**Core Type System:** 8 shared types — `MediationState`, `PhaseLaw`, `SpatialRecord`, `MeasureResult`, `SensorState`, `DataSource`, `PhaseLawState`, `GeoPoint`.

### Spatial Mediation Database

An in-memory spatial database that stores μ(x,t) fingerprints with full 11-dimensional indexing.

**Storage:** Max 500 records, each containing:
- 11D fingerprint vector
- Composite μ value
- Source provenance array
- Reality index
- Space type classification
- Phase-Law state snapshot
- Geographic coordinates
- Tags and metadata

**Query Language:**

```
composite>0.5 space:office tag:meeting since:1h law:PL-001/COUPLED dim:acoustic/gt/0.5 near:<id>
```

| Operator | Syntax | Description |
|----------|--------|-------------|
| `composite` | `>`, `<`, `=` + value | Filter by composite μ value |
| `space` | `space:<type>` | Substring match on space classification |
| `tag` | `tag:<name>` | Match records containing tag |
| `reality` | `reality><value>` | Filter by reality index |
| `law` | `law:<id>/<state>` | Match Phase-Law ID and state |
| `dim` | `dim:<key>/<op>/<value>` | Filter by individual dimension |
| `near` | `near:<record_id>` | Fingerprint similarity > 0.7 |
| `since` | `since:<duration>` | Time window (s/m/h/d units) |

**Spatial Indexes:**
- `SPACE_TYPE` hash index — Aggregates by classification with average composite
- `COMPOSITE` B-tree — 10 buckets (0.0–1.0 in 0.1 increments)
- `DIM_STATS` — Per-dimension statistics (mean, std, min, max)

**Auto-Capture Mode:** Samples current μ(x,t) every 15 seconds.

### Auto-Discovery Engine

See [Phase-Law v3 Auto-Discovery](#phase-law-v3-auto-discovery) above.

**Discovered Law Types:**
- **Correlation** — Positive/negative correlation between dimension pairs (e.g., "Photonic-Network positive correlation", r=0.72)
- **Temporal** — Lagged prediction patterns (e.g., "Kinetic→Acoustic time-delay (2-step)", r=-0.58)
- **Bimodal** — Threshold-based regime detection (e.g., "RF Density bimodal distribution", μ_low=0.23, μ_high=0.78)

**Workflow:** Candidate → User confirms/rejects → Confirmed laws integrated into Phase-Law engine with live `evaluate(mediation)` functions.

---

## Cognitive Architecture

The system implements a **4-layer biologically-inspired processing pipeline**:

```
┌────────────────────────────────────────┐
│  L3: Cerebrum (Claude API)             │  Strategic reasoning, natural language
│  ↕ Salience queue                      │  analysis, predictive recommendations
├────────────────────────────────────────┤
│  L2: Spatial Intelligence              │  Routing, digital twin sync, safety
│  ↕ Attention gating                    │  zone management, fleet coordination
├────────────────────────────────────────┤
│  L1: Midbrain                          │  Anomaly detection, reflex arcs,
│  ↕ Reflex gating                       │  mode escalation (NOMINAL→EMERGENCY)
├────────────────────────────────────────┤
│  L0: Phase-Laws                        │  12+ governing laws, continuous
│  ↑ Raw sensor fusion                   │  evaluation, state transitions
└────────────────────────────────────────┘
```

**Operating Modes:** NOMINAL → ALERT → CRITICAL → EMERGENCY

Each layer processes information independently and communicates through structured queues. L0 operates at sensor-rate (2-second intervals), while L3 is invoked on-demand for complex reasoning tasks.

---

## Hardware Integration

### ESP32 Fleet Management

- Fleet-wide OTA firmware updates
- Per-device health monitoring (uptime, free heap, WiFi RSSI)
- BLE beacon broadcasting for spatial anchoring
- Configurable measurement intervals
- Device status: ONLINE / OFFLINE / ERROR / UPDATING

### Vehicle Fleet

- Real-time GPS tracking with heading and speed
- Battery/fuel level monitoring
- Geofence alerting
- Route history with waypoint logging

### Mobile Sensors

The application leverages mobile device sensors through standard Web APIs:

- **DeviceOrientation** — Magnetometer (EM field dimension), requires iOS permission prompt
- **DeviceMotion** — Accelerometer/gyroscope (kinetic dimension)
- **AmbientLightSensor** — Photonic dimension (Chrome only)
- **Geolocation** — Spatial dimension with accuracy tracking
- **Web Audio** — Acoustic dimension via microphone FFT analysis

---

## Industry Deployment Modes

### Warehouse Mode

- **Zone Tracking** — Named zones with capacity monitoring and fill-rate visualization
- **Inventory Management** — Item tracking with low-stock and out-of-stock alerts
- **Forklift BLE Monitoring** — Real-time position and activity status via BLE beacons

### Factory Mode

- **Passive Acoustic Monitoring** — Real-time microphone FFT analysis for machine health
- **Frequency Band Analysis** — Configurable band monitoring with threshold alerts
- **Machine State Classification** — Normal / Warning / Critical based on spectral signatures

### Plugin Architecture

Extensible plugin system with lifecycle management:

```javascript
{
  id: "plugin-id",
  name: "Plugin Name",
  version: "1.0.0",
  type: "builtin" | "external",
  status: "running" | "stopped" | "error",
  hooks: ["onMeasure", "onPhaseLawChange", "onAnomaly"],
  init: function() { ... },
  destroy: function() { ... }
}
```

---

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Browser (Chrome 90+, Safari 15+, Firefox 90+) |
| Framework | React 18 (CDN, no build step) |
| Rendering | `React.createElement` — no JSX transpilation |
| State Management | 41 custom React hooks |
| Persistence | IndexedDB (via raw API) |
| P2P Networking | WebRTC (RTCPeerConnection) + BroadcastChannel |
| Audio Processing | Web Audio API (AnalyserNode, FFT) |
| Visualization | Canvas 2D (charts, heatmaps, radar, 3D wireframe) |
| Typography | IBM Plex Mono (Google Fonts CDN) |
| Installability | PWA (Service Worker + Web App Manifest) |

### Dependencies (CDN)

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

No other external dependencies. The entire application is a single `.html` file.

---

## Getting Started

### Running Locally

```bash
# Simply open the HTML file in a browser
open physical-ping-v3_0.html

# Or serve via HTTP for full sensor access (HTTPS required for some APIs)
python3 -m http.server 8080
# Then navigate to https://localhost:8080/physical-ping-v3_0.html
```

### Sensor Permissions

On iOS devices, sensor access requires an explicit user gesture. The application displays a permission banner when DeviceOrientation/DeviceMotion APIs need authorization. Tap "GRANT SENSOR ACCESS" to enable EM field and kinetic dimensions.

### Recommended Environment

- HTTPS context (required for Geolocation, DeviceOrientation, and WebRTC)
- Physical device preferred over emulator (real sensor data)
- Multiple devices on the same network for mesh features
- ESP32 hardware for full fleet integration

---

## API Reference

### Core Hooks

| Hook | Purpose | Key State |
|------|---------|-----------|
| `usePing()` | Primary measurement engine | result, history, stats |
| `useMediation()` | 11D fusion + composite μ | composite, dimensions, reality |
| `usePhaseLaws(mediation)` | Phase-Law evaluation | laws[], violationCount |
| `useNetwork()` | WebRTC mesh management | peers[], topology |
| `useMultiPeer()` | BroadcastChannel mesh | connectedCount, messages |
| `useESP32Fleet()` | ESP32 device management | devices[], fleetStats |
| `useVehicleFleet()` | Vehicle tracking | vehicles[], fleetStats |
| `useCityscape()` | Digital twin entities | entities[], syncStatus |
| `useTestbed()` | Verification suite | scenarios[], suiteResult |
| `useSensorPermission()` | iOS sensor permissions | needsRequest, requestAll() |
| `useSDKInfra()` | SDK code generation | generate(), exportLog |
| `useSpatialMediationDB()` | Spatial query engine | query(), insert(), records |
| `usePhaseAutoDiscovery()` | Statistical discovery | scan(), discoveredLaws[] |

### Measurement Cycle

```
┌─────────┐    ┌──────────┐    ┌────────────┐    ┌──────────┐
│ Trigger │───▶│ Acoustic │───▶│ 11D Fusion │───▶│ Phase-Law│
│  Ping   │    │ Ranging  │    │  μ(x,t)    │    │  Eval    │
└─────────┘    └──────────┘    └────────────┘    └──────────┘
                                      │                │
                                      ▼                ▼
                                ┌────────────┐  ┌──────────┐
                                │ Spatial DB │  │ Midbrain │
                                │ Accumulate │  │ L1 Gate  │
                                └────────────┘  └──────────┘
```

The continuous measurement loop runs at **2-second intervals** when active, updating all 11 dimensions and re-evaluating all Phase-Laws.

---

## Data Export Formats

### Patent Dataset Export

```json
{
  "timestamp": "2026-02-23T12:00:00.000Z",
  "version": "3.0",
  "sessions": [
    {
      "id": "abc123",
      "started": "2026-02-23T11:00:00.000Z",
      "stats": {
        "n": 50,
        "mean": 0.623,
        "std": 0.0412,
        "ci95": 0.0114,
        "reproducibility": "EXCELLENT"
      },
      "measurements": [ ... ]
    }
  ]
}
```

### Snapshot Export

```json
{
  "timestamp": "2026-02-23T12:00:00.000Z",
  "mediation": 0.623,
  "phaseLaws": [
    { "id": "PL-001", "state": "COUPLED", "score": 0.85 }
  ],
  "history": [ ... ]
}
```

### Spatial DB Export

```json
{
  "records": [
    {
      "id": "rec-001",
      "name": "Office A",
      "fingerprint": {
        "acoustic": 0.42,
        "network": 0.78,
        "spatial": 0.65,
        ...
      },
      "composite": 0.623,
      "sources": ["REAL","REAL","REAL","SIM",...],
      "reality": 0.72,
      "spaceType": "office",
      "tags": ["meeting", "floor-3"],
      "timestamp": "2026-02-23T12:00:00.000Z"
    }
  ]
}
```

---

## Version History

| Version | Codename | Lines | Tabs | Key Additions |
|---------|----------|-------|------|---------------|
| v1.0 | CORE | ~1,200 | 4 | Basic ping, acoustic ranging, mediation |
| v1.1 | SPECTRUM | ~1,800 | 7 | RF spectrum, BLE, NFC, EM fingerprinting |
| v1.2 | VISUAL | ~2,300 | 10 | Heatmap, timeline, dashboard, profiles |
| v1.3 | PRECISION | ~2,700 | 11 | SNR, cross-validation, quality metrics |
| v1.4 | NETWORK | ~3,200 | 13 | WebRTC mesh, hybrid topology, memory |
| v1.5 | APPLICATION | ~3,600 | 15 | Midbrain, intelligence, routing, patent |
| v2.0 | INTELLIGENCE | ~4,200 | 17 | 4-layer brain, safety zones, Claude L3 |
| v2.1 | HARDWARE | ~4,500 | 18 | ESP32 fleet, OTA, hardware management |
| v2.2 | INDUSTRY | ~4,900 | 20 | Warehouse, factory, plugin architecture |
| v2.5 | CITYSCAPE | ~5,750 | 22 | Digital twin, vehicle fleet, testbed, site |
| v3.0 | PLATFORM | ~6,900 | 25 | SDK infra, spatial DB, auto-discovery |

---

## Research Applications

Physical Ping is designed to support research in the following domains:

- **Indoor Positioning Systems (IPS)** — Acoustic ranging + EM fingerprinting fusion for sub-meter positioning without dedicated infrastructure.
- **Environmental Sensing** — Continuous multi-modal environmental characterization using commodity mobile devices.
- **Network Quality of Experience (QoE)** — Correlating physical-layer conditions with application-layer network performance.
- **Edge Computing** — Distributed measurement across ESP32 mesh networks with local mediation computation.
- **Digital Twin Validation** — Real-time physical measurement integrated with digital twin entity models.
- **Predictive Maintenance** — Factory acoustic FFT analysis for early detection of mechanical degradation.
- **Occupational Safety** — Zone-based worker tracking with KY (Kiken Yochi / hazard prediction) alerting.

---

## Reproducibility

### Patent Metrics (v3.0 Targets)

| Metric | Target | Method |
|--------|--------|--------|
| Acoustic Precision (< 1m) | ± 3 cm | Cross-correlation peak detection |
| Reality Index | > 70% | Sensor availability ratio |
| Concurrent Peers | 5+ devices | WebRTC + BroadcastChannel mesh |
| ESP32 Fleet | 3+ online | BLE/WiFi fleet management |
| Vehicle Fleet | 3+ tracked | GPS telemetry integration |
| Digital Twin | LIVE sync | Entity state synchronization |
| Testbed Score | 80%+ | Automated verification suite |
| SDK Endpoints | 20+ | API surface definition |
| Spatial DB Records | 50+ | Auto-capture accumulation |
| Auto-Discovered Laws | 3+ | Statistical pattern detection |

### Statistical Reporting

All measurement sessions report:
- Sample count (n)
- Mean (μ) and standard deviation (σ)
- 95% confidence interval (CI95 = ± 1.96 × σ / √n)
- Reproducibility grade: EXCELLENT (σ < 0.02), GOOD (σ < 0.05), FAIR (σ < 0.1), POOR (σ ≥ 0.1)

---

## License

Proprietary research software. All rights reserved.

For academic collaboration inquiries, please contact the development team.

---

*Physical Ping — pTCP/IP v3.0 PLATFORM*
*L0 Phase-Law v3 · L1 Midbrain · L2 Spatial Intelligence · L3 Cerebrum Claude API · HW ESP32 Fleet · IND Plugin Arch · CITY Digital Twin + Vehicle Fleet · PLAT SDK JS/Py/Rust · Spatial MediationDB · Phase-Law Auto-Discovery*
*pTCP Protocol 2026*
