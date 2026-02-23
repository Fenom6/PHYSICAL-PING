# Physical Ping — pTCP/IP v2.5 CITYSCAPE

**物理空間ネットワーク測定プラットフォーム — 都市規模デジタルツイン統合**

---

## 概要

Physical Pingは、音響チャープ測距・電磁場指紋・BLEメッシュ・ESP32常設ノード・車載/ロボット/ドローンを統合し、物理空間のネットワーク特性をリアルタイムで11次元計測するWebアプリケーションである。v2.5 CITYSCAPEでは、建物内から都市空間へとスケールを拡大し、デジタルツイン統合・テストベッド実証・移動体フリート管理を実現した。

```
アーキテクチャスタック:
┌─────────────────────────────────────────────────────┐
│  CITY Layer   デジタルツイン + Vehicle Fleet (v2.5)   │
├─────────────────────────────────────────────────────┤
│  IND Layer    倉庫/工場 + プラグインアーキテクチャ (v2.2) │
├─────────────────────────────────────────────────────┤
│  HW Layer     ESP32 Fleet + Hybrid Network (v2.1)    │
├─────────────────────────────────────────────────────┤
│  L3 大脳      Claude API — 自然言語空間推論           │
├─────────────────────────────────────────────────────┤
│  L2 空間知能   予測 / 記憶 / 異常検知 (v2.0)         │
├─────────────────────────────────────────────────────┤
│  L1 中脳      Salience Filter + Reflex Gate (v1.5)   │
├─────────────────────────────────────────────────────┤
│  L0 小脳      Phase-Law v2 — 12法則 (v1.0–1.3)      │
└─────────────────────────────────────────────────────┘
```

---

## 技術仕様

| 項目 | 値 |
|------|-----|
| 総行数 | 5,752行 (単一HTMLファイル) |
| React | 18.2.0 (CDN, `createElement` ベース) |
| 計測次元 | 11次元 (Acoustic / EM / Photonic / Kinetic / RF / NFC / Thermal / Spatial / BLE / Network / Collaborative) |
| Phase-Law | 12法則 (PL-001 〜 PL-012) |
| タブ数 | 22タブ |
| 対応移動体 | 車載 (OBD-II) / 自律ロボット / ドローン |

---

## システムアーキテクチャ

### 11次元仲介システム (Mediation System)

物理空間の状態を11の独立次元で捕捉し、重み付き仲介係数 μ(x,t) を算出する。各次元には信号源ステータス (`real` / `est` / `sim` / `na`) が付与され、Reality Indexとして実センサー利用率を定量化する。

```
μ(x,t) = Σ wᵢ · dᵢ(x,t) / Σ wᵢ
       i∈{acoustic, em, photonic, kinetic, rf, nfc, thermal, spatial, ble, network, collab}
```

各次元の信号源:

| 次元 | Real (実測) | Est (推定) | Sim (模擬) |
|------|------------|-----------|-----------|
| Acoustic | マイクチャープ測距 | — | ランダム生成 |
| EM Field | Magnetometer API | DeviceOrientation | ランダム生成 |
| Photonic | AmbientLightSensor | 時刻ベース推定 | ランダム生成 |
| Kinetic | DeviceMotion API | — | ランダム生成 |
| RF Density | Web NFC / BLE | — | ランダム生成 |
| NFC Field | Web NFC API | — | ランダム生成 |
| Thermal | BLE温度計 | CPU負荷推定 | ランダム生成 |
| Spatial | Geolocation API | — | ランダム生成 |
| BLE Mesh | Web Bluetooth | — | ランダム生成 |
| Network | BroadcastChannel / WebRTC | — | 模擬ピア |
| Collaborative | マルチピア合意 | — | — |

### Phase-Law フレームワーク (12法則)

物理空間の整合性を検証する12の法則。各法則は `pass` / `marginal` / `fail` を返す。

