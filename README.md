# 🌍 Climate Communication Platform

**AI-Powered Climate Communication for Everyone**

> "Local climate facts → simple words → practical actions."

A Next.js 15 web application that makes climate data accessible to everyone, regardless of literacy level or language background.

## ✨ Features

- **14 Indian Languages** - English + 13 regional languages
- **4 Literacy Levels** - Child, Basic, Intermediate, Expert
- **Real Climate Data** - CMIP6 projections via Open-Meteo
- **AI Explanations** - Google Gemini 2.0 Flash
- **Action Recommendations** - Practical, location-specific actions
- **Voice Playback** - Multi-language TTS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment (.env.local)
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
hack2/
├── app/
│   ├── api/           # API routes (climate, explain, actions, geocode)
│   ├── dashboard/     # Main dashboard
│   └── page.tsx       # Onboarding
├── components/        # React components
├── lib/              # Services (climate, gemini, actions, TTS)
└── public/           # Static assets
```

## 🌐 User Journey

1. **Onboarding** → Select language & literacy level
2. **Location** → Auto-detect or search city
3. **Data** → Fetch climate projections
4. **Results** → AI explanation + Actions + Voice
5. **Action** → Take practical steps

## 🔧 Tech Stack

- **Framework:** Next.js 15 + React 19
- **LLM:** Google Gemini 2.0 Flash
- **Climate API:** Open-Meteo (CMIP6)
- **TTS:** Web Speech API
- **Styling:** TailwindCSS 4
- **Deployment:** Vercel

## 🌍 Supported Languages

English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit

## 📊 API Endpoints

- `POST /api/climate` - Fetch climate data
- `POST /api/explain` - Get LLM explanation
- `POST /api/actions` - Generate recommendations
- `GET /api/geocode` - Search locations

## 🚀 Deploy on Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy!

## 🎓 For Hackathon Demo

**Key Points:**

- Real CMIP6 climate projections
- Latest tech (Next.js 15, Gemini 2.0 Flash)
- 14 languages, 4 literacy levels
- Practical actions, not just information
- 100% free tier services

**Demo Cities:** Chennai, Coimbatore, Madurai

## 📄 License

MIT License

---

**Built for Hackathon 2025** | 🌍 Making climate communication accessible to everyone
