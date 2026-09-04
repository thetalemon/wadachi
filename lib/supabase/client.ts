import { createBrowserClient } from '@supabase/ssr'

function readMeta(name: string) {
  try {
    if (typeof document === 'undefined') return undefined
    return (
      document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ??
      undefined
    )
  } catch {
    return undefined
  }
}

export async function createClient() {
  let SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    (typeof window !== 'undefined'
      ? (window as any).__NEXT_PUBLIC_SUPABASE_URL
      : undefined) ??
    readMeta('supabase-url')

  let SUPABASE_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    (typeof window !== 'undefined'
      ? (window as any).__NEXT_PUBLIC_SUPABASE_KEY
      : undefined) ??
    readMeta('supabase-publishable-key') ??
    readMeta('supabase-anon-key')

  if ((!SUPABASE_URL || !SUPABASE_KEY) && typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/supabase-config')
      if (res.ok) {
        const json = await res.json()
        SUPABASE_URL = SUPABASE_URL || json?.url
        SUPABASE_KEY = SUPABASE_KEY || json?.key
      }
    } catch {
      // ignore
    }
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (typeof window !== 'undefined') {
      throw new Error(
        "@supabase/ssr: Your project's URL and API key are required to create a Supabase client!"
      )
    }
  }

  return createBrowserClient(SUPABASE_URL!, SUPABASE_KEY!)
}
