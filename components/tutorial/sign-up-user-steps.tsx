import Link from "next/link";
import { TutorialStep } from "./tutorial-step";
import { ArrowUpRight } from "lucide-react";

export function SignUpUserSteps() {
  return (
    <ol className="flex flex-col gap-6">
      {process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production" ? (
        <TutorialStep title="リダイレクト URL の設定">
          <p>このアプリは Vercel 上でホストされているようです。</p>
          <p className="mt-4">
            このデプロイは
            <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
              &quot;{process.env.VERCEL_ENV}&quot;
            </span>{" "}
            上の
            <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
              https://{process.env.VERCEL_URL}
            </span>
            です。
          </p>
          <p className="mt-4">
            Supabase のリダイレクト URL を、Vercel のデプロイ先に合わせて
            <Link className="text-primary hover:text-foreground" href={"https://supabase.com/dashboard/project/_/auth/url-configuration"}>
              更新する必要があります
            </Link>
            。
          </p>
          <ul className="mt-4">
            <li>
              -{" "}
              <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                http://localhost:3000/**
              </span>
            </li>
            <li>
              -{" "}
              <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/**`}
              </span>
            </li>
            <li>
              -{" "}
              <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
                  ".vercel.app",
                  "",
                )}-*-[vercel-team-url].vercel.app/**`}
              </span>{" "}
              （Vercel のチーム URL は
              <Link className="text-primary hover:text-foreground" href="https://vercel.com/docs/accounts/create-a-team#find-your-team-id" target="_blank">
                Vercel Team settings
              </Link>
              で確認できます）
            </li>
          </ul>
          <Link href="https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls" target="_blank" className="text-primary/50 hover:text-primary flex items-center text-sm gap-1 mt-4">
            リダイレクト URL のドキュメント <ArrowUpRight size={14} />
          </Link>
        </TutorialStep>
      ) : null}
      <TutorialStep title="最初のユーザーをサインアップする">
        <p>
          <Link href="auth/sign-up" className="font-bold hover:underline text-foreground/80">
            サインアップ
          </Link>
          ページに移動して、最初のユーザーを作成してください。今はあなた自身のアカウントでも問題ありません。
        </p>
      </TutorialStep>
    </ol>
  );
}
