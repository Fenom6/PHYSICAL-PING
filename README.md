# PHYSICAL PING — pTCP v0.6 IPC

**Information Physical Connector · Multi-Layer Sensing**

スマートフォンのセンサー群を統合し、物理空間の「情報接続性」をリアルタイムで定量化する実験的Webアプリケーション。音響ソナー＋電磁波＋環境センサーによる多次元空間プローブと、その統合指標である **Mediation Coefficient μ(x,t)** を算出する。

物理空間のための TCP/IP

## コンセプト

pTCP（physical Transmission Control Protocol）は、情報空間と物理空間の結合度を計測・可視化するプロトコルの実験実装である。従来のネットワークにおける ping が通信経路の品質を計測するように、Physical Ping は物理空間そのものの「応答性」を計測する。

v0.6 では単一の HTML ファイルに全機能を収めたゼロ依存設計を維持しつつ、音響ソナーに加えて電磁波・環境センサーレイヤーを統合し、**Information Physical Connector（IPC）** としての基盤を構築した。

---

## 機能概要

### L1: SONAR — 音響空間プローブ

| 信号タイプ | 帯域 | 特性 |
|---|---|---|
| CHIRP MID | 1.5→2.5kHz / 20ms | 室内標準。バランスの良い反射検出 |
| CHIRP LOW | 500→1.5kHz / 30ms | 壁・障害物を貫通。建物全体の探索 |
| CHIRP HIGH | 3→6kHz / 15ms | 高指向性。小物体の検出 |
| CHIRP WIDE | 800→4kHz / 25ms | 広帯域。最大情報量。素材判別 |
| PULSE 2kHz | 2kHz単一 / 15ms | 基準計測用シンプルパルス |
| CLICK BURST | 符号化 / 10ms | 最高時間分解能 |

- スピーカーから信号を発射し、マイクで反射を捕捉
- **正規化相互相関（NCC）** によるサブミリ秒精度の RTT 検出
- 環境ノイズキャリブレーション＋適応的閾値（上限キャップ付き）
- 連続モード（CONT）による時系列観測

### L1: EM/SENSOR — 電磁波・環境センサー

| センサー | API | フォールバック | 取得値 |
|---|---|---|---|
| 磁力計 | Generic Sensor API (Magnetometer) | DeviceOrientation (iOS/Safari) | 磁場ベクトル (μT) / 方位角 |
| 環境光 | AmbientLightSensor | **リアカメラ輝度推定** | 照度 (lux) |
| 加速度 | DeviceMotion | — | 3軸加速度 (m/s²) |
| 位置情報 | Geolocation API | — | 緯度・経度・精度 |

- 2秒間隔の自動スキャンで EM Scan Log に履歴蓄積
- 各センサーの **データソース（src）** をリアルタイム表示
- プラットフォーム判定バー（iOS Safari / Desktop / Android）

### L2: SENSOR FUSION

音響・電磁場・光環境・慣性の4チャネルを統合し、単一の空間プロファイルを生成。

### L3: MEDIATION — Mediation Coefficient

```
μ(x,t) = Σ wᵢ · dᵢ(x,t)

where dᵢ ∈ {acoustic, emField, photonic, kinetic}
weights: acoustic=0.35, emField=0.25, photonic=0.15, kinetic=0.25
```

物理空間の「情報接続性」を 0〜1 のスカラー値で表現する指標。

| 次元 | 意味 | 高値の解釈 |
|---|---|---|
| acoustic | 音響反射率 | 空間が閉じており反射が明確に検出される |
| emField | 電磁場密度 | 電子機器が多い＝情報インフラが密 |
| photonic | 光環境 | 明るい＝視覚的情報チャネルが開いている |
| kinetic | 運動安定性 | 静止＝計測条件が安定 |

- リングゲージ＋レーダーチャートによる4次元可視化
- Phase-Law Architecture の基礎単位として定義

### L4: PROFILE — 空間プロファイル

