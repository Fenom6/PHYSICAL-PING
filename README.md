# Physical Ping — pTCP/IP v2.1 HARDWARE

**スマホの外へ：ESP32常設ノード + ゲートウェイ + ハイブリッドネットワーク**

Physical Ping は、スマートフォンの物理センサーを活用して「物理的な距離・環境・存在」をネットワーク的に計測・可視化するシングルファイル Web アプリケーションです。v2.1 では ESP32 常設ノードによるハードウェアレイヤーを追加し、スマホ単体を超えた常設センサーネットワークを構築します。

---

## バージョン履歴

| Version | コードネーム | 主な追加機能 |
|---------|-------------|-------------|
| v1.0 | MEASURE | 音響測距、BLE スキャン、基本 UI |
| v1.5 | APPLICATION | スペクトラム解析、ヒートマップ、タイムライン、プロファイル管理 |
| v2.0 | INTELLIGENCE | L1 中脳 FSM、L3 大脳 Claude API、空間記憶、マルチホップルーティング |
| **v2.1** | **HARDWARE** | **ESP32 Fleet 管理、ゲートウェイ、ハイブリッドネットワーク、OTA** |

---

## アーキテクチャ

### レイヤー構成（Phase-Law Architecture）

```
L3  大脳 ── Claude API 統合（自然言語による環境解釈）
L2  空間知能 ── SiteSense（場の環境認識・スコアリング）
L1  中脳 ── Midbrain FSM（Reflex / Salience / Mode 状態機械）
L0  小脳 ── Phase-Law Engine v2（12 相律による物理計測）
HW  ── ESP32 Fleet（常設センサーノード + ゲートウェイ + メッシュ）
```

### 16 タブ UI

| # | タブ | 機能概要 |
|---|------|---------|
| 1 | MEASURE | チャープ音響測距（20kHz 超音波 + マイク） |
| 2 | PRECISION | マルチチャープ同時発信、BLE パスロス、EM フィンガープリント |
| 3 | SPECTRUM | RF スペクトラム解析（WiFi 2.4/5GHz, BLE, Sub-GHz シミュレーション） |
| 4 | PEERS | BLE デバイスリスト、WebRTC P2P 接続管理 |
| 5 | HEATMAP | Canvas ベース環境ヒートマップ描画 |
| 6 | TIMELINE | センサーデータ時系列グラフ + CSV エクスポート |
| 7 | DASHBOARD | 統合ダッシュボード（全センサー一覧 + スナップショット） |
| 8 | PROFILES | 環境プロファイル保存・比較 |
| 9 | NETWORK | pTCP メッシュネットワーク（BroadcastChannel + WebRTC） |
| 10 | MIDBRAIN | L1 中脳 FSM ビジュアライザー |
| 11 | INTELLIGENCE | L3 大脳 Claude API 対話 |
| 12 | ROUTING | マルチホップルーティングテーブル |
| 13 | MEMORY | 空間記憶（IndexedDB 永続化） |
| 14 | **HARDWARE** | **ESP32 Fleet 管理、トポロジー可視化、OTA** |
| 15 | SITE | SiteSense 環境認識スコア |
| 16 | PATENT | Phase-Law 特許・認証データ |

---

## v2.1 HARDWARE — 新機能詳細

### ESP32 Fleet 管理 (`useESP32Fleet`)

常設 ESP32 ノードのフリート（艦隊）を統合管理します。

**ノードタイプ：**

| タイプ | 説明 | センサー |
|--------|------|---------|
| 🔬 SENSOR | 固定環境センサー | 温度、湿度、気圧、音響、電磁場、照度 |
| 🌐 GATEWAY | WiFi/MQTT ブリッジ | ― （通信中継専用） |
| 📡 RELAY | BLE/ESP-NOW メッシュ中継 | ― （中継専用） |
| 📍 ANCHOR | 三辺測量アンカー | 位置座標 (x, y, z) |

**Fleet 機能：**

- ノードのプロビジョニング（名前・タイプ・設置場所を指定して追加）
- リアルタイムステータス監視（online / degraded / offline / provisioning）
- バッテリー残量・RSSI・稼働時間トラッキング
- センサーデータ集約（mean / min / max / std dev）
- OTA ファームウェア更新（プログレスバー付き）
- ハードウェアメッセージバス（SENSOR\_DATA, HEARTBEAT, ROUTE\_ADV, OTA\_CHECK, MU\_REPORT）

**デフォルトノード構成（シミュレーション）：**

| ノード名 | タイプ | ファームウェア |
|----------|--------|--------------|
| Lab-Sensor-01 | sensor | 2.1.0 |
| Lab-Sensor-02 | sensor | 2.0.9 |
| Gateway-Main | gateway | 2.1.1 |
| Relay-Corridor | relay | 2.1.0 |
| Anchor-North | anchor | 2.1.0 |
| Outdoor-Sensor | sensor | 2.1.1 |

### ハイブリッドネットワーク (`useHybridNetwork`)

7 種のプロトコルを統合し、スマホ・ESP32・クラウドを横断するトポロジーを構築します。

| プロトコル | 用途 | 到達距離 |
|-----------|------|---------|
| BLE 5.0 | 近距離デバイス検出 | ~100m |
| ESP-NOW | ESP32 間低遅延通信 | ~200m |
| WiFi | LAN 内通信 | ~50m |
| LoRa | 長距離 IoT 通信 | ~10km |
| MQTT | クラウドブローカー経由 | WAN |
| WebRTC | ブラウザ P2P | WAN |
| BroadcastChannel | 同一端末タブ間 | 端末内 |