| ID | 法則名 | 検証内容 |
|----|--------|---------|
| PL-001 | Acoustic-Spatial Coupling | 音響距離と空間位置の整合 |
| PL-002 | EM Continuity | 電磁場の連続性 |
| PL-003 | Spectral Openness | 光環境の整合性 |
| PL-004 | Kinetic Stability | 運動状態の安定性 |
| PL-005 | RF Density | RF環境の密度評価 |
| PL-006 | Sensor Completeness | センサー網羅率 |
| PL-007 | Network Connectivity | ネットワーク接続性 |
| PL-008 | Thermal-Photonic Coupling | 熱・光の相関 |
| PL-009 | Cross-Modal Coherence | クロスモーダル整合 |
| PL-010 | Spatial Consistency | 空間的一貫性 |
| PL-011 | Temporal Stability | 時間的安定性 |
| PL-012 | Environmental Context | 環境文脈の整合性 |

### 4層知能アーキテクチャ

```
L3 大脳 (Cerebrum)     Claude API による自然言語空間推論
   ↑ 意味的問い合わせ
L2 空間知能 (Intelligence)  予測エンジン / 空間記憶 / 異常検知
   ↑ フィルタ済みイベント
L1 中脳 (Midbrain)     Salience Filter + Reflex Gate
   ↑ 生データフロー
L0 小脳 (Cerebellum)   Phase-Law v2 評価 + 11次元仲介
```

動作モード: `NOMINAL` → `ALERT` → `CRITICAL` → `EMERGENCY`

---

## v2.5 新機能

### 1. CITYSCAPE — デジタルツイン統合

建物内測定から都市全体へスケールを拡張するデジタルツイン基盤。

**エンティティタイプ:**
- `building` — 建物 (センサー配置、環境データ)
- `street` — 道路 (交通量、RF環境)
- `zone` — 計測ゾーン / 排除ゾーン
- `intersection` — 交差点
- `park` — 公園・緑地
- `utility` — インフラ設備

**8レイヤー可視化:**

| レイヤー | 内容 |
|---------|------|
| buildings | 建物フットプリント + 窓灯表示 |
| streets | 道路網 |
| sensors | ESP32 + モバイルセンサーオーバーレイ |
| vehicles | 車載 / ロボット / ドローン位置 |
| drones | ドローン専用トラッキング |
| heatmap | 環境ヒートマップ |
| rf_coverage | RF カバレッジマップ |
| acoustic_map | 音響環境マップ |

**対応フォーマット:**
- GeoJSON / KML / CSV座標 (現行対応)
- 3D Tiles / CityGML (v2.6予定)
- Project PLATEAU 国土交通省3D都市モデル (v2.6予定)

**フック: `useCityscape(mediation, espFleet, vehicleFleet)`**

```javascript
// 主要API
cityscape.addEntity(type, name, lat, lng, meta)  // エンティティ追加
cityscape.startSync()                             // リアルタイム同期開始
cityscape.stopSync()                              // 同期停止
cityscape.toggleLayer(layerName)                  // レイヤー表示切替
cityscape.seedDemo()                              // デモデータ生成
```

### 2. TESTBED — テストベッド実証

定量的なシステム検証を自動化するベンチマークスイート。

**10テストシナリオ:**

| ID | テスト名 | 合格基準 |
|----|---------|---------|
| TB-001 | 音響精度ベンチマーク | ±3cm @ 1m |
| TB-002 | EM指紋再現性 | similarity > 0.85 |
| TB-003 | BLEパスロス校正 | ±15% @ 5m |
| TB-004 | マルチチャープ帯域一致 | agreement > 0.80 |
| TB-005 | Phase-Law適合性 | 12/12 pass |
| TB-006 | ESP32フリート応答 | < 100ms avg |
| TB-007 | P2Pメッシュスループット | > 500 msg/s |
| TB-008 | 車載OBD-II統合 | 5 PIDs/sec |
| TB-009 | ドローン高度補正 | ±5cm @ 10m alt |
| TB-010 | デジタルツイン同期 | < 200ms sync |

**コンプライアンスチェック (7項目):**
- Phase-Law 12/12 達成
- Reality Index > 70%
- ESP32 Fleet ≥ 3台
- μ(x,t) > 0.3
- History ≥ 10 samples
- SNR > 15dB avg
- Noise Floor < -40dBFS

**A/Bテスト環境:** 異なるチャープ設定やセンサー構成を統計的に比較可能。p値算出による有意差検定。

**フック: `useTestbed(mediation, phaseLaws, espFleet, history)`**

