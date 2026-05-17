import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[var(--bg)] border-b border-[var(--border)]">
      <Link href="/" className="font-serif text-[var(--charcoal)] text-lg tracking-tight">
        焕颜<span className="text-[var(--gold)]">AI</span>
      </Link>
      <Link
        href="/upload"
        className="px-4 py-1.5 bg-[var(--charcoal)] text-white text-sm rounded-full hover:bg-[var(--gold)] transition-colors duration-200"
      >
        免费测试
      </Link>
    </nav>
  )
}