**ネットワーク統計：** 総ノード数、総リンク数、アクティブリンク数、平均レイテンシ、ヘルススコア

### トポロジーキャンバス (`TopologyCanvas`)

Canvas API による物理ネットワークトポロジーをリアルタイム描画します。

- 中央に THIS\_DEVICE（スマホ）
- 内側リングに ESP32 ノード群
- 外側にクラウド接続ノード
- プロトコル別の色分けリンク
- ステータス（active / degraded）による表示切替

### ゲートウェイ状態カード

Gateway ノードの詳細ステータスを表示します。

- アップリンク状態（WiFi SSID・IP / MQTT ブローカー / LoRa 周波数）
- パケット中継数
- 接続ノード数

### v2.1 成功指標

| 指標 | 目標値 |
|------|--------|
| ESP32 ノード接続 | 5 台以上 |
| ゲートウェイ稼働 | 1 台以上 |
| ハイブリッドプロトコル | 3 種以上 |
| ネットワーク健全性 | 80%以上 |
| Fleet 平均バッテリー | 50%以上 |
| OTA ファームウェア統一 | 100% |

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| UI フレームワーク | React 18.2.0（CDN、`createElement` ベース、JSX 不使用） |
| フォント | IBM Plex Mono（Google Fonts） |
| 圧縮 | LZ-String 1.5.0 |
| 永続化 | IndexedDB（anchors, calibration, profiles, spatial\_memory, routing\_table, anomaly\_log, adaptive\_thresholds） |
| 通信 | BroadcastChannel, WebRTC DataChannel |
| 描画 | Canvas API（トポロジー、レーダー、ヒートマップ） |
| 音響 | Web Audio API（AudioContext + AnalyserNode） |
| センサー | DeviceOrientation, DeviceMotion, Magnetometer, AmbientLightSensor, Geolocation |
| PWA | Service Worker + Install Prompt |

**外部依存：** CDN 経由の 3 ファイルのみ。それ以外はゼロ依存のシングル HTML ファイル（4,312 行）。

---

## 使い方

### 基本起動

```
# ローカルファイルとしてブラウザで直接開く
open physical-ping-v2_1.html

# または任意の HTTP サーバーで配信
python3 -m http.server 8000
# → http://localhost:8000/physical-ping-v2_1.html
```

### HARDWARE タブの操作

1. **Fleet Summary** — オンライン/劣化/オフラインのノード数とバッテリー状況を確認
2. **Hybrid Network Topology** — トポロジーキャンバスでネットワーク全体像を把握
3. **Gateway Status** — ゲートウェイのアップリンク接続状態を監視
4. **Aggregated Sensor Data** — 全ノードのセンサー集約値（平均・最小・最大・標準偏差）を確認
5. **Node Fleet** — 個別ノードの詳細表示、OTA 更新、ノード削除
6. **Provision** — 新規ノードの追加（名前・タイプ・設置場所を入力）
7. **Message Bus** — メッセージタイプ別フィルタリングでハードウェア通信をモニタリング

### デモモード

ヘッダーの ▶ DEMO ボタンでガイド付きウォークスルーを開始。v2.1 では以下のステップが追加されています。

- Step 5: ESP32 常設ノード（sensor / gateway / relay / anchor）
- Step 6: ハイブリッドネットワーク（7 プロトコル統合トポロジー）
- Step 7: OTA & Fleet 管理（ファームウェア更新・バッテリー監視・データ集約）

---

## Phase-Law Engine v2

12 の物理法則を基盤とした計測・判定エンジンです。各法則は独立にスコアリングされ、パテントタブで統合されます。

| ID | 法則名 |
|----|--------|
| PL-01 | 音速距離法則 |
| PL-02 | ドップラー速度法則 |
| PL-03 | 逆二乗減衰法則 |
| PL-04 | 多重反射残響法則 |
| PL-05 | BLE 経路損失法則 |
| PL-06 | 電磁指紋法則 |
| PL-07 | 温度補正法則 |
| PL-08 | 地磁気偏角法則 |
| PL-09 | 環境光変動法則 |
| PL-10 | 加速度重力法則 |
| PL-11 | GPS 精度法則 |
| PL-12 | 時間安定性法則 |

---

## データ永続化

IndexedDB `ptcp_anchors` データベースに以下のオブジェクトストアを保持します。

| Store | 用途 | Key |
|-------|------|-----|
| anchors | 測距アンカーポイント | id |
| calibration | EM フィンガープリント、BLE パスロス校正値 | key |
| profiles | 環境プロファイルスナップショット | id |
| spatial\_memory | 空間記憶エントリ | id |
| routing\_table | マルチホップルーティングテーブル | dest |
| anomaly\_log | 異常検知ログ | id (auto) |
| adaptive\_thresholds | 適応的閾値 | lawId |

---

## ファイル構成

```
physical-ping-v2_1.html    ← 全機能を含むシングルファイル（4,312 行）
README.md                  ← 本ドキュメント
```

依存ファイルは存在しません。HTML ファイル 1 つで完結します。

---

## ブラウザ対応

| ブラウザ | 対応状況 |
|---------|---------|
| Chrome / Edge (mobile & desktop) | ✅ フル対応 |
| Safari (iOS) | ⚠ DeviceOrientation 権限要求あり、Magnetometer API 非対応 |
| Firefox | ⚠ Web Bluetooth / AmbientLightSensor 非対応 |

音響測距・BLE スキャン・WebRTC は HTTPS 環境またはlocalhost が必要です。

---

## ライセンス

Phase-Law Architecture および pTCP/IP プロトコルは独自設計です。
