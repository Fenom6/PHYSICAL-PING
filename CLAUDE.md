# CLAUDE.md — Physical Ping (pTCP v3.1 FEDERATION)

This file provides guidance for AI assistants working on this codebase.

---

## Repository Overview

**Physical Ping** is a browser-based, zero-build-step spatial sensing and ranging platform that implements a novel **Physical Transport Control Protocol (pTCP)**. It fuses 11 independent physical-layer sensors (acoustic, RF, BLE, light, motion, magnetometer, geolocation, thermal, NFC, barometer, EM fingerprint) into a single **mediation coefficient** for sub-centimeter distance estimation.

The entire application is a **single monolithic file**: `index.html` (~7,700 lines). There is no build tool, no bundler, no package manager, and no server-side code.

---

## File Structure

```
PHYSICAL-PING/
├── index.html      # The entire application (~7,700 lines)
└── README.md       # Architecture docs, API reference, version history
```

There are no other source files, configuration files, test files, or build scripts.

---

## Technology Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 (loaded via CDN: `unpkg.com`) |
| Language | Vanilla JavaScript (ES6+, no TypeScript) |
| Styling | Inline `<style>` block in index.html |
| Audio | Web Audio API (`AudioContext`, `ScriptProcessorNode`, `AnalyserNode`) |
| Sensors | `getUserMedia`, `DeviceOrientationEvent`, `AmbientLightSensor`, `Geolocation` |
| Networking | WebRTC `RTCPeerConnection` + `BroadcastChannel` |
| Persistence | IndexedDB (via raw API, capped at 500 records) |
| Rendering | Canvas 2D API for all charts and visualizations |
| PWA | Inline base64-encoded Web App Manifest |
| Font | IBM Plex Mono (via Google Fonts CDN) |

**Key CDN dependencies (no npm):**
- `https://unpkg.com/react@18/umd/react.production.min.js`
- `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`

---

## Running the Application

```bash
# Option 1: Direct browser open (limited sensor access)
open index.html

# Option 2: Local HTTP server (recommended — required for full sensor/microphone access)
python3 -m http.server 8080
# Then visit: http://localhost:8080/index.html
```

**Browser requirements:**
- Chrome 90+ / Safari 15+ / Firefox 90+
- HTTPS context (or localhost) for microphone, geolocation, and orientation sensors
- Physical device preferred over emulator for sensor data

There are no `npm install`, `make`, or build steps required.

---

## Architecture

### 6-Layer Cognitive Stack

```
L3  CEREBRUM        — Claude API integration (LLM reasoning, natural language)
L2  SPATIAL INTEL   — Routing, Digital Twin, Vehicle Fleet management
L1  MIDBRAIN        — Anomaly detection, reflex gating, pattern matching
L0  PHASE-LAWS      — 12 governing physical laws + statistical auto-discovery
HW  HARDWARE        — ESP32 fleet management, BLE scanning, OTA updates
PLT PLATFORM        — SDK infrastructure, Spatial DB, Auto-Discovery engine
IND INDUSTRY        — Warehouse, factory, plugin architecture
CTY CITYSCAPE       — Digital Twin entities, vehicle tracking, testbed
```

### 26 Functional Tabs

| Group | Tabs |
|---|---|
| Core | `measure`, `precision`, `spectrum`, `peers`, `patent` |
| Visualization | `heatmap`, `timeline`, `dashboard`, `profiles` |
| Networking | `network`, `peers`, `memory`, `hardware` |
| Intelligence | `midbrain`, `intelligence`, `routing` |
| Industry | `warehouse`, `factory`, `plugins`, `hardware` |
| Cityscape | `cityscape`, `testbed`, `vehicle`, `site` |
| Platform | `sdk`, `spatialdb`, `autodiscovery` |
| Federation | `federation` |

---

## Code Conventions

### React Style
- **No class components.** All components are functional.
- React is accessed via the global `window.React` object as `var {useState, useRef, useCallback, useEffect, useMemo} = React;`
- JSX is **not used**. React elements are created with `h()` (an alias for `React.createElement`).
- Custom hooks follow the `use*` naming convention (e.g., `usePing`, `useMediation`).

```javascript
// Correct: createElement via h()
h('div', {className: 'sec'}, h('span', null, 'label'))

// Wrong: JSX is not supported (no transpiler)
// <div className="sec"><span>label</span></div>
```

### Variable Naming
- Short destructured state pairs: `var _r=useState(null),results=_r[0],setResults=_r[1];`
- Configuration constants are ALL_CAPS: `CFG`, `SIGS`, `CHIRP_BANDS`, `PKT`, `PKT_NAMES`
- Single-letter loop variables are fine: `i`, `j`, `k`, `t`
- Hook return objects use descriptive property names

### State Management
- All state lives inside React hooks — no external state library
- `useRef` for mutable values that should not trigger re-renders (audio contexts, timers, peer connections)
- `useCallback` for all event handlers and callbacks passed to child components

