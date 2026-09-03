'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { createClient } from '@/lib/supabase/client'

export default function ProfileForm({
  initialDisplayName = '',
  initialAvatar = ''
}: {
  initialDisplayName?: string
  initialAvatar?: string
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [avatar, setAvatar] = useState(initialAvatar)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const { res, body } = await saveProfile({
        display_name: displayName,
        avatar_url: avatar
      })

      if (res.ok) {
        setMessage('保存しました')
      } else if (res.status === 401) {
        setMessage('ログインしてください')
      } else if (body?.error) {
        setMessage(
          'エラー: ' + (body.error.message ?? JSON.stringify(body.error))
        )
      } else {
        setMessage('エラー: ' + (body ? JSON.stringify(body) : '不明なエラー'))
      }
    } catch (err) {
      setMessage('通信エラー')
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile(payload: {
    display_name?: string
    avatar_url?: string
  }) {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    })
    const body = await res.json().catch(() => null)
    return { res, body }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        setMessage('ログインしてください')
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      // filePath should be relative to the bucket — do not include the bucket name twice
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        setMessage('アップロードに失敗しました: ' + uploadError.message)
        return
      }

      // Use a local object URL for immediate preview (avoid fetching public URL)
      const localPreview = URL.createObjectURL(file)
      setAvatar(localPreview)
      setMessage('アップロード完了')

      // Build a storage object path (server will sign if bucket is private)
      // Save the non-public object path so the server can sign it when needed.
      const storagePath = `/storage/v1/object/avatars/${filePath}`

      // Auto-save profile after successful upload (save storage path, not the fetched public URL)
      try {
        setLoading(true)
        const { res, body } = await saveProfile({
          display_name: displayName,
          avatar_url: storagePath
        })
        if (res.ok) {
          setMessage('アップロード完了・保存しました')
          // If the server returned a signed URL, use it for the avatar preview
          if (body?.signedAvatarUrl) {
            setAvatar(body.signedAvatarUrl)
          }
        } else if (body?.error) {
          setMessage(
            '保存エラー: ' + (body.error.message ?? JSON.stringify(body.error))
          )
        }
      } catch (err) {
        setMessage('アップロード後の保存でエラーが発生しました')
      } finally {
        setLoading(false)
      }
    } catch (err) {
      setMessage('アップロード中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl">
      <label className="block mb-2 text-sm font-medium">表示名</label>
      <input
        className="w-full mb-4 rounded border px-3 py-2"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <label className="block mb-2 text-sm font-medium">アバター画像URL</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="mb-4"
      />

      {avatar ? (
        <div className="mb-4">
          <p className="text-xs mb-1">プレビュー:</p>
          <img
            src={avatar}
            alt="avatar"
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </Button>
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
    </form>
  )
}
