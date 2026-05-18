import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const OWNER_EMAIL = 'katielin0207@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { message, contact } = await req.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: '请填写反馈内容' }, { status: 400 })
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: '反馈过长（最多 2000 字）' }, { status: 400 })
    }

    const trimmedMessage = message.trim()
    const trimmedContact = contact?.trim() || null

    // 1. Save to Supabase (always)
    const supabase = getSupabaseAdmin()
    await supabase.from('feedback').insert({
      message: trimmedMessage,
      contact: trimmedContact,
    })

    // 2. Send email via Resend (if API key is configured)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      const html = `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1C1814">
          <h2 style="font-size:18px;margin-bottom:16px;color:#B89060">焕颜AI · 用户反馈</h2>
          <p style="background:#F2EBE0;padding:14px 16px;border-radius:10px;line-height:1.7;white-space:pre-wrap">${trimmedMessage}</p>
          ${trimmedContact ? `<p style="margin-top:12px;font-size:13px;color:#8C7E72">联系方式：${trimmedContact}</p>` : ''}
          <p style="margin-top:8px;font-size:12px;color:#8C7E72">提交时间：${time}</p>
        </div>
      `
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: OWNER_EMAIL,
          subject: '焕颜AI 收到新反馈',
          html,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Feedback error:', err)
    return NextResponse.json({ error: '发送失败，请稍后重试' }, { status: 500 })
  }
}
