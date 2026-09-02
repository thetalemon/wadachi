import { TutorialStep } from "./tutorial-step";

export function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Supabase プロジェクトを作成する">
        <p>
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="font-bold hover:underline text-foreground/80"
            rel="noreferrer"
          >
            database.new
          </a>
          で新しい Supabase プロジェクトを作成してください。
        </p>
      </TutorialStep>

      <TutorialStep title="環境変数を設定する">
        <p>
          Next.js アプリ内の
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.example
          </span>
          を
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.local
          </span>
          にリネームし、Supabase プロジェクトの API
          設定から値をコピーしてください。
        </p>
      </TutorialStep>

      <TutorialStep title="開発サーバーを再起動する">
        <p>
          新しい環境変数を読み込むために、Next.js の開発サーバーを終了して
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            npm run dev
          </span>
          を再実行する必要がある場合があります。
        </p>
      </TutorialStep>

      <TutorialStep title="ページを更新する">
        <p>
          Next.js
          が新しい環境変数を読み込むためにページの更新が必要な場合があります。
        </p>
      </TutorialStep>
    </ol>
  );
}
