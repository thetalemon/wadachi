export default function Head() {
  return (
    <>
      <meta
        name="supabase-url"
        content={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}
      />
      <meta
        name="supabase-publishable-key"
        content={process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''}
      />
      <meta
        name="supabase-anon-key"
        content={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__NEXT_PUBLIC_SUPABASE_URL = ${JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
          )}; window.__NEXT_PUBLIC_SUPABASE_KEY = ${JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
              ''
          )};`
        }}
      />
    </>
  )
}
