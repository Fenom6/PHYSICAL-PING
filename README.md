# Physical Ping — pTCP/IP v2.0 INTELLIGENCE

> ⚠️ **EXPERIMENTAL** — 本ソフトウェアは研究・実験段階にあります。
> 産業利用には追加の検証とキャリブレーションが必要です。

**物理空間のための TCP/IP — 11次元センサーフュージョンによる空間 Mediation 計測システム**

---

## 概要

Physical Ping は、スマートフォンのセンサー群を統合し、物理空間における情報伝達容易性を定量化するシステムです。音響ソナー、電磁場検出、BLE メッシュ、GPS、加速度・ジャイロ等の 11 次元センサーデータを融合し、**Mediation Coefficient μ(x,t)** として空間の「情報透過度」をリアルタイムに算出します。

v2.0 INTELLIGENCE では、Phase-Law Engine の適応型閾値、空間の自動分類・記憶・予測、マルチホップルーティングを実装し、**空間が自ら状況を理解し適応する**知能化層を追加しました。

### ステータス

| 項目 | 状態 |
|---|---|
| コア計測（11D センサーフュージョン） | ✅ 動作 |
| Phase-Law Engine v2（12法則 + 適応型閾値） | ✅ 動作 |
| 空間知能（予測・記憶・異常検知） | 🧪 実験中 |
| マルチホップルーティング（pIP） | 🧪 実験中 |
| SiteSense 建設現場モード | ✅ プロトタイプ |
| 特許実証データ収集 | ✅ 動作 |
| PWA / オフライン対応 | 🧪 実験中 |

---

## クイックスタート

```
1. physical-ping-v2_0.html をブラウザで開く（Chrome Android 推奨）
2. マイク・位置情報のアクセスを許可
3. 「PING」ボタンで音響距離計測を開始
4. タブを切り替えて各機能を確認
```

外部サーバー不要。単一 HTML ファイル（約 264KB）で完結します。

### 推奨環境

- **Chrome Android 90+**（Reality Index 最大化のため推奨）
- Chrome Desktop 90+（一部センサー制限あり）
- Safari iOS 16+（Web Bluetooth 非対応、センサー許可要求あり）

### ファイル構成

```
physical-ping-v2_0.html    単一ファイルアプリケーション（React + WebAudio + WebRTC）
ROADMAP-v2_0.md            v1.0a → v2.0 開発ロードマップ
README.md                  本ファイル
```

---

## アーキテクチャ

### 人工神経系 4 層モデル

```
L0  小脳（Phase-Law Engine v2）
    └─ 12法則のリアルタイム評価 + 環境適応型閾値
    └─ 反射的な空間結合状態の判定

L1  中脳（Midbrain）
    └─ Reflex Gate：危険値の即座遮断
    └─ Salience Filter：重要度フィルタリング
    └─ Mode FSM：NOMINAL → ALERT → CRITICAL → EMERGENCY
    └─ Embodiment Core：物理的制約の検証

L2  空間知能（Spatial Intelligence）← v2.0 新設
    └─ 予測エンジン：Holt 二重指数平滑法
    └─ 空間記憶：フィンガープリント認識
    └─ 異常検知：Phase-Law 状態遷移監視
    └─ 空間分類器：環境タイプ自動推定
    └─ マルチホップルーティング：pIP プロトコル

L3  大脳（Claude API Cerebrum）
    └─ 自然言語による計測状態の意味解釈
    └─ 中脳でフィルタリングされたデータのみ受信
```

### 11 次元センサーフュージョン

| # | 次元 | センサーソース | 計測対象 |
|---|---|---|---|
| 1 | Acoustic | WebAudio チャープ信号 | 音響距離・反射環境 |
| 2 | EM Field | Magnetometer / DeviceOrientation | 電磁場強度・方位 |
| 3 | Photonic | AmbientLightSensor | 環境光量 |
| 4 | Kinetic | Accelerometer / DeviceMotion | 運動・振動 |
| 5 | RF Density | シミュレーション（WiFi RTT 調査中）| 電波密度 |
| 6 | NFC | Web NFC API（対応環境のみ）| 近接通信 |
| 7 | Thermal | CPU 負荷推定 | 温度環境 |
| 8 | Spatial | Geolocation API | GPS 座標 |
| 9 | BLE Mesh | Web Bluetooth API | BLE デバイス密度 |
| 10 | Network | pTCP ネットワーク状態 | 通信品質 |
| 11 | Collaborative | WebRTC P2P メッシュ | ピア接続数 |

各次元には **REAL / EST / SIM / N/A** の 4 層ソース分類が付与され、**Reality Index ρ(x,t)** として計測の実データ比率を定量化します。

