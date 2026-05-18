'use client'

import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export function FeedbackModal({ open, onClose }: Props) {
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const submit = async () => {
    if (!message.trim()) {
      setError('请填写反馈内容')
      return
    }
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, contact }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '发送失败')
      setDone(true)
      setMessage('')
      setContact('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败')
    } finally {
      setSending(false)
    }
  }

  const close = () => {
    onClose()
    setTimeout(() => {
      setDone(false)
      setError(null)
    }, 300)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 animate-fade-up"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[var(--bg)] rounded-3xl border border-[var(--border)] shadow-card p-6"
      >
        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[rgba(90,138,96,0.1)] flex items-center justify-center text-[var(--green-ok)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="font-serif text-lg font-medium text-[var(--charcoal)] mb-1">已收到，谢谢！</div>
            <div className="text-sm text-[var(--warm-gray)] mb-5">你的反馈对我们改进产品非常重要</div>
            <button
              onClick={close}
              className="px-6 py-2 bg-[var(--charcoal)] text-white text-sm rounded-full hover:bg-[var(--gold)] transition-colors"
            >
              好的
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] tracking-[2px] text-[var(--gold)] uppercase mb-1">Feedback</div>
                <h3 className="font-serif text-lg font-medium text-[var(--charcoal)]">告诉我们你的想法</h3>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center text-xl text-[var(--warm-gray)] hover:text-[var(--charcoal)] leading-none"
                aria-label="关闭"
              >
                ✕
              </button>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="你觉得哪里好？哪里需要改进？想要什么新功能？"
              rows={5}
              maxLength={2000}
              className="w-full p-3 bg-[var(--cream)] border border-[var(--border)] rounded-xl text-sm text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] resize-none mb-3"
            />

            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="（可选）留下邮箱/微信，方便回复你"
              maxLength={100}
              className="w-full px-3 py-2.5 bg-[var(--cream)] border border-[var(--border)] rounded-xl text-sm text-[var(--charcoal)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] mb-4"
            />

            {error && (
              <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={submit}
              disabled={sending || !message.trim()}
              className={`w-full py-3 rounded-2xl text-sm font-medium tracking-wider transition-all ${
                sending || !message.trim()
                  ? 'bg-[var(--border)] text-[var(--warm-gray)] cursor-not-allowed'
                  : 'bg-[var(--charcoal)] text-white hover:bg-[var(--gold)]'
              }`}
            >
              {sending ? '发送中…' : '提交反馈'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