```javascript
testbed.runAll()                   // 全シナリオ実行
testbed.runScenario(idx)           // 個別シナリオ実行
testbed.runComplianceCheck()       // コンプライアンス判定
testbed.createABTest(nameA, nameB) // A/Bテスト作成
```

### 3. VEHICLE — 車載/ロボット/ドローン

移動体プラットフォームによる広域・動的計測。

**3タイプの移動体:**

| タイプ | テレメトリ | 特殊機能 |
|-------|----------|---------|
| Car (車載) | 速度, RPM, GPS, 信号強度, バッテリー | OBD-II BLE統合 (rpm, speed, coolantTemp, fuelLevel, engineLoad) |
| Robot (ロボット) | 速度, 方位, GPS, 信号強度, バッテリー | ウェイポイント自律巡回 |
| Drone (ドローン) | 速度, 高度, GPS, 信号強度, バッテリー | 高度補正音響測定, 高度モニター可視化 |

**ミッション管理:**
- ウェイポイントベース経路計画
- リアルタイム進捗トラッキング
- 各ウェイポイントでの自動計測記録
- ミッション完了判定

**自律スケジューリング:**
- cron式定期測定 (例: `*/30 * * * *` — 30分毎)
- 車両単位のスケジュール管理
- 自動ミッション起動

**フック: `useVehicleFleet(mediation, espFleet)`**

```javascript
vehicleFleet.addVehicle(type, name, config)       // 車両追加
vehicleFleet.startMission(vehicleId, waypoints)    // ミッション開始
vehicleFleet.addSchedule(vehicleId, name, cron)    // スケジュール登録
vehicleFleet.seedDemoFleet()                       // デモフリート生成
```

---

## 音響測距エンジン

### チャープ信号

| 信号 | 帯域 | 持続時間 |
|------|------|---------|
| CHIRP PRO | 1–5 kHz | 30ms |
| CHIRP MID | 1.5–2.5 kHz | 20ms |
| CHIRP LOW | 500–1.5 kHz | 30ms |
| CHIRP HIGH | 3–6 kHz | 15ms |
| CHIRP WIDE | 800–4 kHz | 25ms |
| PULSE 2kHz | 2 kHz | 15ms |
| CLICK | 符号化 | 10ms |

### マルチチャープ測距

3帯域同時測定による精度向上:
- LOW: 500–2000 Hz / 35ms
- MID: 2000–6000 Hz / 25ms
- HIGH: 6000–12000 Hz / 15ms

帯域間一致性 (Band Agreement) と重み付き平均距離を算出。

### 信号処理パイプライン

```
マイク入力 → 相互相関 (xcorr) → 放物線補間 (parabolic peak)
   → ノイズフロア推定 → SNR算出 → 適応閾値
   → カルマンフィルタ → ロバスト統計 (MAD) → 距離推定
```

```
距離 d = (Δt × v_sound) / 2
v_sound = 331.3 + 0.606 × T[°C]
```

---

## ネットワーキング

### ハイブリッドネットワーク

| プロトコル | 用途 | 範囲 |
|-----------|------|------|
| BroadcastChannel | 同一ブラウザ間メッシュ | 同一オリジン |
| WebRTC (P2P) | クロスデバイス接続 | インターネット |
| ESP-NOW | ESP32間近距離通信 | ~200m |
| WiFi (MQTT) | ESP32→クラウドブリッジ | LAN/WAN |
| LoRa | 長距離低帯域 | ~10km |
| BLE Mesh | 近距離デバイスメッシュ | ~50m |

### pTCPパケット構造

```javascript
{
  src: DEVICE_ID,     // 送信元ID
  dst: '*',           // 宛先 ('*' = ブロードキャスト)
  type: PKT_TYPE,     // SYN, SYN_ACK, DATA, HEARTBEAT, ACK
  seq: sequence_num,  // シーケンス番号
  payload: {...},     // ペイロード
  checksum: CRC32,    // 完全性検証
  ttl: 5              // マルチホップTTL
}
```

---

## ESP32 ハードウェアレイヤー

### ノードタイプ

