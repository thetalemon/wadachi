import { ThemeSwitcher } from '@/components/theme-switcher'
import { ConnectSupabaseSteps } from '@/components/tutorial/connect-supabase-steps'
import { SignUpUserSteps } from '@/components/tutorial/sign-up-user-steps'
import { hasEnvVars } from '@/lib/utils'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="flex-1 flex flex-col gap-6 px-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-xl mb-4">次の手順</h2>
              <Link
                href="/create-question-set"
                className="text-sm text-blue-600"
              >
                質問セットを作成
              </Link>
            </div>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </div>
        </div>
      </div>
    </main>
  )
}
