# PHYSICAL PING — pTCP v0.9 IPC

**Information Physical Connector · Spatial Mapping + BLE Mesh**

スマートフォンのセンサー群を統合し、物理空間の「情報接続性」をリアルタイムで定量化する実験的Webアプリケーション。音響ソナー＋電磁波＋RFスペクトラム＋NFC＋熱推定＋**WebXR Spatial Mapping＋BLE Mesh**による9次元空間プローブと、その統合指標である **Mediation Coefficient μ(x,t)** を算出する。

物理空間のための TCP/IP

---

## v0.9 新機能

### Spatial Mapping (WebXR / ARCore / ARKit)

WebXR Device API (`immersive-ar`) による空間マッピング。WebXR非対応環境ではルームジオメトリのリアルタイムシミュレーションで動作。

| 機能 | API | 説明 |
|---|---|---|
| 平面検出 | `plane-detection` | 床・天井・壁・テーブルの自動検出＋面積算出 |
| 深度センシング | `depth-sensing` | 深度バッファからポイントクラウド生成 |
| 空間アンカー | `anchors` | 永続的な参照点の配置と追跡 |
| メッシュ検出 | `mesh-detection` | 空間メッシュの頂点・三角形カウント |
| ヒットテスト | `hit-test` | レイキャストによる空間内のインタラクション |

表示機能:
- **3Dポイントクラウド**: アイソメトリック投影＋自動回転による点群＋平面のリアルタイム可視化
- **平面リスト**: orientation別分類（FLOOR/TABLE, CEILING, WALL）＋面積＋頂点数
- **アンカー管理**: 空間アンカーの配置＋座標表示
- **統計ダッシュボード**: 平面数、ポイント数、総面積、メッシュ頂点/三角形数、FPS
- **スキャンログ**: 時系列の空間マッピング進捗

シミュレーションモード:
- ルームジオメトリ（3-7m × 3-7m × 2.4-3.2m）の自動生成
- 家具表面（テーブル、棚）のランダム配置
- 表面近傍にクラスタリングされたポイントクラウド（800-1400点）
- 2秒間隔のリアルタイムパーターベーション＋新表面検出

### BLE Mesh Network

Web Bluetooth API / BLE Scanning API でBLEデバイスをスキャンし、RSSI距離推定とメッシュトポロジーを可視化する。

| 機能 | 説明 |
|---|---|
| デバイス検出 | BLEアドバタイズメントの受動的モニタリング |
| RSSI距離推定 | `d = 10^((txPower - RSSI) / (10×n))`, n=2 |
| メッシュトポロジー | RSSI近接度に基づく仮想メッシュリンク生成 |
| 動的更新 | デバイスの出現・消失・RSSI変動をリアルタイム追跡 |

表示機能:
- **メッシュトポロジーキャンバス**: 円形配置のノード＋リンク可視化（RSSI強度で中心/外周配置）
- **デバイスリスト**: 名前、RSSI、推定距離、RSSIバーグラフ
- **統計**: 検出デバイス数、平均RSSI、リンク数、メッシュ密度

シミュレーション:
- 4-12台のBLEデバイス（iPhone, Galaxy, AirPods, IoTセンサー等）
- RSSI: -45〜-95 dBm範囲でランダムウォーク
- 3秒間隔でデバイス出現/消失＋RSSI変動

---

## Mediation Coefficient v0.9 — 9次元

```
μ(x,t) = Σ wᵢ · dᵢ(x,t)

where dᵢ ∈ {acoustic, emField, photonic, kinetic, rfDensity, nfcField, thermal, spatial, bleMesh}

weights:
  acoustic   = 0.20  (音響反射率)
  emField    = 0.10  (電磁場密度)
  photonic   = 0.08  (光環境)
  kinetic    = 0.10  (運動安定性)
  rfDensity  = 0.12  (RF帯域占有率)
  nfcField   = 0.08  (NFC近接場強度)
  thermal    = 0.07  (熱環境安定性)
  spatial    = 0.15  (空間マッピング網羅度)    ← NEW
  bleMesh    = 0.10  (BLEメッシュ密度)         ← NEW
```

### Spatial 次元の算出

```
spatial = planeScore × 0.4 + areaScore × 0.3 + pointScore × 0.3

planeScore = min(1, planeCount / 10)
areaScore  = min(1, totalArea / 50)
pointScore = min(1, pointCloud.length / 500)
```

### BLE Mesh 次元の算出

```
bleMesh = deviceScore × 0.6 + meshDensity × 0.4

deviceScore = min(1, totalDevices / 10)
meshDensity = actualLinks / maxPossibleLinks
```

---

## プロトコルスタック v0.9

