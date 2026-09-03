import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return new NextResponse('Bad Request', { status: 400 })

  const { display_name, avatar_url } = body

  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const user = userData?.user
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // Upsert into `profiles` table. Ensure you have created this table in your DB.
  const payload = {
    id: user.id,
    display_name: display_name ?? null,
    avatar_url: avatar_url ?? null,
    updated_at: new Date().toISOString()
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { returning: 'representation' })

    if (error) {
      return NextResponse.json(
        { ok: false, error, user: { id: user.id, email: user.email }, payload },
        { status: 500 }
      )
    }

    // If an avatar path was provided and we have a service role key, generate
    // a temporary signed URL to return to the client so the browser doesn't
    // have to call the Supabase sign endpoint directly.
    let signedAvatarUrl: string | null = null
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      const savedAvatar = payload.avatar_url ?? null
      if (
        supabaseUrl &&
        serviceKey &&
        savedAvatar &&
        savedAvatar.includes('/avatars/')
      ) {
        const idx = savedAvatar.lastIndexOf('/avatars/')
        const sub = savedAvatar.substring(idx + '/avatars/'.length)
        const signUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/sign/avatars/${encodeURI(sub)}`
        const r = await fetch(signUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ expiresIn: 60 })
        })
        const j = await r.json().catch(() => null)
        if (r.ok && j) {
          const candidate = j.signedURL || j.signedUrl || j.signed_url
          if (typeof candidate === 'string') {
            signedAvatarUrl = candidate.startsWith('/')
              ? `${supabaseUrl.replace(/\/$/, '')}/storage/v1${candidate}`
              : candidate
          }
        }
      }
    } catch (e) {
      // ignore signing errors; still return the upserted data
    }

    return NextResponse.json({ ok: true, data, signedAvatarUrl })
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: { message: String(err) },
        user: { id: user.id, email: user.email },
        payload
      },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  // attempt to create a signed URL for private buckets
  let signedAvatarUrl: string | null = null
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const avatarUrl = profileData?.avatar_url ?? null
    if (supabaseUrl && serviceKey && avatarUrl && avatarUrl.includes('/avatars/')) {
      const idx = avatarUrl.lastIndexOf('/avatars/')
      const sub = avatarUrl.substring(idx + '/avatars/'.length)
      const signUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/sign/avatars/${encodeURI(sub)}`
      const r = await fetch(signUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiresIn: 60 })
      })
      const j = await r.json().catch(() => null)
      if (r.ok && j) {
        const candidate = j.signedURL || j.signedUrl || j.signed_url
        if (typeof candidate === 'string') {
          signedAvatarUrl = candidate.startsWith('/')
            ? `${supabaseUrl.replace(/\/$/, '')}/storage/v1${candidate}`
            : candidate
        }
      }
    }
  } catch (e) {
    // ignore
  }

  return NextResponse.json({ ok: true, data: profileData ?? null, signedAvatarUrl })
}