全センサーレイヤーの統合分類。タグによる空間特性の自動判定。

| カテゴリ | タグ例 |
|---|---|
| 音響空間 | ENCLOSED / INDOOR / OPEN-INDOOR / OUTDOOR |
| EM環境 | HIGH-EM / MODERATE-EM / LOW-EM |
| 光環境 | BRIGHT / LIT / DIM |
| 安定性 | STABLE / MOVING / UNSTABLE |
| 接続性 | HIGH-CONNECT / MED-CONNECT / LOW-CONNECT |

---

## iOS Safari 対応

iOS 13 以降の Safari では `DeviceOrientation` / `DeviceMotion` にユーザーの明示的許可が必要。

1. EM/SENSOR タブを開く
2. 紫色の **「▶ GRANT SENSOR ACCESS」** ボタンをタップ
3. iOS 標準の許可ダイアログが表示される
4. 「許可」→ 磁力計・加速度計が自動で ACTIVE に

AmbientLightSensor 非対応環境（Safari含む）では、リアカメラ映像の輝度平均から照度を推定するフォールバックが自動起動する。

---

## 技術仕様

| 項目 | 値 |
|---|---|
| サンプルレート | 44,100 Hz |
| リスニング窓 | 500 ms |
| ブランキング | 8 ms |
| 相関方式 | 正規化相互相関（NCC） |
| 閾値 | max(0.04, min(ambient_corr × 2.5, 0.45)) |
| 距離推定 | RTT × 343 m/s ÷ 2 |
| EM スキャン間隔 | 2,000 ms |
| カメラ照度推定解像度 | 16×16 px |
| 履歴保持 | Sonar: 64件 / EM: 32件 |

### 依存関係

- React 18.2.0（CDN）
- IBM Plex Mono（Google Fonts）
- **その他の外部依存なし**

### ブラウザ互換性

| ブラウザ | Sonar | Magnetometer | Light | Motion | 備考 |
|---|---|---|---|---|---|
| Chrome (Android) | ✔ | ✔ (Generic Sensor) | ✔ (Sensor) | ✔ | フル機能 |
| Safari (iOS) | ✔ | ✔ (Orientation) | ✔ (Camera) | ✔ | 許可ボタン必要 |
| Chrome (Desktop) | ✔ | — | — | — | センサー限定的 |
| Firefox | ✔ | ✔ (Orientation) | — (Camera) | ✔ | ALS非対応 |

---

## プロトコルスタック

```
L4  SPACE PROFILE      空間分類・行動推奨
L3  MEDIATION           μ(x,t) 情報物理結合係数
L2  SENSOR FUSION       音響+EM+光+慣性 統合
L1  ACOUSTIC SONAR      チャープ・相互相関
L1  EM FIELD            磁力計・環境光・加速度
L0  DEVICE HARDWARE     マイク・スピーカー・センサー
```

---

## 使い方

```bash
# ローカルサーバーで起動（HTTPS必須 — センサーAPIの要件）
npx serve .

# または Python
python3 -m http.server 8000
```

スマートフォンの場合は `https://` 環境でアクセスする（localhost は例外的に http でも動作）。

### 基本操作

1. **SONAR タブ** — 信号を選択 →「▶ PING」でワンショット計測 /「◉ CONT」で連続計測
2. **EM/SENSOR タブ** — iOS の場合は許可ボタンをタップ → センサーデータがリアルタイム更新
3. **MEDIATION タブ** — 全センサーの統合指標をリングゲージ＋レーダーで確認
4. **PROFILE タブ** — 空間分類タグとプロトコルスタックの確認

## ファイル構成

```
index.html    ← 全機能を含む単一ファイル（~1,160行）
README.md     ← このファイル
```

ゼロビルド・ゼロインストール設計。`index.html` をブラウザで開くだけで動作する。

---

## ライセンス

実験的プロトタイプ。Phase-Law Architecture の概念実証として開発。

---

*pTCP v0.6 IPC | Information Physical Connector | Phase-Law Architecture*
