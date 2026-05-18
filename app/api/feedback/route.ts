import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { message, contact } = await req.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: '请填写反馈内容' }, { status: 400 })
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: '反馈过长（最多 2000 字）' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('feedback').insert({
      message: message.trim(),
      contact: contact?.trim() || null,
    })

    if (error) {
      console.error('Supabase feedback insert error:', error)
      return NextResponse.json({ error: '发送失败，请稍后重试' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Feedback error:', err)
    return NextResponse.json({ error: '发送失败，请稍后重试' }, { status: 500 })
  }
}
