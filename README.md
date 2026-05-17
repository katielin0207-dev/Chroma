# Chroma — 焕颜AI

AI-powered personal image analysis. Upload a portrait photo and get your color season, face shape, body type analysis, and a complete wardrobe diagnosis.

## Features

- **色彩季型** — 12-season color analysis with personalized palette swatches
- **脸型分析** — Face shape detection with neckline & hairstyle recommendations
- **身材分析** — Body type analysis with silhouette guidance
- **穿搭风格** — Style profile with outfit formula
- **场合建议** — Occasion-based outfit sets with styling logic
- **衣橱诊断** — Upload clothing photos → AI judges compatibility → builds complete OOTD looks

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **通义千问VL** (Qwen Vision Language API via DashScope)
- **Supabase Storage** (portrait & clothing image hosting)
- **Tailwind CSS** (warm cream/gold design system)

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
QWEN_API_KEY=
```

See `.env.local.example` for details.
