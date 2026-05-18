'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FeedbackModal } from './FeedbackModal'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[var(--bg)] border-b border-[var(--border)]">
        <Link href="/" className="font-serif text-[var(--charcoal)] text-lg tracking-tight">
          焕颜<span className="text-[var(--gold)]">AI</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 border border-[var(--border)] text-[var(--warm-gray)] text-sm rounded-full hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors duration-200"
        >
          <span className="text-base leading-none">✉</span>
          <span>反馈</span>
        </button>
      </nav>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
