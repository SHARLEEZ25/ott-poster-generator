<div align="center">

# OTT Poster Generator

**Full-stack AI SaaS — built as a portfolio project demonstrating end-to-end product engineering.**

Upload a video → extract frames → describe your film → get a cinematic poster in seconds.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---


## What Was Built

A production-grade AI SaaS platform covering the full engineering stack:

- **Video processing pipeline** — FFmpeg frame extraction integrated as a Node.js service, no system FFmpeg required (bundled binary via `@ffmpeg-installer`)
- **AI generation pipeline** — Stable Diffusion XL via Hugging Face Inference API with prompt engineering tuned for cinematic poster output
- **REST API** — Express 5, MVC architecture, input validation, rate limiting (10 req/hr per IP), safe error responses
- **React SPA** — TypeScript, responsive design, routing, project management, community gallery
- **Data persistence** — MongoDB Atlas + Mongoose; every generated poster saved with full metadata

---

## The Problem It Solves

Indie filmmakers and short-film creators spend heavily on poster designers — a barrier that kills visibility for low-budget productions. This platform removes that barrier: upload footage, pick a scene, fill in a creative brief, and walk away with a cinematic AI-generated poster in seconds.

Built with regional Indian cinema in mind: **English, Tamil, Telugu, Kannada, and Malayalam** supported out of the box.

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
   │  Atlas     │  │  Hugging Face SDXL API    │
   │  Mongoose  │  │  FFmpeg  (frame extract)  │
   └────────────┘  └──────────────────────────┘
```

---

## How It Works

### Current Implementation — text-to-image (MVP)

> **Engineering transparency:** The current build uses **text-to-image only.** This is an intentional MVP decision — here's exactly what's happening and what's planned next.

| Step | What Happens | Tech |
|------|-------------|------|
| 1. Upload video | User uploads footage | Multer → temp storage |
| 2. Frame extraction | 4 frames extracted at 20/40/60/80% of video duration | FFmpeg child process |
| 3. Frame selection | User picks the frame that best represents their film's tone — helps articulate the creative brief | UX only (not AI input yet) |
| 4. Generation form | Title, genre, mood, tagline, style preset, aspect ratio, language | React controlled form |
| 5. Prompt construction | All inputs composed into a detailed cinematic prompt | `posterController.js` |
| 6. AI generation | Prompt sent to Stable Diffusion XL via Hugging Face Inference API | `@huggingface/inference` |
| 7. Save & display | Base64 PNG saved as a Project document in MongoDB | Mongoose `Project.create()` |

**Why isn't the frame fed to the AI?** SDXL text-to-image doesn't accept image inputs. Image-conditioned generation requires an img2img pipeline or ControlNet — that's the next engineering milestone.

---

## Features

| Feature | Details |
|---------|---------|
| Video frame extraction | 4 frames per video at evenly spaced timestamps |
| AI poster generation | Stable Diffusion XL — cinematic prompt engineering |
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
| Video processing | fluent-ffmpeg + @ffmpeg-installer | Frame extraction (bundled binary) |
| AI generation | Hugging Face Inference API | Stable Diffusion XL |
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
    │   ├── posterController.js     # Hugging Face SDXL generation
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


## Roadmap

| Status | Milestone |
|--------|-----------|
| ✅ | Video upload + FFmpeg frame extraction |
| ✅ | AI poster generation via Stable Diffusion XL |
| ✅ | Project library + community gallery + dashboard |
| ✅ | Multi-language support (EN / TA / TE / KN / ML) |
| ✅ | Rate limiting + input validation + safe error handling |
| 🔜 | **Image-conditioned generation** — feed selected frame into img2img / ControlNet pipeline |
| 🔜 | Full authentication — Supabase or JWT, replace mock user |
| 🔜 | Cloud storage — S3 / Cloudflare R2 for frames and posters |
| 🔜 | Subscription billing — Stripe integration, Free / Pro / Studio tiers |
| 📋 | High-resolution export — 1080×1620+ PNG, PDF for print |
| 📋 | Team workspaces — studio accounts, brand kit, shared projects |
| 📋 | Multiple AI backends — FLUX, fine-tuned regional cinema models |
| 📋 | Public developer API |

---

## Known Limitations

These are documented intentionally — not to hide them, but to show they're understood and sequenced.

- **Frame → AI:** The selected frame does not yet feed into the AI model. It is a UX tool for creative direction. Image conditioning (img2img) is the next engineering milestone.
- **Auth is mocked:** `mockUser` in `api.tsx` is a placeholder. Real per-user auth is the next backend milestone.
- **Ephemeral frame storage:** Frames live on the server filesystem — fine for local/single-instance, needs cloud storage for production.
- **Generation latency:** HuggingFace free inference tier takes 10–30 seconds. A paid endpoint or self-hosted model brings this to 2–5 seconds.

---

## Demo Video
https://www.loom.com/share/a57774f3ef1a4fd08d7e12bfa05c0c6a


*Portfolio project. All rights reserved.*
