'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { LogoutButton } from './logout-button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from './ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

export function AuthButton() {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    createBrowserClient().then((supabase) => supabase.auth.getUser()).then(({ data }) => {
      if (!mounted) return
      setUser(data?.user ?? null)
      // fetch profile for avatar
      if (data?.user) {
        fetch('/api/profile')
          .then((r) => r.json())
          .then((j) => {
            if (!mounted) return
            const signed = j?.signedAvatarUrl
            const avatarPath = j?.data?.avatar_url
            if (signed) {
              setAvatar(signed)
            } else if (avatarPath) {
              const supabaseBase =
                process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? ''
              setAvatar(
                avatarPath.startsWith('/storage/v1/object/')
                  ? `${supabaseBase}${avatarPath}`
                  : avatarPath
              )
            }
          })
          .catch(() => {})
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const [avatar, setAvatar] = useState<string | null>(null)

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="ユーザーメニュー"
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium overflow-hidden"
          >
            {avatar ? (
              // prefer user avatar image
              <img
                src={avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : user.email ? (
              user.email.charAt(0).toUpperCase()
            ) : (
              'U'
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/mypage">マイページ</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        <Link href="/auth/login">サインイン</Link>
      </Button>
      <Button asChild size="sm" variant={'default'}>
        <Link href="/auth/sign-up">サインアップ</Link>
      </Button>
    </div>
  )
}
