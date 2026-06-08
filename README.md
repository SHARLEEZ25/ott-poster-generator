<div align="center">

# OTT Poster Generator

**MVP client build — proving the core AI pipeline works end-to-end.**

Upload a video → AI picks the best frame → describe your film → get a cinematic poster in seconds.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)

</div>

---


## What Was Built

An MVP built for a client to demonstrate that the full AI pipeline works. Covers the complete flow from video upload to generated poster:

- **AI frame analysis** — Gemini 2.5 Flash analyzes the uploaded video via the Gemini File API, identifies the most cinematic frame by timestamp, and returns a detailed scene description that grounds the poster in the actual footage
- **Video processing pipeline** — FFmpeg extracts the Gemini-selected frame at the exact timestamp; no system FFmpeg required (bundled binary via `@ffmpeg-installer`)
- **AI generation pipeline** — FLUX.1-schnell via Hugging Face Inference API; Gemini's frame description is woven into the cinematic prompt for visually grounded output
- **REST API** — Express 5, MVC architecture, input validation, rate limiting (10 req/hr per IP), safe error responses
- **React SPA** — TypeScript, responsive design, routing, project management, community gallery
- **Data persistence** — MongoDB Atlas + Mongoose; every generated poster saved with full metadata

---

## The Problem It Solves

Indie filmmakers and short-film creators spend heavily on poster designers — a barrier that kills visibility for low-budget productions. This platform removes that barrier: upload footage, pick a scene, fill in a creative brief, and walk away with a cinematic AI-generated poster in seconds.



---

## Architecture

```
┌──────────────────────────────────────────────┐
│           React 18 SPA  (Vite + TS)          │
│   Upload · Generator · Gallery · Dashboard   │
│              TailwindCSS · React Router       │
└──────────────────┬───────────────────────────┘
                   │  HTTP REST (JSON)
┌──────────────────▼───────────────────────────┐
│         Node.js + Express 5 REST API         │
│                                              │
│  POST /api/videos/upload-video               │
│  POST /api/posters/generate   [rate-limited] │
│  GET  /api/projects                          │
│  POST /api/projects                          │
└────────┬─────────────────┬────────────────── ┘
         │                 │
   ┌─────▼──────┐  ┌───────▼──────────────────┐
   │  MongoDB   │  │     External Services     │
   │  Atlas     │  │  Gemini 2.5 Flash API  │
   │  Mongoose  │  │  HuggingFace FLUX.1-schnell│
   └────────────┘  │  FFmpeg  (frame extract)  │
                   └──────────────────────────┘
```

---

## How It Works

### Current Implementation — Gemini-grounded image generation

| Step | What Happens | Tech |
|------|-------------|------|
| 1. Upload video | User uploads footage | Multer → temp storage |
| 2. Gemini analysis | Video uploaded to Gemini File API; Gemini 2.5 Flash identifies the most cinematic frame by timestamp and returns a detailed scene description | `@google/generative-ai` |
| 3. Frame extraction | FFmpeg extracts the single AI-selected frame at the exact timestamp returned by Gemini | FFmpeg child process |
| 4. Frame display | Extracted frame shown with Gemini badge + description preview; user clicks Proceed | React UI |
| 5. Generation form | Title, genre, mood, tagline, style preset, aspect ratio, language | React controlled form |
| 6. Prompt construction | Gemini's frame description woven into a detailed cinematic prompt alongside all form inputs | `posterController.js` |
| 7. AI generation | Prompt sent to FLUX.1-schnell via Hugging Face Inference API | `@huggingface/inference` |
| 8. Save & display | Base64 PNG saved as a Project document in MongoDB | Mongoose `Project.create()` |

---

## Features

| Feature | Details |
|---------|---------|
| Gemini AI frame selection | Gemini 2.5 Flash picks the most cinematic frame from the video by timestamp |
| Scene-grounded poster generation | Gemini's frame description is injected into the generation prompt for visually accurate output |
| AI poster generation | FLUX.1-schnell (HuggingFace) — fast cinematic prompt engineering, 4-step inference |
| 7 mood options | Dark, Dreamy, Vintage, Futuristic, Minimal, Retro, Gritty |
| 6 genres | Drama, Thriller, Romance, Horror, Comedy, Documentary |
| 5 style presets | Photo-Real, Illustrated, Retro-Poster, 3D-Cinematic, Minimal |
| 3 aspect ratios | 2:3 portrait, 4:5 Instagram, 16:9 landscape |
| Multi-language | English, Tamil (ta-IN), Telugu (te-IN), Kannada (kn-IN), Malayalam (ml-IN) |
| Project library | Personal gallery with search by title and filter by genre |
| Community gallery | Public feed of all creators' work |
| Output type selection | Poster, Instagram Post, YouTube Thumbnail (Trailer coming soon) |
| Rate limiting | 10 AI generation requests per IP per hour |
| Daily quota | 5 generations per user per day (configurable) |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend framework | React 18 + TypeScript | Component-based SPA |
| Build tool | Vite 7 | Dev server + production bundling |
| Styling | TailwindCSS 3.4 | Utility-first responsive CSS |
| Routing | React Router 7 | Client-side navigation |
| Icons | Lucide React | UI icon set |
| Backend runtime | Node.js 18 LTS | Server runtime |
| Backend framework | Express 5 | REST API |
| Database | MongoDB Atlas + Mongoose | Document store + ODM |
| File uploads | Multer | Multipart form handling |
| AI frame analysis | Google Gemini 2.5 Flash (`@google/generative-ai`) | Cinematic frame selection + scene description |
| Video processing | fluent-ffmpeg + @ffmpeg-installer | Frame extraction at Gemini-selected timestamp (bundled binary) |
| AI generation | Hugging Face Inference API | FLUX.1-schnell — fast text-to-image |
| Rate limiting | express-rate-limit | Abuse protection |
| Auth (planned) | Supabase | Managed auth — in dependency tree, not yet wired |
| Password hashing | bcryptjs | For auth milestone |

