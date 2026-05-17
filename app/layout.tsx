import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '焕颜AI — 专属形象诊断',
  description: '上传一张照片，AI 分析你的色彩季型、脸型、身材，给出专属穿搭建议',
  keywords: '色彩季型,形象诊断,穿搭建议,OOTD,AI形象顾问',
  openGraph: {
    title: '焕颜AI — 专属形象诊断',
    description: '30秒获得你的专属色彩季型与穿搭方案',
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500&family=Noto+Serif+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