```
L6  SPACE PROFILE       空間分類・行動推奨・環境適応
L5  MEDIATION            μ(x,t) 9次元情報物理結合係数
L4  SENSOR FUSION        音響+EM+光+慣性+RF+NFC+熱+空間+BLE 統合
L3  ACOUSTIC SONAR       チャープ・相互相関
L3  EM FIELD             磁力計・環境光・加速度
L3  RF SPECTRUM          WebUSB SDR・周波数解析
L3  NFC FIELD            近接場検出・タグ読取
L3  THERMAL              CPU負荷・バッテリー・推定温度
L3  SPATIAL              WebXR 平面検出・深度・ポイントクラウド    ← NEW
L3  BLE MESH             Web Bluetooth・RSSI距離推定・メッシュ     ← NEW
L2  DEVICE HARDWARE      マイク・スピーカー・センサー・USB・NFC・AR
L1  PHYSICAL MEDIUM      音波・電磁波・光・慣性力・近接場・空間形状
```

---

## ブラウザ互換性 v0.9

| 機能 | Chrome (Android) | Safari (iOS) | Chrome (Desktop) | Firefox |
|---|---|---|---|---|
| Sonar | ✔ | ✔ | ✔ | ✔ |
| Magnetometer | ✔ (Sensor) | ✔ (Orientation) | — | ✔ |
| Ambient Light | ✔ (Sensor) | ✔ (Camera) | — | — |
| Motion | ✔ | ✔ (許可必要) | — | ✔ |
| RF Spectrum | ✔ (WebUSB) | ✘ (Sim) | ✔ (WebUSB) | ✘ (Sim) |
| NFC | ✔ (Web NFC) | ✘ (Sim) | ✘ (Sim) | ✘ (Sim) |
| Thermal | ✔ | ✔ (部分的) | ✔ | ✔ |
| **Spatial (WebXR)** | **✔ (ARCore)** | **✘ (Sim)** | **✘ (Sim)** | **✘ (Sim)** |
| **BLE Mesh** | **✔ (BT Scan)** | **✘ (Sim)** | **✔ (部分的)** | **✘ (Sim)** |

### WebXR 要件

- Chrome 79+ (Android, ARCore対応デバイス)
- HTTPS環境必須
- Features: `immersive-ar`, `plane-detection`, `hit-test`, `anchors`, `depth-sensing`
- シミュレーション: 全環境で自動フォールバック

### Web Bluetooth 要件

- Chrome 56+ (Android推奨)
- `requestLEScan()` (実験的) or `requestDevice()` (制限的)
- HTTPS環境必須

---

## 技術仕様 v0.9

| 項目 | 値 |
|---|---|
| サンプルレート (Sonar) | 44,100 Hz |
| リスニング窓 | 500 ms |
| ブランキング | 8 ms |
| 相関方式 | 正規化相互相関（NCC） |
| EM スキャン間隔 | 2,000 ms |
| RF スペクトラム bins | 256 |
| RF スキャン間隔 | 500 ms |
| NFC スキャンモード | 連続 / 2s間隔 (Sim) |
| 熱推定間隔 | 3,000 ms |
| **空間スキャン間隔** | **2,000 ms (Sim) / フレームレート (XR)** |
| **ポイントクラウド** | **800-1400 点 (Sim) / 深度バッファ依存 (XR)** |
| **BLE スキャン間隔** | **3,000 ms (Sim) / イベント駆動 (BT)** |
| **Mediation 次元数** | **9** |
| 履歴保持 | Sonar:64 / EM:32 / RF:32 / NFC:16 / Thermal:64 / Spatial:32 |

### 依存関係

- React 18.2.0（CDN）
- IBM Plex Mono（Google Fonts）
- **その他の外部依存なし**

---

## 使い方

```bash
# HTTPS必須
npx serve . --ssl

# localhost は例外的に http でも動作
python3 -m http.server 8000
```

### 各レイヤーの操作

1. **SONAR** — 信号選択 → PING / CONT で音響プローブ
2. **EM** — iOS許可 → 磁力計・光・加速度リアルタイム監視
3. **RF** — バンド選択 → SCAN でスペクトラム解析
4. **NFC/TH** — NFC SCAN + Thermal MONITOR
5. **SPATIAL** — START AR SESSION / START SIMULATION → 3Dポイントクラウド + 平面検出
6. **BLE** — START BLE SCAN → メッシュトポロジー + RSSI距離推定
7. **MED** — 9次元リングゲージ + レーダーチャート
8. **PROFILE** — 空間分類タグ + プロトコルスタック

---

## ファイル構成

```
index.html    ← 全機能を含む単一ファイル（~2,200行）
README.md     ← このファイル
```

ゼロビルド・ゼロインストール設計。

---

*pTCP v0.9 IPC | Spatial Mapping + BLE Mesh + 9D Mediation | Phase-Law Architecture*
