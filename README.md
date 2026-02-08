# PHYSICAL PING — pTCP v1.0 Full Phase-Law Architecture

**pTCP/IP for Physical Space · 11D Mediation · P2P Network · Phase-Law Engine**

物理空間のための TCP/IP 完全実装。11次元センシング＋P2Pデバイスメッシュ＋Phase-Law Engineによる情報物理結合アーキテクチャ。

---

## v1.0 新機能

### pTCP/IP Protocol Engine

物理空間における情報伝送プロトコルの完全実装。TCP/IPのハンドシェイク・パケット構造・フロー制御を物理空間に適用。

**パケットフォーマット:**
```
┌──────┬──────┬──────┬──────┬──────┐
│ VER  │ TYPE │ SEQ  │ SRC  │ DST  │
├──────┼──────┼──────┼──────┤      │
│ TS   │ TTL  │ CKSM │ PAYLOAD...  │
└──────┴──────┴──────┴─────────────┘
```

**パケットタイプ:**

| Type | Code | 説明 |
|---|---|---|
| SYN | 0x01 | 接続要求 |
| SYN_ACK | 0x02 | 接続応答 |
| ACK | 0x03 | 確認応答 |
| PING | 0x10 | ネットワークping |
| PONG | 0x11 | ping応答 |
| SENSOR_DATA | 0x20 | センサーデータ共有 |
| SPATIAL_SHARE | 0x21 | 空間データ共有 |
| ANCHOR_SHARE | 0x22 | 空間アンカー共有 |
| MEDIATION_BROADCAST | 0x30 | Mediation Coefficient ブロードキャスト |
| PROFILE_SYNC | 0x31 | 空間プロファイル同期 |
| PHASE_LAW_UPDATE | 0x40 | Phase-Law更新 |
| HEARTBEAT | 0x50 | 生存確認 |
| DISCONNECT | 0xFF | 切断 |

**トランスポート:**
- BroadcastChannel API（同一オリジン・リアルタイム・複数タブ間通信）
- シミュレーションピア（2-4台の仮想デバイス自動生成）
- 5秒間隔のHEARTBEAT＋Mediation共有

### Phase-Law Engine (Φ)

情報空間と物理空間の結合を記述する8つの法則体系。各法則がリアルタイムセンサーデータに基づいて評価される。

| ID | 法則名 | 評価次元 | 説明 |
|---|---|---|---|
| PL-001 | Acoustic Impedance Matching | acoustic | 音響インピーダンス整合則 |
| PL-002 | EM Field Continuity | emField | 電磁場連続則 |
| PL-003 | Photonic Channel Theorem | photonic | 光子チャネル定理 |
| PL-004 | Kinetic Stability Principle | kinetic | 運動安定性原理 |
| PL-005 | RF Spectral Density Law | rfDensity | RF帯域占有則 |
| PL-006 | Spatial Completeness Axiom | spatial | 空間完備性公理 |
| PL-007 | Mesh Connectivity Theorem | bleMesh | メッシュ接続定理 |
| PL-008 | Information-Physical Coupling | composite | 情報物理結合原理（主定理） |

各法則は `COUPLED` / `PARTIAL` / `DECOUPLED` のいずれかの状態に評価される。

### Multi-Device P2P Network

- **BroadcastChannel**: 同一オリジンの複数タブ/ウィンドウ間でリアルタイム通信
- **デバイス発見**: SYN/SYN-ACK/ACKハンドシェイクによる自動発見
- **Mediation共有**: 各デバイスが自身のμ(x,t)をネットワークにブロードキャスト
- **空間アンカー共有**: SPATIALタブで配置したアンカーをピアに送信
- **トポロジー可視化**: デバイスメッシュのリアルタイムグラフ描画
- **Protocol Monitor**: 全pTCPパケットのリアルタイムインスペクション

---

## Mediation Coefficient v1.0 — 11次元

```
μ(x,t) = Σ wᵢ · dᵢ(x,t)

where dᵢ ∈ {acoustic, emField, photonic, kinetic, rfDensity, nfcField,
             thermal, spatial, bleMesh, network, collaborative}

weights:
  acoustic      = 0.15
  emField       = 0.08
  photonic      = 0.06
  kinetic       = 0.08
  rfDensity     = 0.10
  nfcField      = 0.05
  thermal       = 0.05
  spatial       = 0.12
  bleMesh       = 0.08
  network       = 0.13  ← NEW: P2P接続性
  collaborative = 0.10  ← NEW: 協調計測カバレッジ
```

### Network 次元
```
network = peerScore × 0.6 + trafficScore × 0.4
peerScore = min(1, connectedPeers / 5)
trafficScore = min(1, receivedPackets / 50)
```

### Collaborative 次元
```
collaborative = avg(peer.mediation for peer in connectedPeers)
```

---

## pTCP/IP Protocol Stack v1.0