### Phase-Law Engine v2（12 法則）

| ID | 法則名 | 評価対象 | v2.0 変更 |
|---|---|---|---|
| PL-001 | Acoustic-Spatial Coupling | 音響×空間の結合度 | 適応型閾値 |
| PL-002 | EM Continuity | 電磁場の連続性 | 適応型閾値 |
| PL-003 | Spectral Openness | 周波数帯の開放度 | 適応型閾値 |
| PL-004 | Kinetic Stability | 運動の安定性 | 適応型閾値 |
| PL-005 | RF Density | 電波密度 | — |
| PL-006 | Sensor Completeness | センサー網羅度 | — |
| PL-007 | Network Connectivity | ネットワーク接続性 | — |
| PL-008 | Thermal-Photonic Coupling | 温度×光の結合度 | 適応型閾値 |
| PL-009 | Cross-Modal Coherence | モード間整合性 | 適応型閾値 |
| PL-010 | Spatial Consistency | 空間的一貫性 | **v2.0 新規** |
| PL-011 | Temporal Stability | 時間的安定性 | **v2.0 新規** |
| PL-012 | Environmental Context | 環境特性化度 | **v2.0 新規** |

**適応型閾値**: 計測履歴（最大 200 サンプル）から各法則の平均・標準偏差を算出し、COUPLED / PARTIAL / DECOUPLED の境界値を指数移動平均で自動調整。IndexedDB に永続化。

---

## v2.0 新機能

### 空間分類器（Space Classifier）

11 次元のセンサーパターンから環境タイプを自動推定します。

- **OFFICE** — 中〜高 RF、高 BLE、高ネットワーク、低運動
- **FACTORY** — 高 EM、高ノイズ、高温度、高運動
- **OUTDOOR** — 高光量、GPS 有効、低 EM 干渉
- **SEMI-OUTDOOR** — 中間的パターン
- **RESIDENTIAL** — 低 RF、低 BLE、中光量
- **UNDERGROUND** — GPS 無効、低光量、中 EM

### 予測エンジン（Prediction Engine）

Holt の二重指数平滑法（α=0.3, β=0.1）により μ(x,t) の次時刻値を予測。下降トレンド（Δ < -3%/cycle）検出時に早期警告を発報。

### 空間記憶（Spatial Memory）

11 次元の値をフィンガープリントとして IndexedDB に保存。再訪時にコサイン類似度ベースで自動認識（閾値: 70%）し、前回との差分を表示します。

### 異常検知（Anomaly Detector）

以下のイベントをリアルタイムで検知し、推奨アクションを自動生成します：

- Phase-Law 状態遷移（COUPLED → DECOUPLED 等）
- μ 急降下（> 15%: CRITICAL、> 8%: WARNING）
- Reality Index 低下（> 15%）

重大異常は IndexedDB に永続化されます。

### マルチホップルーティング（pIP Protocol）

距離ベクトル方式の簡易ルーティングプロトコルを実装。直接接続のないピア間で TTL ベースのパケット転送（最大 5 ホップ）を行います。HELLO パケットによる隣接発見とルーティングテーブルの自動更新、ネットワークパーティション検出を含みます。

### 動的重み最適化（Dynamic Weight Optimizer）

センサーデータのソース分類（REAL / EST / SIM / N/A）に基づき、11 次元の重み wᵢ を自動最適化。実測データを持つ次元の重みを増幅し、シミュレーションデータの影響を低減します。

---

## UI タブ一覧

| タブ | 内容 |
|---|---|
| MEASURE | 音響距離計測（PING / BURST / CALIBRATE） |
| PRECISION | マルチチャープ計測・EM フィンガープリント・BLE パスロス |
| SPECTRUM | RF スペクトラム表示 |
| PEERS | WebRTC P2P メッシュ管理 |
| HEATMAP | 空間 Mediation ヒートマップ（2D） |
| TIMELINE | 11 次元時系列グラフ |
| DASHBOARD | レーダーチャート・統計サマリー |
| PROFILES | 空間プロファイル保存・比較 |
| NETWORK | pTCP ネットワーク・QoS |
| MIDBRAIN | 中脳モニター（FSM / Salience / Embodiment） |
| **INTELLIGENCE** | **v2.0** 空間分類・予測・適応閾値・異常検知・タイムライン |
| **ROUTING** | **v2.0** pIP ルーティングテーブル・マルチホップパス |
| **MEMORY** | **v2.0** 空間記憶・フィンガープリント認識 |
| SITE | SiteSense 建設現場安全管理 |
| PATENT | 特許実証データ収集・レポート生成 |

---

## 技術スタック

単一 HTML ファイル内に全依存を含みます。ビルドツール不要。

