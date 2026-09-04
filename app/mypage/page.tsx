import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/profile-form'
import { Suspense } from 'react'

export default function MyPage() {
  return (
    <Suspense fallback={<div className="p-6">読み込み中...</div>}>
      {/* MyPageContent is an async server component that accesses auth cookies */}
      <MyPageContent />
    </Suspense>
  )
}

async function MyPageContent() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (!user) redirect('/auth/login')
  // load profile row (display_name, avatar_url)
  const { data: profileData } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user?.user_metadata?.sub)
    .maybeSingle()

  // tolerate different column names that might exist in the DB
  const displayName = profileData?.display_name
  ;('')
  const avatarUrl = profileData?.avatar_url ?? ''

  // If the bucket is private, generate a signed URL server-side using the
  // service role key. Set SUPABASE_SERVICE_ROLE_KEY in your environment.
  let signedAvatarUrl: string | null = null
  let signDebug: {
    ok: boolean
    status: number
    body?: any
    reason?: string
  } | null = null
  if (avatarUrl) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!supabaseUrl) {
        signDebug = {
          ok: false,
          status: 0,
          reason: 'missing NEXT_PUBLIC_SUPABASE_URL'
        }
      } else if (!serviceKey) {
        signDebug = {
          ok: false,
          status: 0,
          reason: 'missing SUPABASE_SERVICE_ROLE_KEY'
        }
      } else if (!avatarUrl.includes('/storage/v1/object/')) {
        signDebug = {
          ok: false,
          status: 0,
          reason: 'avatarUrl not a storage object URL'
        }
      } else if (!avatarUrl.includes('/avatars/')) {
        signDebug = {
          ok: false,
          status: 0,
          reason: 'avatarUrl does not contain /avatars/'
        }
      } else {
        // support both /storage/v1/object/public/avatars/... and /storage/v1/object/avatars/...
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
        signDebug = { ok: r.ok, status: r.status, body: j }
        if (r.ok && j) {
          const candidate =
            j.signedURL || j.signedUrl || j.signed_url || j.signedUrl
          if (typeof candidate === 'string' && candidate.startsWith('/')) {
            // signedURL may be returned as a relative path like
            // "/object/sign/avatars/.." — convert to full URL
            signedAvatarUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1${candidate}`
          } else {
            signedAvatarUrl = candidate
          }
        }
      }
    } catch (e) {
      // ignore and fall back to avatarUrl (which may be inaccessible)
    }
  }

  // Choose an avatar URL to pass to the client form: prefer signed URL; otherwise
  // route storage object paths through our server proxy so the browser doesn't
  // have to call the Supabase sign endpoint directly.
  const supabaseUrlBase =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? ''
  const initialAvatarForClient =
    signedAvatarUrl ??
    (avatarUrl?.startsWith('/storage/v1/object/')
      ? `${supabaseUrlBase}${avatarUrl}`
      : avatarUrl || undefined)

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      <p className="mb-4">ようこそ、{displayName || user.email}さん</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">プロフィール編集</h2>
        <ProfileForm
          initialDisplayName={displayName}
          initialAvatar={initialAvatarForClient}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">アカウント情報</h2>
        {avatarUrl ? (
          <img
            src={signedAvatarUrl ?? avatarUrl}
            alt="avatar"
            className="h-16 w-16 rounded-full mb-2 object-cover"
          />
        ) : null}
        <p className="mt-2 text-sm">表示名: {displayName || '-'}</p>
        <p className="mt-2 text-sm">ユーザーID: {user?.id || '-'}</p>
        <div className="mt-4 text-xs">
          <strong>profiles row (debug):</strong>
          <pre className="mt-2 text-sm">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        </div>
        {signDebug ? (
          <div className="mt-4 text-xs">
            <strong>signed URL debug:</strong>
            <pre className="mt-2 text-sm">
              {JSON.stringify(signDebug, null, 2)}
            </pre>
          </div>
        ) : null}
        <div className="mt-4 text-xs">
          <strong>auth user (debug):</strong>
          <pre className="mt-2 text-sm">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </section>
    </div>
  )
}
