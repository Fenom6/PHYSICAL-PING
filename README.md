# PHYSICAL PING — pTCP v1.0a

**pTCP/IP for Physical Space · 11D Mediation · P2P Network · Phase-Law Engine**

物理空間のための TCP/IP。  
11次元センシング＋P2Pデバイスメッシュ＋Phase-Law Engineによる、情報と物理の結合アーキテクチャ。

```
index.html    ← 全機能を含む単一ファイル
README.md     ← このファイル
```

ゼロビルド・ゼロインストール。ブラウザで開くだけで動作する。

---

## What is pTCP?

TCP/IPが情報空間にパケット配送の秩序をもたらしたように、pTCP（Physical TCP）は物理空間に情報物理結合の秩序をもたらす。

スマートフォンが持つ11種のセンサーチャネル（音響・電磁場・光・慣性・RF・NFC・熱・空間形状・BLE・ネットワーク・協調計測）をリアルタイムに統合し、「いま自分がいる物理空間が、情報空間とどの程度結合しているか」を単一の係数 **μ(x,t)** で記述する。

pTCPの問いは「この空間のWiFi強度はいくつか」ではない。  
**「この空間は、情報と物理がどの程度つながっているか」** である。

---

## Quick Start

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

## Architecture

### Protocol Stack

```
L9  APPLICATION         空間プロファイル・協調マッピング・環境適応
L8  pIP NETWORK         物理空間アドレッシング・ルーティング
L7  pTCP TRANSPORT      信頼性パケット配送・フロー制御
L6  PHASE-LAW ENGINE    情報物理結合則の評価・適用
L5  MEDIATION           μ(x,t) 11次元情報物理結合係数
L4  SENSOR FUSION       全11チャネル統合
L3  SONAR               チャープ・相互相関
L3  EM FIELD            磁力計・環境光・加速度
L3  RF SPECTRUM          スペクトラム解析
L3  NFC FIELD           近接場検出
L3  THERMAL             温度推定
L3  SPATIAL             平面検出・ポイントクラウド
L3  BLE MESH            RSSI距離推定・メッシュ
L3  NETWORK             P2Pデバイスメッシュ
L3  COLLABORATIVE       協調計測
L2  DEVICE HARDWARE     マイク・スピーカー・センサー
L1  PHYSICAL MEDIUM     音波・電磁波・光・慣性・空間形状
```

### pTCP/IP Protocol Engine

物理空間における情報伝送プロトコルの完全実装。TCP/IPのハンドシェイク・パケット構造・フロー制御を物理空間に適用する。

**パケットフォーマット:**
```
┌──────┬──────┬──────┬──────┬──────┐
│ VER  │ TYPE │ SEQ  │ SRC  │ DST  │
├──────┼──────┼──────┼──────┤      │
│ TS   │ TTL  │ CRC32│ PAYLOAD...  │
└──────┴──────┴──────┴─────────────┘

CHECKSUM: CRC32 (polynomial 0xEDB88320) over header+payload
```

**パケットタイプ（12種）:**

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

---

## Mediation Coefficient — 11次元

Mediation Coefficient μ(x,t) は、ある地点 x・時刻 t における情報空間と物理空間の結合度を 0〜1 で表す。

```
μ(x,t) = Σ wᵢ · dᵢ(x,t)

where dᵢ ∈ {acoustic, emField, photonic, kinetic, rfDensity, nfcField,
             thermal, spatial, bleMesh, network, collaborative}
```

**重み配分:**

| 次元 | 重み | センサー |
|---|---|---|
| acoustic | 0.15 | マイク＋スピーカー（チャープソナー） |
| emField | 0.08 | 磁力計・加速度計 |
| photonic | 0.06 | 環境光センサー / カメラフォールバック |
| kinetic | 0.08 | 加速度・ジャイロ |
| rfDensity | 0.10 | RFスペクトラム解析（5バンド） |
| nfcField | 0.05 | NFC近接場検出 |
| thermal | 0.05 | 温度推定 |
| spatial | 0.12 | WebXR空間マッピング（3Dポイントクラウド） |
| bleMesh | 0.08 | BLE RSSI距離推定・メッシュ |
| network | 0.13 | P2P接続性 |
| collaborative | 0.10 | 協調計測カバレッジ |

**Network 次元:**
```
network = peerScore × 0.6 + trafficScore × 0.4
peerScore = min(1, connectedPeers / 5)
trafficScore = min(1, receivedPackets / 50)
```

**Collaborative 次元:**
```
collaborative = avg(peer.mediation for peer in connectedPeers)
```

---

## Phase-Law Engine (Φ)

情報空間と物理空間の結合を記述する8つの法則体系。各法則がリアルタイムセンサーデータに基づいて `COUPLED` / `PARTIAL` / `DECOUPLED` のいずれかに評価される。

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

PL-008はPL-001〜PL-007の統合評価であり、μ(x,t)が閾値を超えた場合にCOUPLED状態と判定する。

---

## P2P Network

- **BroadcastChannel**: 同一オリジンの複数タブ/ウィンドウ間でリアルタイム通信
- **デバイス発見**: SYN/SYN-ACK/ACKハンドシェイクによる自動発見
- **Mediation共有**: 各デバイスが自身のμ(x,t)をネットワークにブロードキャスト
- **空間アンカー共有**: SPATIALタブで配置したアンカーをピアに送信
- **トポロジー可視化**: デバイスメッシュのリアルタイムグラフ描画
- **Protocol Monitor**: 全pTCPパケットのリアルタイムインスペクション
- **QoS メトリクス**: RTT・ジッター・パケットロス率（‰）のリアルタイム追跡
- **Real/Sim表示**: 実ピアとシミュレーションピアをバッジで明確に区別

