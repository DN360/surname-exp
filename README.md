# surname-exp

- さまざまな名字の人が結婚する際に夫婦別姓にするかそうでないかを検証するコード
- [リスペクト元ツイート](https://twitter.com/hedalu244/status/1369563563333885957)

## 使用言語など

### 実装言語

```bash
$ node -v
v12.21.0

$ yarn tsc -v
Version 4.2.3
```

### 使用するライブラリ

|名前|バージョン|
|:---:|:---:|
|mathjs|9.2.0|
|random-seed|0.3.0|
|shuffle-array|1.0.1|
|yargs|16.2.0|

## コマンドラインでの使い方

- まず使う前に必要なパッケージをインストールする。

```bash
yarn #パッケージをインストール
```

- 次にビルド済みのプログラムで実行する

```bash
node dist/main.js -k tanaka,80 -k yamada,20 -s 0 -t 1000 -i 1000 -p 0
```

- これは `takana` が80人と`yamada`が20人いる状況でそれぞれランダムに交配を1000回行うという操作を1000回行う。乱数のシード値は`0`とする。夫婦別姓を選択する確率は0%で行う。

- 結果は次のように頻出度ごとにランキングで表示される。

```bash
$ node dist/main.js -k tanaka,80 -k yamada,20 -s 0 -t 1000 -i 1000 -p 0
テスト実行回数: 1000
交配回数: 1000
全人数: 100
別姓を選択する確率: 0%
-----------------------
元の人数
        tanaka  :       80人
        yamada  :       20人
-----------------------
        tanaka  yamada
第1位   100人(10.9%)    0人(10.9%)
第2位   93人(3%)        2人(3%)
第3位   98人(3%)        7人(3%)
第4位   87人(2.9%)      13人(2.9%)
第5位   89人(2.8%)      5人(2.8%)
第6位   95人(2.8%)      11人(2.8%)
第7位   81人(2.7%)      12人(2.7%)
第8位   88人(2.7%)      19人(2.7%)
# ...中略
```

- 実行時のオプションは `--help` オプションをつけることで表示される

```bash
$ node dist/main.js -h

Options:
      --version      Show version number                               [boolean]
  -s, --seed         シード値
  -p, --selectivity  選択的別姓が行われる確率. 少数点で指定             [number]
  -i, --iteration    実験を行う回数                     [number] [default: 1000]
  -t, --times        交配実験を行う回数                 [number] [default: 1000]
  -k, --keys         名字と個数. `tanaka,90` のようにカンマ区切りで指定する
                                                              [array] [required]
      --help         Show help                                         [boolean]
```

## インポートして使う方法

- [examples以下のファイル](./examples/test.js)のように `require` して使うことができる

```js
const surnameTester = require('../dist/main');

surnameTester([
  ['tanaka', 80],
  ['yamada', 20],
], {
  iter: 1000,
  seed: 0,
  selectivity: 0,
  testTimes: 1000,
});
```

- 具体的なオプションについての説明は [docs/README.md](./docs/README.md)を参照

## ライセンス

このプロジェクトはMITライセンスの条件でライセンスされています。

This project is licensed under the terms of the MIT license.
