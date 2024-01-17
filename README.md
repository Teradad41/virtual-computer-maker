# Project 4 - Computer Builder

## 🌱概要
パーツを選んで仮想のコンピュータを組み立て、その性能を評価・比較するアプリケーション

## 🏠URL
https://teradad41.github.io/computer_builder/

## ✨デモ
https://github.com/Teradad41/computer_builder/assets/107381511/cdc22989-e920-4393-b48e-349a62afa04f

## 📝説明
ユーザーがコンピュータの構成を調べたり組み立てたりできるアプリを作成しました。

全てのパーツを選択して追加すると、その性能をスコア化して表示します。

コンピュータは以下のパーツで構成されています。
- CPU
- GPU
- RAM
- ストレージ（HDDまたはSSD）

ゲーミングコンピュータは、以下の基準を使用します。
- GPU性能：60%
- CPU性能：25%
- RAM：12.5%
- ストレージ：2.5%（SSDであれば１０％）

作業用コンピュータは、以下の基準を使用します。
- CPU性能：60%
- GPU性能：25%
- RAM：10%
- ストレージ：5%

## 💾使用技術
<table>
<tr>
  <th>カテゴリ</th>
  <th>技術スタック</th>
</tr>
<tr>
  <td rowspan=4>フロントエンド</td>
  <td>HTML</td>
</tr>
<tr>
  <td>CSS</td>
</tr>
<tr>
  <td>フレームワーク : Bootstrap</td>
</tr>
<tr>
  <td>JavaScript</td>
</tr>
<td rowspan=2>その他</td>
  <td>Git</td>
</tr>
<tr>
  <td>GitHub</td>
  </tr>
</table>

## 📜作成の経緯
このプロジェクトは以下のことを学習し、理解を深める目的で行いました
- Web API とエンドポイント
- fetch 関数と Promise オブジェクト
- JSON
- JavaScript での DOM 操作

## 💻学んだこと
- API から取得したデータを変換し、ブラウザに表示させる操作
- 非同期通信における Promise オブジェクトの扱い方
- JavaScript内でのブラウザイベントの使い方
- 命令的な DOM 操作

## ⭐️こだわったこと
- 各パーツのデータを取得するために fetch 関数を使い、ウェブクライアント内でサーバーから動的にデータを取得し、レンダリングしたこと
- マップを用いて、ストレージのサイズが降順で表示されるようにソートしたこと

## 📮今後実装したいこと
- [ ] ReactでSPA化

## 📑参考文献
### 公式ドキュメント
- [Bootstrap](https://getbootstrap.jp/)

### README
- [Aki](https://github.com/Aki158)さん