| タイプ | 役割 | センサー |
|-------|------|---------|
| Sensor | 環境計測 | 温度/湿度/気圧/音響/EM/照度 |
| Gateway | ブリッジ | WiFi/MQTT/LoRa |
| Relay | メッシュ中継 | ESP-NOW/BLE |
| Anchor | 三辺測量基点 | 固定位置座標 |

### ファームウェア

```c
// ESP32ファームウェア概要
void setup() {
    initSensors();       // BME280, INMP441, HMC5883L, BH1750
    initESPNOW();        // ESP-NOW mesh
    initBLE();           // BLE advertising
    initMQTT();          // MQTT publish
}

void loop() {
    readSensors();       // 500ms interval
    publishMQTT();       // ptcp/v2.5/{node_id}/sensors
    meshRelay();         // ESP-NOW relay
}
```

---

## 産業モード

### 倉庫モード (v2.2)

- ゾーン管理 (受入/保管/出荷/冷蔵)
- ゾーン内在庫密度トラッキング
- フォークリフトBLEビーコン監視
- ピッキングキュー管理
- 温度・湿度アラート

### 工場モード (v2.2)

- パッシブ音響モニタリング (マイクFFTリアルタイム分析)
- 機械健全性推定 (周波数パターンから異常検知)
- 予知保全スケジューリング
- 生産ラインモニタリング

---

## タブ一覧 (22タブ)

| # | タブ | バージョン | 機能 |
|---|------|----------|------|
| 1 | MEASURE | v1.0 | 音響チャープ測距 |
| 2 | PRECISION | v1.3 | マルチチャープ/品質スコア |
| 3 | SPECTRUM | v1.0 | RF帯域スペクトル |
| 4 | PEERS | v1.0 | P2Pピア管理 |
| 5 | HEATMAP | v1.2 | 空間ヒートマップ |
| 6 | TIMELINE | v1.2 | 時系列チャート |
| 7 | DASHBOARD | v1.2 | 統合ダッシュボード |
| 8 | PROFILES | v1.2 | 環境プロファイル保存/比較 |
| 9 | NETWORK | v1.0 | メッシュネットワーク |
| 10 | MIDBRAIN | v1.5 | 中脳 Salience Filter |
| 11 | INTELLIGENCE | v2.0 | 空間知能 (予測/異常検知) |
| 12 | ROUTING | v2.0 | マルチホップルーティング |
| 13 | MEMORY | v2.0 | 空間記憶データベース |
| 14 | HARDWARE | v2.1 | ESP32フリート管理 |
| 15 | WAREHOUSE | v2.2 | 倉庫モード |
| 16 | FACTORY | v2.2 | 工場モード |
| 17 | PLUGINS | v2.2 | プラグインアーキテクチャ |
| 18 | **CITYSCAPE** | **v2.5** | **デジタルツイン統合** |
| 19 | **TESTBED** | **v2.5** | **テストベッド実証** |
| 20 | **VEHICLE** | **v2.5** | **車載/ロボット/ドローン** |
| 21 | SITE | v1.5 | SiteSense 空間安全監視 |
| 22 | PATENT | v1.5 | 特許データ収集 |

---

## 使用方法

### 基本起動

ブラウザでHTMLファイルを直接開く (サーバー不要)。PWAとしてホーム画面に追加可能。

```bash
# ローカルサーバーで起動する場合
python -m http.server 8080
# → http://localhost:8080/physical-ping-v2_5.html
```

### 推奨ブラウザ

| ブラウザ | 対応状況 |
|---------|---------|
| Chrome (Android) | 全機能対応 (Web Bluetooth, Web NFC) |
| Chrome (Desktop) | BLE/NFC以外対応 |
| Safari (iOS) | DeviceMotion要許可、BLE/NFC非対応 |
| Firefox | BLE/NFC非対応、他は対応 |

### クイックスタート

1. ファイルを開く
2. DEMOボタンでウォークスルーを実行
3. MEASUREタブで「PING」をタップ → 音響測距開始
4. CITYSCAPEタブで「DEMO SEED」→ 都市データ生成
5. VEHICLEタブで「DEMO FLEET」→ 移動体フリート生成
6. TESTBEDタブで「RUN ALL」→ 全シナリオ実行

### センサー権限

