# PHYSICAL PING — pTCP v0.8 IPC

**Information Physical Connector · Extended Spectrum Sensing**

スマートフォンのセンサー群を統合し、物理空間の「情報接続性」をリアルタイムで定量化する実験的Webアプリケーション。音響ソナー＋電磁波＋**RFスペクトラム＋NFCフィールド＋熱推定**による7次元空間プローブと、その統合指標である **Mediation Coefficient μ(x,t)** を算出する。

物理空間のための TCP/IP

---

## v0.8 新機能

### RF Spectrum Analyzer (WebUSB + SDR)

WebUSB API経由でRTL-SDR（RTL2832U）に直接接続し、リアルタイムRFスペクトラムを取得・解析する。SDR未接続時はバンド特性に基づくリアルタイムシミュレーションモードで動作。

| バンド | 周波数範囲 | 用途 |
|---|---|---|
| WiFi 2.4G | 2,400—2,500 MHz | 802.11 b/g/n — チャネル1/6/11のピーク検出 |
| WiFi 5G | 5,150—5,850 MHz | 802.11 a/ac/ax — UNII帯マルチバンド |
| BLE | 2,402—2,480 MHz | Bluetooth Low Energy — アドバタイズ＋データチャネル |
| FM Radio | 76—108 MHz | FM放送帯（日本仕様） |
| LTE | 700—2,700 MHz | LTE/5G — マルチバンド概要 |
| ISM 915 | 902—928 MHz | IoT/LoRa/Zigbee — ISM帯 |

機能:
- **パワースペクトラム表示**: 256ビンFFT相当のリアルタイムスペクトラム
- **ウォーターフォール表示**: 時間×周波数×強度の3次元ヒートマップ
- **ピーク自動検出**: 上位5ピークの周波数・パワーを自動抽出
- **RF密度算出**: -70dBm閾値を超えるビンの占有率
- **WebUSB SDR接続**: RTL2832Uデバイスの自動認識・接続

### NFC Field Detection (Web NFC API)

Web NFC APIによるNFCタグの検出・読み取り。13.56MHz近接場の存在を可視化する。

- **リアルタイムフィールド検出**: パルスアニメーションによるフィールド強度可視化
- **タグUID読み取り**: シリアルナンバーの自動取得
- **NDEFレコード解析**: テキスト・URL・MIMEタイプの自動パース
- **タグ履歴**: 最大16件のタグ検出ログ
- **シミュレーションモード**: Web NFC非対応環境での動作確認

### Thermal Estimation

ブラウザのサンドボックス制約下で、間接的手法により端末温度を推定する。

| データソース | 取得方法 | 寄与 |
|---|---|---|
| CPU負荷 | タイムスタンプ差分によるビジーループ測定 | 0-15°C |
| バッテリー状態 | Navigator.getBattery() API | 0-8°C (充電時+5°C) |
| 環境ベースライン | 固定仮定値 | 22°C |

機能:
- **推定温度表示**: 熱モデルに基づくリアルタイム温度推定
- **温度グラデーション**: 視覚的な温度マーカー表示
- **CPU負荷モニター**: タイムスタンプ差分法によるCPU使用率推定
- **バッテリー統合**: 充電状態による熱寄与の加算
- **熱履歴チャート**: 温度+CPU負荷の時系列グラフ
- **熱クラス分類**: COOL / NORMAL / WARM / HOT

---

## Mediation Coefficient v0.8 — 7次元拡張

```
μ(x,t) = Σ wᵢ · dᵢ(x,t)

where dᵢ ∈ {acoustic, emField, photonic, kinetic, rfDensity, nfcField, thermal}

weights:
  acoustic   = 0.25  (音響反射率)
  emField    = 0.15  (電磁場密度)
  photonic   = 0.10  (光環境)
  kinetic    = 0.15  (運動安定性)
  rfDensity  = 0.15  (RF帯域占有率)      ← NEW
  nfcField   = 0.10  (NFC近接場強度)      ← NEW
  thermal    = 0.10  (熱環境安定性)        ← NEW
```

7次元レーダーチャートによる統合可視化。各次元のバランスが空間の「情報物理結合度」を表現する。

---

## プロトコルスタック v0.8