### CSS
- All CSS is in a single `<style>` block at the top of `index.html`
- Class names follow a short abbreviated BEM-like pattern: `.btn-ping`, `.btn-sm`, `.sec`, `.sts`, `.st`
- Color palette (cyberpunk theme):
  - Primary green: `#00ffaa`
  - Cyan: `#00ddff`
  - Yellow/warning: `#ffcc00`
  - Red/error: `#ff4466`
  - Background: `#0a0f14`
  - Muted text: `#8899aa`
- Animations: `fadeIn`, `pulse`, `glowPulse`, `nfcRipple`, `netPulse`, `scanLine`

### Signal Processing
- Chirp signal generation uses linear frequency sweep with Hann window apodization
- Cross-correlation (`xcorr`) detects echoes in audio capture buffers
- Noise floor estimated using 10th percentile of absolute values (not RMS)
- Kalman filter parameters: `kalmanQ: 0.08`, `kalmanR: 2.5`

---

## Global Configuration Object

```javascript
var CFG = {
  sr:             44100,   // Sample rate (Hz)
  listenMs:       800,     // Microphone listen duration
  bufSize:        256,     // ScriptProcessor buffer size
  blanking:       2,       // Blanking period (multiples of signal duration)
  maxThresh:      0.45,    // Max correlation threshold
  minConf:        0.003,   // Minimum confidence gate
  histMax:        128,     // Max history entries
  burstCount:     3,       // Pings per burst
  burstGap:       80,      // Gap between burst pings (ms)
  kalmanQ:        0.08,    // Kalman process noise
  kalmanR:        2.5,     // Kalman measurement noise
  rollingWindow:  12,      // Rolling average window
  outlierK:       2.2,     // Outlier rejection k-factor (σ)
  speedOfSound:   343.0,   // m/s at ~20°C
  loopbackMarginMs: 5,     // Loopback detection margin
  sigAmplitude:   0.85,    // Signal output amplitude
  maxLoopbackMs:  20,      // Max accepted loopback delay
  defaultLoopbackMs: 4,    // Default loopback if calibration unavailable
  tsMaxPoints:    1000     // Max time-series data points
};
```

---

## Signal Definitions

Seven acoustic signal types are defined in the `SIGS` object:

| ID | Type | Frequency Range | Duration |
|---|---|---|---|
| `chirp_pro` | chirp | 1→8 kHz | 20 ms |
| `chirp_mid` | chirp | 1.5→5 kHz | 18 ms |
| `chirp_low` | chirp | 500→2 kHz | 30 ms |
| `chirp_high` | chirp | 3→6 kHz | 15 ms |
| `chirp_wide` | chirp | 800→4 kHz | 25 ms |
| `pulse_2k` | tone | 2 kHz | 15 ms |
| `click` | click | ~2.5 kHz (FM) | 10 ms |

---

## Key Custom Hooks (Reference)

### Sensor Hooks
| Hook | Purpose |
|---|---|
| `usePing()` | Primary acoustic ranging — emits chirp, captures echo via cross-correlation |
| `useMultiChirp()` | Multi-band acoustic measurement (LOW/MID/HIGH simultaneously) |
| `useMag()` | Magnetometer / DeviceOrientation data |
| `useLight()` | Ambient light sensor |
| `useMotion()` | Accelerometer / gyroscope |
| `useGeo()` | Geolocation (lat/lng/altitude) |
| `useRF()` | RF spectrum estimation |
| `useThermal()` | Temperature estimation from environment |
| `useBLE()` | Bluetooth Low Energy device scanning |
| `useSP()` | Sensor permission management |
| `useEMFingerprint()` | Electromagnetic field fingerprinting |
| `useBLEPathLoss()` | BLE RSSI-to-distance estimation |

### Fusion & Intelligence Hooks
| Hook | Purpose |
|---|---|
| `useMediation()` | 11-dimensional sensor fusion → mediation coefficient |
| `usePhaseLaws()` | Phase-Law evaluation (12 built-in + auto-discovered) |
| `usePhaseAutoDiscovery()` | Statistical discovery of new phase laws |
| `useMidbrain()` | 4-layer cognitive processing pipeline |
| `useCerebrumAPI()` | Claude API integration for L3 reasoning |
| `useAnomalyDetector()` | Statistical anomaly detection |
| `usePrediction()` | Predictive distance modeling |
| `useAdaptiveThresholds()` | Dynamic noise-adaptive thresholding |
| `useDynamicWeights()` | Adaptive dimension weight calculation |

### Networking Hooks
| Hook | Purpose |
|---|---|
| `usePTCPNetwork()` | WebRTC peer-to-peer connection management |
| `useMultiPeer()` | BroadcastChannel local mesh (same device/LAN) |
| `useMultiHopRouting()` | TTL-based multi-hop packet routing |
| `useNetwork()` | Hybrid topology management |

### Persistence Hooks
| Hook | Purpose |
|---|---|
| `useSpatialMemory()` | IndexedDB spatial measurement store |
| `useAnchorStore()` | Named anchor point persistence |
| `useProfiles()` | Environment fingerprint profile management |
| `useSpatialMediationDB()` | Spatial query engine (composite B-tree index) |

