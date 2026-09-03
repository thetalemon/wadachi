import { TutorialStep } from './tutorial-step'
import { CodeBlock } from './code-block'

const create = `create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');
`.trim()

const rls = `alter table notes enable row level security;
create policy "Allow public read access" on notes
for select
using (true);`.trim()

const server = `import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim()

const client = `'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim()

export function FetchDataSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="テーブルを作成してデータを挿入する">
        <p>
          Supabase プロジェクトの
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            Table Editor
          </a>
          でテーブルを作成し、例となるデータを挿入してください。サンプルが必要な場合は、以下を
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            SQL Editor
          </a>
          に貼り付けて実行できます。
        </p>
        <CodeBlock code={create} />
      </TutorialStep>

      <TutorialStep title="Row Level Security (RLS) を有効化">
        <p>
          Supabase ではデフォルトで Row Level Security (RLS) が有効です。
          <code>notes</code>{' '}
          テーブルからデータを取得するにはポリシーを追加する必要があります。これは
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            Table Editor
          </a>
          か
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            SQL Editor
          </a>
          で実行できます。
        </p>
        <p>例として、公開読み取りアクセスを許可する SQL を実行できます:</p>
        <CodeBlock code={rls} />
        <p>
          You can learn more about RLS in the{' '}
          <a
            href="https://supabase.com/docs/guides/auth/row-level-security"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            Supabase docs
          </a>
          .
        </p>
      </TutorialStep>

      <TutorialStep title="Next.js から Supabase のデータを取得する">
        <p>
          非同期のサーバーコンポーネントから Supabase
          クライアントを作成してデータを取得するには、
          <code>/app/notes/page.tsx</code>{' '}
          を作成して以下のコードを追加してください。
        </p>
        <CodeBlock code={server} />
        <p>Alternatively, you can use a Client Component.</p>
        <CodeBlock code={client} />
      </TutorialStep>

      <TutorialStep title="Supabase UI ライブラリを試す">
        <p>
          <a
            href="https://supabase.com/ui"
            className="font-bold hover:underline text-foreground/80"
          >
            Supabase UI library
          </a>{' '}
          を試して、ブロックをインストールしてみましょう。例えば Realtime Chat
          ブロックは次のコマンドで追加できます。
        </p>
        <CodeBlock
          code={
            'npx shadcn@latest add https://supabase.com/ui/r/realtime-chat-nextjs.json'
          }
        />
      </TutorialStep>

      <TutorialStep title="週末で作って数百万ユーザーへスケール！">
        <p>準備ができました。あなたのプロダクトを公開しましょう！ 🚀</p>
      </TutorialStep>
    </ol>
  )
}