---

## Project Structure

```
ott-poster-generator/
├── src/                            # React frontend (TypeScript)
│   ├── pages/
│   │   ├── Dashboard.tsx           # Stats + recent projects
│   │   ├── Upload.tsx              # Video upload + frame picker
│   │   ├── Assets.tsx              # Output type selection
│   │   ├── PosterGenerator.tsx     # AI generation form
│   │   ├── Projects.tsx            # Personal poster library
│   │   ├── Community.tsx           # Public gallery
│   │   └── Settings.tsx            # User preferences
│   ├── components/common/
│   │   ├── Sidebar.tsx             # Desktop navigation
│   │   ├── MobileHeader.tsx        # Mobile top bar
│   │   ├── MobileBottomNav.tsx     # Mobile bottom tab bar
│   │   ├── ProjectCard.tsx         # Poster card component
│   │   └── StatCard.tsx            # Dashboard stat widget
│   ├── App.tsx                     # Root + route definitions
│   └── api.tsx                     # API base URL + TS interfaces
│
└── backend/                        # Express REST API (ESM)
    ├── controllers/
    │   ├── videoController.js      # FFmpeg frame extraction
    │   ├── posterController.js     # FLUX.1-schnell generation via HuggingFace
    │   └── projectController.js    # Project CRUD + input validation
    ├── routes/
    │   ├── videoRoutes.js          # POST /api/videos/upload-video
    │   ├── posterRoutes.js         # POST /api/posters/generate
    │   └── projects.js             # GET|POST /api/projects
    ├── models/
    │   └── Project.js              # Mongoose schema
    └── server.js                   # Express bootstrap + middleware
```

---


## MVP Checklist

| Status | Feature |
|--------|---------|
| ✅ | Video upload |
| ✅ | Gemini AI frame selection (cinematic timestamp + scene description) |
| ✅ | FFmpeg frame extraction at Gemini-selected timestamp |
| ✅ | AI poster generation via FLUX.1-schnell (scene-grounded via Gemini description) |
| ✅ | Project library + community gallery + dashboard |
| ✅ | Multi-language support (EN / TA / TE / KN / ML) |
| ✅ | Rate limiting + basic input validation |

## What Comes Next (post-MVP)

| Priority | Feature |
|----------|---------|
| High | Real authentication — Supabase or JWT |
| High | Cloud storage for frames + posters (S3 / Cloudflare R2) |
| Medium | Faster AI inference — paid HuggingFace endpoint or self-hosted |
| Medium | Gemini File API cleanup after analysis |
| Later | Subscription billing — Stripe, Free / Pro / Studio tiers |
| Later | High-resolution export — 1080×1620+ PNG, PDF for print |
| Later | Fine-tuned regional cinema models |

---

## Current Limitations (MVP scope)

This is a working MVP — not production-ready. Known gaps before any real launch:

- **Auth is mocked:** `mockUser` in `api.tsx` is a placeholder. No real login/signup yet.
- **Ephemeral frame storage:** Frames live on the server filesystem. Fine for demos, not for multi-user or cloud deployment.
- **Generation latency:** HuggingFace free inference tier takes 10–30 seconds on cold starts.
- **Gemini File API cleanup:** Uploaded videos are not deleted from Gemini's storage after analysis.
- **No cloud storage:** Posters are stored as base64 in MongoDB — needs S3/R2 before scaling.
- **Single instance only:** No load balancing, no horizontal scaling considered yet.

---

## Running This Project

To run this project locally you'll need:

- Node.js 18+
- A MongoDB Atlas connection string
- A Gemini API key (Google AI Studio)
- A Hugging Face API key (for poster generation)
- FFmpeg (bundled automatically via `@ffmpeg-installer` — no manual install needed)

Interested in running it or exploring the architecture?

Reach out and I'll walk you through it.

**Email:** sharleez.work@gmail.com
**LinkedIn:** https://www.linkedin.com/in/sharleez-tech/

---

## Demo Video
https://www.loom.com/share/44b41039ffcd4b49b72002d00c31f59e


*all rights reserved*