iOS/Safariでは以下の権限を明示的にリクエストする必要がある:
- DeviceOrientation (EM Field用)
- DeviceMotion (Kinetic用)
- Microphone (Acoustic用)
- Geolocation (Spatial用)

---

## v2.5 成功指標

| 指標 | 目標値 |
|------|-------|
| 音響精度 1m以内 | ±3cm |
| Reality Index | 70%+ |
| 同時接続ピア | 5台+ |
| ESP32 Fleet | 3台+ |
| Vehicle Fleet | 3台+ |
| Digital Twin | LIVE |
| Testbed Score | 80%+ |
| DT Entities | 5+ |

---

## バージョン履歴

| バージョン | コードネーム | 主要追加 |
|-----------|------------|---------|
| v1.0 | — | 11次元仲介、Phase-Law、音響測距 |
| v1.2 | VISUALIZATION | 時系列、ヒートマップ、プロファイル |
| v1.3 | PRECISION | マルチチャープ、EM指紋、BLEパスロス |
| v1.5 | APPLICATION | 4層知能、SiteSense、特許データ |
| v2.0 | INTELLIGENCE | 予測、空間記憶、異常検知、マルチホップ |
| v2.1 | HARDWARE | ESP32 Fleet、ハイブリッドネットワーク |
| v2.2 | INDUSTRY | 倉庫/工場モード、プラグイン |
| **v2.5** | **CITYSCAPE** | **デジタルツイン、テストベッド、車載/ロボット/ドローン** |

---

## 依存関係

| ライブラリ | バージョン | 用途 |
|-----------|----------|------|
| React | 18.2.0 | UI フレームワーク |
| ReactDOM | 18.2.0 | DOM レンダリング |
| LZ-String | 1.5.0 | データ圧縮 |
| QR Code | (内蔵) | WebRTC接続用QR生成 |

外部サーバー・ビルドツール不要。単一HTMLファイルで完結。

---

## ファイル構成

```
physical-ping-v2_5.html    # 全ソース (5,752行)
├── <style>                # CSS (430行, v1.0〜v2.5全スタイル)
├── <script> QR Code       # QRコード生成ライブラリ
└── <script> Main          # React アプリケーション
    ├── 設定 (CFG, SIGNALS, CHIRP_BANDS)
    ├── 信号処理 (genSignal, xcorr, findLoopbackMs)
    ├── フィルタ (KalmanFilter, RollingStats)
    ├── カスタムフック (38個)
    │   ├── useMag, useLight, useMotion, useGeo     # センサー
    │   ├── useRF, useBLE, useThermal               # 環境
    │   ├── usePTCPNetwork, useMultiPeer             # ネットワーク
    │   ├── useMultiChirp, useEMFingerprint          # 精密測定
    │   ├── useMidbrain, useCerebrumAPI              # 知能層
    │   ├── useESP32Fleet, useHybridNetwork          # ハードウェア
    │   ├── useWarehouse, useFactory                 # 産業
    │   ├── useCityscape                             # デジタルツイン (v2.5)
    │   ├── useTestbed                               # テストベッド (v2.5)
    │   └── useVehicleFleet                          # 移動体 (v2.5)
    ├── キャンバス描画 (TopologyCanvas, CityCanvas等)
    └── App コンポーネント (22タブ)
```

---

## 研究応用

### 適用領域

- **スマートシティ:** 都市環境の多次元センシングとデジタルツイン構築
- **インフラ監視:** 音響パッシブモニタリングによる構造物健全性評価
- **屋内測位:** BLE + 音響ハイブリッド測位の精度検証
- **IoTテストベッド:** ESP32メッシュネットワークの性能評価
- **自律移動体:** ドローン/ロボットによる広域環境計測自動化
- **車載テレマティクス:** OBD-II統合による走行中リアルタイム環境測定
- **予知保全:** FFT音響分析による機械異常の早期検出

### 引用

本ソフトウェアを研究に使用する場合は、以下の情報を記載してください:

```
Physical Ping — pTCP/IP v2.5 CITYSCAPE
物理空間ネットワーク測定プラットフォーム
Phase-Law Architecture v2.5
https://github.com/[repository]
```

---

## ライセンス

研究・教育目的での使用を想定。

---

*pTCP/IP v2.5 CITYSCAPE — Phase-Law Architecture — 2026*