- **React 18** (CDN) — UI コンポーネント
- **WebAudio API** — チャープ信号生成・相互相関・マッチドフィルタ
- **WebRTC DataChannel** — P2P リアルタイム通信
- **Web Bluetooth API** — BLE デバイススキャン
- **IndexedDB** — ローカル永続化（anchors, calibration, profiles, spatial_memory, routing_table, anomaly_log, adaptive_thresholds）
- **Canvas API** — ヒートマップ・レーダーチャート・時系列グラフ
- **Geolocation / DeviceOrientation / DeviceMotion API** — 空間・慣性センサー
- **LZ-String** — WebRTC SDP 圧縮（QR ハンドシェイク用）
- **Service Worker** — オフラインキャッシュ（実験的）

---

## 既知の制限事項

| 制限 | 詳細 | 緩和策 |
|---|---|---|
| センサーの SIM 依存 | RF Density・NFC・一部 Thermal はシミュレーションデータ | Chrome Android で REAL 比率を最大化 |
| 音響計測の環境依存 | 高騒音環境で精度が低下 | 環境ノイズ適応 + マルチチャープ計測 |
| BLE の距離精度 | RSSI ベースのため ±1-3m 程度 | パスロスモデル校正で改善 |
| 単一ファイル制約 | 264KB / 3,663 行で保守性に限界 | v2.x でモジュール分割を検討 |
| WebRTC NAT 越え | シンメトリック NAT 環境で接続失敗 | TURN フォールバック未実装 |
| 空間分類器の精度 | ルールベースのためエッジケースに弱い | 計測履歴ベースの学習を今後導入予定 |
| 予測エンジン | 短期予測のみ（2 秒先） | 長期トレンド分析は v2.x で対応 |

---

## データの永続化

IndexedDB `ptcp_anchors` (v4) に以下のオブジェクトストアを保持：

| ストア | 用途 | キー |
|---|---|---|
| `anchors` | 空間アンカー座標 | `id` |
| `calibration` | キャリブレーションデータ | `key` |
| `profiles` | 空間プロファイル | `id` |
| `spatial_memory` | 空間記憶フィンガープリント | `id` |
| `routing_table` | pIP ルーティングテーブル | `dest` |
| `anomaly_log` | 異常検知ログ（インデックス: `ts`）| auto-increment |
| `adaptive_thresholds` | 適応型閾値パラメータ | `lawId` |

ブラウザのストレージをクリアするとすべてのデータが失われます。重要なデータは JSON エクスポート機能で別途保存してください。

---

## ライセンスと帰属

---

## 変更履歴

### v2.0 INTELLIGENCE（2026-02）

- Phase-Law Engine v2: 12 法則（PL-010〜PL-012 新設）+ 適応型閾値
- 空間分類器: 6 タイプの環境自動推定
- 予測エンジン: Holt 二重指数平滑法による μ(x,t) 予測
- 空間記憶: 11D フィンガープリント認識・差分検出
- 異常検知: Phase-Law 遷移 / μ 急降下 / RI 低下の検出 + 推奨アクション
- マルチホップルーティング: pIP 距離ベクトルプロトコル
- 動的重み最適化: REAL/SIM ソース分類に基づく自動重み配分
- 環境変化タイムライン: 10 秒間隔サンプリング
- PWA 対応: Service Worker + マニフェスト（実験的）
- パフォーマンスモニター: FPS / メモリ / SW 状態
- UI カラーパレット: 暗色テーマに調和する低彩度ボタン

### v1.5 APPLICATION（2026-01）

- 人工中脳層（L1 Midbrain）: Reflex Gate / Salience Filter / Mode FSM / Embodiment Core
- Claude API 統合（L3 大脳）
- SiteSense 建設現場モード
- 特許実証データ収集エンジン
- デモモード

### v1.3 PRECISION

- マルチチャープ並列計測
- EM フィールドフィンガープリント
- BLE パスロスモデル校正
- 次元間クロスバリデーション
- 測定品質スコア

### v1.2 VISUALIZATION

- μ(x,t) 時系列ストレージ・グラフ
- 空間ヒートマップ（2D Canvas）
- インタラクティブレーダーチャート
- 空間プロファイル保存・比較・エクスポート

### v1.1 CONNECTIVITY

- WebRTC DataChannel P2P
- マルチピアメッシュ
- 空間アンカー IndexedDB 永続化
- 3 段フォールバック（WebRTC → BroadcastChannel → Simulation）

### v1.0a（初期）

- 11 次元センサーフュージョン
- Phase-Law Engine（8 法則）
- pTCP/IP プロトコルスタック
- Matched Filter + Kalman Filter 音響距離計測
- Reality Index ρ(x,t)
