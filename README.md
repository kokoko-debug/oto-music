# おとのしくみ

入門者向けに、音程とメジャー／マイナー三和音を学ぶ個人用のWebアプリです。
基礎 → 練習 → 復習と進み、早見表や鍵盤で確かめられます。説明は短く、補足は必要なときだけ開きます。

## 開発と確認

必要なもの：Python 3、Node.js。npmパッケージのインストールは不要です。

```sh
node scripts/test.cjs
python scripts/build.py
python scripts/check-build.py
python -m http.server 8766 --bind 127.0.0.1 --directory dist
```

ブラウザで `http://127.0.0.1:8766/` を開きます。編集するのは `src/` です。`dist/` は生成物です。

- `practice.js`：問題・答え合わせ・復習。
- `learning.js`：基礎・早見表・鍵盤の音程／コード判定・転回形。
- `chatgpt.js`：PC用補助拡張への質問引き渡し。
- `storage.js`：このブラウザへの保存。
- `layout.html`、`styles-*.css`：画面構成とスタイル。

ビルド後は単独のHTMLで動くため、外部ライブラリの読み込みやAPI料金は不要です。
全169組の音程・全72通りの三和音／転回形・2,300通りの3鍵選択・全216通りの転回切り替え・問題14問・保存の復元を自動検査します。

## GitHub Pagesで無料公開する

このフォルダだけをリポジトリに入れます。作業用の親フォルダ、PC用ランチャー、補助拡張、確認画像は含めません。

1. GitHubで公開用のリポジトリを作成し、このフォルダの内容をアップロードします。既定ブランチは `main` にします。
2. Settings → Pages → Build and deployment → Source を **GitHub Actions** にします。
3. Actionsの「Test and publish to GitHub Pages」を実行します。以後、mainへの更新時に検査・ビルド・公開が行われます。
4. Pagesに表示されるURLをPCとiPadで開きます。PCの起動は不要です。

GitHub FreeのPagesは公開リポジトリが対象です。アプリとソースは公開されます。学習履歴はアップロードされず、使うブラウザに保存されます。
URLにはアクセス制限がありません。独自ドメインは不要です。

公式手順：[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[Actionsでの公開](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 現在の範囲

- iPad：基礎、問題、復習、早見表、鍵盤、音の再生。ホーム画面への追加はSafariの共有メニューから行えます。
- PC：上記に加えて、設定済みの補助拡張でChatGPTへ質問できます。
- 公開URLからのChatGPT自動質問は、決定したURLを補助拡張の許可対象に加えてから確認します。現時点ではPCの既存ローカルURLを対象にしています。
- 学習履歴は端末間で共有されません。公開URLはローカルのURLとは別の保存場所になります。
- コードの判定はメジャー／マイナー三和音です。七の和音は次の段階で追加します。
- iPad実機、公開後の通信、GitHub上のワークフロー実行は公開後の確認項目です。

今後は問題の種類を増やし、入門順の出題と復習を充実させます。画面の基本の操作感は引き継ぎます。
