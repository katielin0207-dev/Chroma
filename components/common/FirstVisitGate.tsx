'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const KEY = 'huanyan_visited'

/**
 * Mounted on the landing page.
 * - First visit: sets the flag, shows landing page normally.
 * - Returning visit: redirects to /upload immediately.
 * - ?showLanding=1 forces landing page to show regardless (used by the
 *   "查看功能介绍" link on the upload page).
 */
export function FirstVisitGate() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const forceShow = searchParams.get('showLanding') === '1'
    if (forceShow) return // always show landing when explicitly requested

    const visited = localStorage.getItem(KEY)
    if (visited) {
      router.replace('/upload')
    } else {
      localStorage.setItem(KEY, '1')
    }
  }, [router, searchParams])

  return null
}
