import { Badge } from './ui/badge'
import { Button } from './ui/button'

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={'outline'} className="font-normal">
        Supabase の環境変数が必要です
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={'outline'} disabled>
          サインイン
        </Button>
        <Button size="sm" variant={'default'} disabled>
          サインアップ
        </Button>
      </div>
    </div>
  )
}
