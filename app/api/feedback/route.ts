import { NextRequest, NextResponse } from 'next/server'

const FEEDBACK_EMAIL = 'katielin0207@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { message, contact } = await req.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: '请填写反馈内容' }, { status: 400 })
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: '反馈过长（最多 2000 字）' }, { status: 400 })
    }

    const res = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: '焕颜AI 用户反馈',
        _template: 'box',
        _captcha: 'false',
        反馈内容: message.trim(),
        联系方式: contact?.trim() || '（未填写）',
        提交时间: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('FormSubmit failed:', res.status, text)
      throw new Error('转发服务失败')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Feedback error:', err)
    return NextResponse.json({ error: '发送失败，请稍后重试' }, { status: 500 })
  }
}