---

## タブ構成（11タブ）

| タブ | アイコン | 機能 |
|---|---|---|
| SONAR | ◎ | 音響ソナー（6信号タイプ・NCC・RTT） |
| EM | ⚡ | 磁力計・環境光・加速度・位置情報 |
| RF | 〜 | RFスペクトラム解析（5バンド） |
| NFC/TH | ◇ | NFC近接場＋熱推定 |
| SPATIAL | △ | WebXR空間マッピング（3Dポイントクラウド） |
| BLE | ◌ | BLEメッシュ（RSSI距離推定・Web Bluetooth API） |
| NET | ⬡ | pTCP/IPネットワーク・ピア発見・トポロジー |
| PROTO | ⟐ | プロトコルモニター・パケットインスペクション・CRC検証 |
| PHASE | Φ | Phase-Law Engine・8法則リアルタイム評価 |
| MED | ◈ | 11次元Mediation Coefficient |
| PROFILE | ◉ | 空間プロファイル＋プロトコルスタック＋データエクスポート |

---

## Technical Specs

| 項目 | 値 |
|---|---|
| サンプルレート | 44,100 Hz |
| リスニング窓 | 500 ms |
| 相関方式 | NCC（正規化相互相関） |
| Mediation 次元数 | 11 |
| Phase-Law 数 | 8 |
| パケットタイプ数 | 12 |
| チェックサム | CRC32 (polynomial 0xEDB88320) |
| BLE | Web Bluetooth API + Simulation fallback |
| ネットワーク方式 | BroadcastChannel + Simulation |
| QoS メトリクス | RTT, Jitter, Packet Loss Rate |
| HEARTBEAT間隔 | 5,000 ms |
| Mediation共有間隔 | 5,000 ms |
| データエクスポート | JSON（計測データ・パケットログ） |

### 依存関係

- React 18.2.0（CDN）
- IBM Plex Mono（Google Fonts）
- その他の外部依存なし

### ブラウザ互換性

| ブラウザ | Sonar | Magnetometer | Light | Motion | BLE | 備考 |
|---|---|---|---|---|---|---|
| Chrome (Android) | ✔ | ✔ (Generic Sensor) | ✔ (Sensor) | ✔ | ✔ (Web Bluetooth) | フル機能 |
| Safari (iOS) | ✔ | ✔ (Orientation) | ✔ (Camera) | ✔ | — (Sim) | 許可ボタン必要 |
| Chrome (Desktop) | ✔ | — | — | — | ✔ (Web Bluetooth) | センサー限定的 |
| Firefox | ✔ | ✔ (Orientation) | — (Camera) | ✔ | — (Sim) | BLE/ALS非対応 |

---

## Version History

| Ver | 機能 |
|---|---|
| v0.1 | Physical Ping — 単音パルスエコー計測 |
| v0.2 | + エネルギー閾値検出 |
| v0.3 | + NCC相互相関パターンマッチング |
| v0.4 | + blanking修正・閾値キャップ |
| v0.5 | + マルチシグナルセレクター（6信号タイプ） |
| v0.6 | + Magnetometer + AmbientLight + Accelerometer + 4D Mediation |
| v0.8 | + RF Spectrum + NFC + Thermal + 7D Mediation |
| v0.9 | + WebXR Spatial Mapping + BLE Mesh + 9D Mediation |
| v1.0 | + pTCP/IP Protocol + P2P Network + Phase-Law Engine + 11D Mediation |
| **v1.0a** | **+ CRC32 + Web Bluetooth API + QoS Metrics + Data Export** |

### v1.0a Changes

| 改善 | 詳細 |
|---|---|
| CRC32 Checksum | ダミーchecksum→実CRC32 (0xEDB88320)。全パケットの完全性検証。不正パケットをdrop |
| Web Bluetooth API | BLEシミュレーション→実Web Bluetooth APIスキャン対応。非対応環境はシミュレーションにフォールバック |
| パケット検証 | 受信パケットのCRC32検証＋VALID/INVALID表示。プロトコルモニターにCRC列追加 |
| ネットワークQoS | ジッター計測・パケットロス率（‰）・RTT追跡・検証済パケット数 |
| データエクスポート | 計測データ・パケットログをJSON出力。論文・ベンチマーク・実証データに使用可能 |
| Real/Sim区別 | BLEデバイス・ネットワークピアに REAL/SIM バッジ表示。データソースの明確化 |

---

## Roadmap

| Target | 機能 |
|---|---|
| v1.1 | WebRTC P2P（クロスオリジン実デバイス間通信）・空間アンカー永続化 |
| v1.2 | Mediation履歴のヒートマップ可視化・空間プロファイルのインポート/エクスポート |
| v2.0 | Phase-Law拡張（動的重み適応・学習型閾値）・マルチホップルーティング |

---

## License

実験的プロトタイプ。Phase-Law Architecture の概念実証として開発。

---

*pTCP v1.0a | Full Phase-Law Architecture | 11D Mediation + P2P Network + Phase-Law Engine + CRC32 + Web Bluetooth + QoS + Export | pTCP/IP for Physical Space*
