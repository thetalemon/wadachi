import { ThemeSwitcher } from '@/components/theme-switcher'
import { ConnectSupabaseSteps } from '@/components/tutorial/connect-supabase-steps'
import { SignUpUserSteps } from '@/components/tutorial/sign-up-user-steps'
import { hasEnvVars } from '@/lib/utils'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">次の手順</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </div>
        </div>
      </div>
    </main>
  )
}