### Domain / Industry Hooks
| Hook | Purpose |
|---|---|
| `useESP32Fleet()` | Hardware ESP32 device fleet management |
| `useVehicleFleet()` | Vehicle/asset real-time tracking |
| `useWarehouse()` | Warehouse zone/inventory management |
| `useFactory()` | Machine health monitoring |
| `useCityscape()` | Digital twin entity management |
| `useTestbed()` | Automated verification test suite |
| `usePluginRegistry()` | Plugin lifecycle (load/enable/disable) |
| `useSDKInfra()` | SDK code generation (21 API endpoints) |
| `useFederation()` | Multi-instance CRDT mesh synchronization |

### Utility Hooks
| Hook | Purpose |
|---|---|
| `useTimeSeries()` | Rolling time-series data accumulation |
| `usePerfMonitor()` | Performance metrics (FPS, memory, latency) |
| `usePWA()` | Progressive Web App install/update lifecycle |

---

## CRDT Infrastructure (v3.1)

The federation system uses conflict-free replicated data types:

| CRDT | Purpose |
|---|---|
| `GCounter` | Grow-only counter (peer message counts) |
| `PNCounter` | Positive/negative counter (inventory deltas) |
| `LWWRegister` | Last-write-wins register (configuration sync) |
| `ORSet` | Observed-remove set (peer membership) |
| `MVRegister` | Multi-value register (concurrent-write detection) |
| `VectorClock` | Causality tracking across instances |

Synchronization uses a **gossip protocol** with **anti-entropy repair**. Partition detection triggers automatic reconciliation.

---

## Networking Protocol (pTCP)

Custom packet structure with:
- Packet type enum: `PKT` object (DATA, ACK, SYN, FIN, PING, PONG, ROUTE, etc.)
- CRC32 checksums for integrity
- TTL-based multi-hop routing
- ICE server configuration for WebRTC NAT traversal
- QR code generation for out-of-band peer discovery

---

## Development Workflow

### Editing the Application
All changes are made directly to `index.html`. There is no compilation step.

1. Edit `index.html` in a text editor
2. Refresh the browser to see changes
3. Use browser DevTools console for debugging

### No Tests / No CI
There are no automated test files or CI/CD pipelines. The application has:
- An interactive **demo mode** (`DEMO_STEPS` array simulates a full measurement session)
- An interactive **testbed tab** (`useTestbed` hook) with built-in verification scenarios
- A **patent dataset tab** for measurement validation and reproducibility metrics

### Git Workflow
- The main development branch is `master`
- Commit messages follow a simple imperative style: `Update index.html`
- There are no PR conventions, linting rules, or commit hooks

### Making Changes to index.html
- The file is organized with section comment banners:
  ```javascript
  /* ═══════════════════════════════════════════════════════════ */
  /*  v1.x: SECTION NAME                                         */
  /* ═══════════════════════════════════════════════════════════ */
  ```
- New hooks should be added near functionally related existing hooks
- New CSS classes go in the `<style>` block, following the existing naming conventions
- New tabs require: a tab entry in the layer-tabs nav, a new `use*` hook, and a render function

---

## Important Constraints

1. **Single file only.** Do not split the application into multiple files. The zero-deployment single-file design is intentional and critical.

2. **No build tools.** Do not introduce npm, webpack, Vite, TypeScript, Babel, or any build step. The application must remain runnable by opening `index.html` directly.

3. **No JSX.** All React elements use `h()` (alias for `React.createElement`). Never write JSX.

4. **Browser APIs only.** No Node.js APIs, no server-side code. Everything runs in the browser.

5. **IndexedDB cap.** The spatial memory store is capped at 500 records. Auto-capture runs every 15 seconds. Do not raise this limit without considering mobile memory constraints.

6. **Sensor permissions.** `getUserMedia` (microphone) requires user interaction before the first call. Always handle `NotAllowedError` and `NotFoundError`.

7. **HTTPS required for sensors.** Microphone, geolocation, and device orientation require a secure context (HTTPS or localhost). Warn users when running from `file://`.

8. **No external state library.** All state is managed with React's built-in `useState`/`useReducer`/`useRef`. Do not introduce Redux, Zustand, Jotai, etc.

---

## Version History Summary

| Version | Lines | Major Addition |
|---|---|---|
| v1.0 | ~1,200 | Acoustic ping, basic mediation |
| v1.1 | ~1,800 | RF, BLE, NFC, EM fingerprinting |
| v1.2 | ~2,300 | Heatmap, timeline, dashboard |
| v1.3 | ~2,700 | SNR, cross-validation, multi-chirp |
| v1.4 | ~3,200 | WebRTC mesh, multi-hop routing, memory |
| v1.5 | ~3,600 | Midbrain cognitive layer, patent tab |
| v2.0 | ~4,200 | 4-layer brain, Claude L3 API |
| v2.1 | ~4,500 | ESP32 hardware fleet, OTA |
| v2.2 | ~4,900 | Warehouse, factory, plugin system |
| v2.5 | ~5,750 | Digital twin, vehicles, testbed |
| v3.0 | ~6,900 | SDK infrastructure, Spatial DB, Auto-Discovery |
| v3.1 | ~7,687 | CRDT federation mesh, multi-instance sync |

---

## License

Proprietary research software. See README.md for details.
