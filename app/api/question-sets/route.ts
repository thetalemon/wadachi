import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const body = await request.json().catch(() => ({}))
  const { title, description, is_private } = body as {
    title?: string
    description?: string
    is_private?: boolean
  }

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 })
  }

  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const payload = {
    user_id: user.id,
    title,
    description: description ?? null,
    is_private: is_private ?? true
  }

  const { data, error } = await supabase
    .from('question_sets')
    .insert(payload)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
