'use client'

import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export const LogoutButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    await logout()
    if (onClick) onClick(e)
  }

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={cn(className, 'w-full text-left')}
      onClick={handleClick}
      {...props}
    >
      ログアウト
    </button>
  )
})

LogoutButton.displayName = 'LogoutButton'