```
L9  APPLICATION         空間プロファイル・協調マッピング・環境適応
L8  pIP NETWORK         物理空間アドレッシング・ルーティング
L7  pTCP TRANSPORT      信頼性パケット配送・フロー制御
L6  PHASE-LAW ENGINE    情報物理結合則の評価・適用
L5  MEDIATION           μ(x,t) 11次元情報物理結合係数
L4  SENSOR FUSION       全11チャネル統合
L3  SONAR               チャープ・相互相関
L3  EM FIELD            磁力計・環境光・加速度
L3  RF SPECTRUM         スペクトラム解析
L3  NFC FIELD           近接場検出
L3  THERMAL             温度推定
L3  SPATIAL             平面検出・ポイントクラウド
L3  BLE MESH            RSSI距離推定・メッシュ
L3  NETWORK             P2Pデバイスメッシュ
L3  COLLABORATIVE       協調計測
L2  DEVICE HARDWARE     マイク・スピーカー・センサー
L1  PHYSICAL MEDIUM     音波・電磁波・光・慣性・空間形状
```

---

## タブ構成（11タブ）

| タブ | アイコン | 機能 |
|---|---|---|
| SONAR | ◎ | 音響ソナー（6信号タイプ・NCC・RTT） |
| EM | ⚡ | 磁力計・環境光・加速度・位置情報 |
| RF | 〜 | RFスペクトラム解析（5バンド） |
| NFC/TH | ◇ | NFC近接場＋熱推定 |
| SPATIAL | △ | WebXR空間マッピング（3Dポイントクラウド） |
| BLE | ◌ | BLEメッシュ（RSSI距離推定） |
| **NET** | **⬡** | **pTCP/IPネットワーク・ピア発見・トポロジー** |
| **PROTO** | **⟐** | **プロトコルモニター・パケットインスペクション** |
| **PHASE** | **Φ** | **Phase-Law Engine・8法則リアルタイム評価** |
| MED | ◈ | 11次元Mediation Coefficient |
| PROFILE | ◉ | 空間プロファイル＋プロトコルスタック |

---

## 使い方

```bash
# HTTPS推奨（センサーAPI要件）
npx serve . --ssl

# localhost は http でも動作
python3 -m http.server 8000
```

### マルチデバイス同期

1. 複数のブラウザタブで `index.html` を開く
2. 各タブの **NET** タブで「CONNECT NETWORK」
3. BroadcastChannel経由で自動的に相互発見
4. 各デバイスのMediation Coefficientがリアルタイム共有
5. **PROTO** タブでパケットフローを監視

---

## 技術仕様

| 項目 | 値 |
|---|---|
| サンプルレート | 44,100 Hz |
| リスニング窓 | 500 ms |
| 相関方式 | NCC |
| Mediation 次元数 | **11** |
| Phase-Law 数 | **8** |
| パケットタイプ数 | **12** |
| チェックサム | **CRC32 (0xEDB88320)** |
| BLE | **Web Bluetooth API + Simulation fallback** |
| ネットワーク方式 | BroadcastChannel + Simulation |
| QoS メトリクス | **RTT, Jitter, Packet Loss Rate** |
| HEARTBEAT間隔 | 5,000 ms |
| Mediation共有間隔 | 5,000 ms |
| データエクスポート | **JSON (計測データ・パケットログ)** |

### 依存関係

- React 18.2.0（CDN）
- IBM Plex Mono（Google Fonts）
- **その他の外部依存なし**

---

## ファイル構成

```
index.html    ← 全機能を含む単一ファイル
README.md     ← このファイル
```

ゼロビルド・ゼロインストール設計。

---

## バージョン履歴

| Ver | 機能 |
|---|---|
| v0.6 | Acoustic Sonar + Magnetometer + AmbientLight + Accelerometer + 4D Mediation |
| v0.8 | + RF Spectrum + NFC + Thermal + 7D Mediation |
| v0.9 | + WebXR Spatial Mapping + BLE Mesh + 9D Mediation |
| v1.0 | + pTCP/IP Protocol + P2P Network + Phase-Law Engine + 11D Mediation |
| **v1.0a** | **+ CRC32 Checksum + Web Bluetooth API + QoS Metrics + Data Export** |

### v1.0a 改善内容

| 改善 | 詳細 |
|---|---|
| **CRC32 Checksum** | ダミーchecksum→実CRC32 (polynomial 0xEDB88320)。全パケットの完全性検証。不正パケットをdrop |
| **Web Bluetooth API** | BLEシミュレーション→実Web Bluetooth APIスキャン対応。非対応環境はシミュレーションにフォールバック |
| **パケット検証** | 受信パケットのCRC32検証＋VALID/INVALID表示。プロトコルモニターにCRC列追加 |
| **ネットワークQoS** | ジッター計測・パケットロス率（‰）・RTT追跡・検証済パケット数 |
| **データエクスポート** | 計測データ・パケットログをJSON出力。論文・ベンチマーク・実証データに使用可能 |
| **Real/Sim区別** | BLEデバイス・ネットワークピアに REAL/SIM バッジを表示。データソースの明確化 |

---

*pTCP v1.0a | Full Phase-Law Architecture | 11D Mediation + P2P Network + Phase-Law Engine + CRC32 + Web Bluetooth + QoS + Export | pTCP/IP for Physical Space*
