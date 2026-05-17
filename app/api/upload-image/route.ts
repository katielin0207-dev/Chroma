import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, BUCKET_NAME } from '@/lib/supabase'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '请上传图片文件' }, { status: 400 })
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: '只支持 JPG、PNG、WebP 格式' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: '图片大小不能超过 10MB' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
    const fileName = `portraits/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: '上传失败，请重试' },
        { status: 500 }
      )
    }

    const { data } = getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return NextResponse.json({ publicUrl: data.publicUrl })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: '服务器错误，请重试' }, { status: 500 })
  }
}
