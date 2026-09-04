import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">読み込み中...</div>}>
      <Notes />
    </Suspense>
  )
}

async function Notes() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
