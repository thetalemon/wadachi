<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js と Supabase スターターキット - Next.js と Supabase でアプリを素早く構築する最速の方法" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js と Supabase スターターキット</h1>
</a>

<p align="center">
 Next.js と Supabase でアプリを素早く構築する最速の方法
</p>

<p align="center">
  <a href="#features"><strong>特徴</strong></a> ·
  <a href="#demo"><strong>デモ</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Vercelへデプロイ</strong></a> ·
  <a href="#clone-and-run-locally"><strong>クローンしてローカルで実行</strong></a> ·
  <a href="#feedback-and-issues"><strong>フィードバックと問題</strong></a>
  <a href="#more-supabase-examples"><strong>その他の例</strong></a>
</p>
<br/>

## 特徴

- Next.js のあらゆるスタックで動作します（[Next.js](https://nextjs.org)）
  - App Router
  - Pages Router
  - Proxy
  - Client
  - Server
  - そのまま動作します
- supabase-ssr: Supabase Auth をクッキーで動作させるためのパッケージ
- [Supabase UI ライブラリ](https://supabase.com/ui/docs/nextjs/password-based-auth) を使用したパスワード認証ブロックを組み込み済み
- [Tailwind CSS](https://tailwindcss.com) によるスタイリング
- [shadcn/ui](https://ui.shadcn.com/) を使ったコンポーネント
- 任意で [Supabase と Vercel の統合経由のデプロイ](#deploy-your-own) が可能
  - 環境変数は Vercel プロジェクトに自動的に割り当てられます

## デモ

完全に動作するデモは [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/) で確認できます。

## Vercel へのデプロイ

Vercel でのデプロイは Supabase アカウントとプロジェクトの作成を案内します。

Supabase 統合をインストールすると、関連する環境変数がプロジェクトに自動で割り当てられ、デプロイがそのまま機能するようになります。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

上記はスターターキットを GitHub にクローンする操作も含みます。クローン後はローカルで開発できます。

ローカルでのみ開発したい場合は、以下の手順に従ってください。

## クローンしてローカルで実行

1. まず Supabase プロジェクトが必要です。Supabase ダッシュボードから作成できます: [Supabase ダッシュボード](https://database.new)

2. 次に、Supabase スターターテンプレートを使って Next.js アプリを作成します（npx の例）

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

3. `cd` を使ってアプリのディレクトリに移動します

   ```bash
   cd with-supabase-app
   ```

4. `.env.example` を `.env.local` にリネームし、以下を更新します:

```env
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
```

> 注記
> この例では `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を使用しています。これは Supabase の新しい **publishable** キー形式を指します。
> 旧来の **anon** キーと新しい **publishable** キーはいずれもこの変数名で移行期間中は使用できます。Supabase ダッシュボードに `NEXT_PUBLIC_SUPABASE_ANON_KEY` と表示されている場合は、その値を使用してください。
> 詳細は [公開アナウンス](https://github.com/orgs/supabase/discussions/29260) を参照してください。

`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` はいずれも [Supabase プロジェクトの API 設定](https://supabase.com/dashboard/project/_?showConnect=true) で確認できます。

5. 開発用の Next.js サーバーを起動します:

   ```bash
   npm run dev
   ```

   スターターキットは [localhost:3000](http://localhost:3000/) で動作するはずです。

6. このテンプレートはデフォルトで shadcn/ui のスタイルが初期化されています。別の shadcn/ui スタイルを使いたい場合は `components.json` を削除して [shadcn/ui を再インストール](https://ui.shadcn.com/docs/installation/next) してください。

> ローカルで Supabase を実行する方法については、[Local Development のドキュメント](https://supabase.com/docs/guides/getting-started/local-development) を参照してください。

## フィードバックと問題

フィードバックや問題は [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose) にファイルしてください。

## その他の Supabase 例

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (無料コース)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth と Next.js App Router の例](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