```
L5  SPACE PROFILE      空間分類・行動推奨・環境適応
L4  MEDIATION           μ(x,t) 7次元情報物理結合係数
L3  SENSOR FUSION       音響+EM+光+慣性+RF+NFC+熱 統合
L2  ACOUSTIC SONAR      チャープ・相互相関
L2  EM FIELD            磁力計・環境光・加速度
L2  RF SPECTRUM         WebUSB SDR・周波数解析           ← NEW
L2  NFC FIELD           近接場検出・タグ読取              ← NEW
L2  THERMAL             CPU負荷・バッテリー・推定温度     ← NEW
L1  DEVICE HARDWARE     マイク・スピーカー・センサー・USB・NFC
```

---

## ブラウザ互換性 v0.8

| 機能 | Chrome (Android) | Safari (iOS) | Chrome (Desktop) | Firefox | 備考 |
|---|---|---|---|---|---|
| Sonar | ✔ | ✔ | ✔ | ✔ | マイク/スピーカー |
| Magnetometer | ✔ (Generic Sensor) | ✔ (Orientation) | — | ✔ (Orientation) | |
| Ambient Light | ✔ (Sensor) | ✔ (Camera) | — | — (Camera) | |
| Motion | ✔ | ✔ (許可必要) | — | ✔ | |
| **RF Spectrum** | ✔ (WebUSB) | ✘ (Sim only) | ✔ (WebUSB) | ✘ (Sim only) | **SDR + HTTPS必須** |
| **NFC** | ✔ (Web NFC) | ✘ (Sim only) | ✘ (Sim only) | ✘ (Sim only) | **Android Chrome限定** |
| **Thermal** | ✔ | ✔ (部分的) | ✔ | ✔ | Battery API依存 |

### WebUSB SDR 要件

- Chrome/Edge (HTTPS環境)
- RTL-SDR デバイス (RTL2832U チップセット)
- OTG アダプター (モバイル使用時)
- **注意**: 完全なRTL2832Uプロトコル実装にはベンダーコントロール転送の追加開発が必要。現在のコードはフレームワークとシミュレーションを提供。

### Web NFC 要件

- Chrome 89+ (Android のみ)
- NFC対応デバイス
- HTTPS環境

---

## 技術仕様 v0.8

| 項目 | 値 |
|---|---|
| サンプルレート (Sonar) | 44,100 Hz |
| リスニング窓 | 500 ms |
| ブランキング | 8 ms |
| 相関方式 | 正規化相互相関（NCC） |
| 距離推定 | RTT × 343 m/s ÷ 2 |
| EM スキャン間隔 | 2,000 ms |
| **RF スペクトラム bins** | **256** |
| **RF スキャン間隔** | **500 ms** |
| **NFC スキャンモード** | **連続（Web NFC）/ 2s間隔（Sim）** |
| **熱推定間隔** | **3,000 ms** |
| **CPU負荷測定** | **1M iterations busy-loop** |
| **Mediation次元数** | **7** |
| 履歴保持 | Sonar:64 / EM:32 / RF:32 / NFC:16 / Thermal:64 |
| ウォーターフォール深度 | 64 sweeps |

### 依存関係

- React 18.2.0（CDN）
- IBM Plex Mono（Google Fonts）
- **その他の外部依存なし**

---

## 使い方

```bash
# HTTPS必須（WebUSB / Web NFC / センサーAPI）
npx serve . --ssl

# localhost は例外的に http でも動作
python3 -m http.server 8000
```

### 各レイヤーの操作

1. **SONAR** — 信号選択 → PING / CONT で音響プローブ
2. **EM/SENSOR** — iOS許可ボタン → 磁力計・光・加速度のリアルタイム監視
3. **RF SPEC** — バンド選択 → START SCAN（SDR接続時はリアルデータ）
4. **NFC/THERM** — NFC SCAN開始 → タグ検出 / Thermal monitoring開始 → 温度推定
5. **MEDIATION** — 7次元リングゲージ + レーダーチャートで統合指標確認
6. **PROFILE** — 空間分類タグ + プロトコルスタック確認

---

## ファイル構成

```
index.html    ← 全機能を含む単一ファイル（~1,800行）
README.md     ← このファイル
```

ゼロビルド・ゼロインストール設計。

---

## ライセンス

実験的プロトタイプ。Phase-Law Architecture の概念実証として開発。

---

*pTCP v0.8 IPC | Information Physical Connector | Extended Spectrum Sensing | Phase-Law Architecture*
