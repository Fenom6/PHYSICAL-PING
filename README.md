# PHYSICAL-PING# Physical Ping — pTCP v0.1

**物理空間に対するPingプロトコルの実装**

ネットワークにおけるICMP Pingと同様の原理で、物理空間に音響パルスを送信し、環境からの反響（エコー）を計測することで「物理的レイテンシ」を数値化するツールです。

> *Foundation in silicon, wings at light speed, heart in quantum.*

---

## コンセプト

インターネットでは `ping 8.8.8.8` で通信経路の遅延を計測できます。Physical Pingはこれと同じ発想を物理空間に適用します。

| Network Ping | Physical Ping |
|---|---|
| ICMPエコーリクエスト送信 | 2kHz 音響パルス発射（5ms） |
| ルーター/ホストの応答 | 壁・天井・物体からの反響 |
| RTT（往復遅延時間） | 音響RTT → 物理的レイテンシ |
| TTL / ホップ数 | 空間分類（NEAR-FIELD / ROOM / HALL / OPEN / DISTANT） |
| パケットロス | エネルギー閾値未達 → タイムアウト |

## 計測指標

- **RTT (ms)** — パルス発射から反響検出までの往復時間
- **距離推定 (m)** — `(RTT / 2) × 343 m/s`（空気中の音速@20℃）で反射面までの距離を逆算
- **ピークエネルギー** — 反響の強度。空間の反射率・吸音特性の指標
- **ジッター (ms)** — 連続計測におけるRTTの変動幅。空間の動的安定性を示す
- **パケットロス率 (%)** — 応答なし率。開放空間と閉鎖空間の識別に利用

## 空間分類

| クラス | RTT | 意味 |
|---|---|---|
| NEAR-FIELD | < 5ms | 近接反射面（~0.86m以内） |
| ROOM | 5–20ms | 一般的な室内 |
| HALL | 20–50ms | 広い空間・ホール |
| OPEN | 50–150ms | 開放的な空間 |
| DISTANT | > 150ms | 遠距離反射 / 屋外 |

## デモ

```
PHYSICAL PING 192.168.phys.0 — 2000Hz sine, 5ms pulse

seq=0x3A1F  time=12ms   class=ROOM       dist=2.06m   peak=0.0234
seq=0xB7C2  time=14ms   class=ROOM       dist=2.40m   peak=0.0198
seq=0x5E90  time=11ms   class=ROOM       dist=1.89m   peak=0.0251
seq=0x82D4  time=---    class=TIMEOUT    dist=---     peak=0.0012

--- physical ping statistics ---
4 packets transmitted, 3 received, 25% loss
rtt min/avg/max/jitter = 11/12.3/14/1.5 ms
```

## セットアップ

### 必要なもの

- スマートフォンまたはPC（スピーカー + マイク搭載）
- HTTPSでホストされた環境（マイクアクセスに必要）
- 対応ブラウザ: Chrome / Edge / Firefox / Safari



### ローカルで試す

```bash
# HTTPS が必要なため、簡易サーバーでは動作しない場合があります
# localhostは例外的にHTTPでもマイクアクセスが許可されます
python -m http.server 8000
# http://localhost:8000 でアクセス
```

## 使い方

1. **PING** ボタンを押す → マイクの使用許可を求められたら許可
2. スピーカーから短い音響パルスが発射される
3. マイクが環境からの反響を500ms間リスニング
4. エネルギー閾値を超える反響を検出した時点のRTTを記録
5. **CONTINUOUS** で連続計測モード（500ms〜5000ms間隔で自動実行）

### 計測のコツ

- **静かな環境**で計測すると精度が向上します
- **壁に向かって**計測すると明確な反射が得られます
- 手で端末の前を覆うと NEAR-FIELD の反応が確認できます
- 屋外では TIMEOUT が増加し、開放空間を識別できます

## 技術仕様

```
送信パルス: 2000Hz 正弦波 / 5ms duration / gain 0.8
受信解析:   AnalyserNode (FFT 2048) / Float32TimeDomain
閾値:       0.008 RMS
リスン窓:   500ms（初期10msはパルス直接音として除外）
サンプリング: 44100Hz
距離計算:   音速 343 m/s（空気中・20℃）
```

## プロジェクト構造

```
physical-ping/
├── index.html          # スタンドアロンHTML（React CDN版）
├── physical-ping.jsx   # React コンポーネント版（参考実装）
└── README.md
```

## pTCPフレームワークにおける位置づけ

Physical Pingは **pTCP（physical Transmission Control Protocol）** の最下層プリミティブ——物理空間版ICMPに相当します。

```
┌─────────────────────────────────────────────┐
│  Application Layer                          │
│  Void Mediator / 環境適応エンジン             │
├─────────────────────────────────────────────┤
│  Transport Layer                            │
│  空間帯域幅推定 / フロー制御                  │
├─────────────────────────────────────────────┤
│  Network Layer                              │
│  Physical Traceroute / 空間ルーティング       │
├─────────────────────────────────────────────┤
│  Physical Layer  ◀── YOU ARE HERE           │
│  Physical Ping / 音響プローブ / センサー入力  │
└─────────────────────────────────────────────┘
```

### ロードマップ

- **Physical Traceroute** — 複数周波数パルスで反射層を分離し、空間の「ホップ数」を計測
- **空間帯域幅推定** — パルス間隔と応答劣化の関係から空間の情報伝搬容量を推定
- **マルチセンサー統合** — 加速度・ジャイロ・気圧センサーを組み合わせた複合プローブ
- **Void Mediator連携** — 物理レイテンシをmediation coefficientの入力パラメータとして統合

## 制限事項

- 音響ベースのため、環境ノイズの影響を受けます
- スピーカー→マイク間の直接音（クロストーク）が初期ノイズとなるため、10ms未満の計測精度には限界があります
- ブラウザのオーディオ処理レイテンシ（数ms）が計測値に含まれます
- iOS Safari ではユーザージェスチャー後にAudioContextの開始が必要な場合があります

## ライセンス

MIT

---

*pTCP Physical Layer v0.1 — 物理空間のための通信プロトコル*
