# VC Intelligence Platform

A modern, production-quality VC discovery and enrichment tool built with Next.js 14, Tailwind CSS, and Groq LLM.

## Project Overview

This application serves as an internal tool for venture capitalists to discover companies, track potential investments, and enrich company profiles with AI-derived intelligence.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **LLM**: Groq (Llama 3.3 70B)
- **Persistence**: LocalStorage (for demo purposes)

## Key Features

- **Company Discovery**: A sophisticated table interface with real-time filtering, sorting, and search.
- **Deep Enrichment**: One-click company profile enrichment using the Groq API to extract structured intelligence from public data.
- **Internal Notes**: Persistence of proprietary deal notes per company.
- **Curated Lists**: Grouping companies into named lists with CSV/JSON export capabilities.
- **Saved Searches**: Bookmarking complex search queries for pipeline monitoring.
- **Premium UI**: Sleek, high-contrast interface with glassmorphism and smooth transitions.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## How Enrichment Works

The enrichment feature utilizes a server-side API route (`/api/enrich`) that:
1. Receives the company website and name.
2. Simulates/Fetches public content from the homepage, Careers, and About sections.
3. Sends the structured prompt and content to Groq's Llama 3.3 model.
4. Returns a strictly formatted JSON object containing a summary, bullet points of "what they do", key signals (like hiring or geographic expansion), and keywords.
5. results are cached in `localStorage` for fast retrieval and reduced API usage.

## Deployment

This app is optimized for deployment on **Vercel**. 
- API routes are handled automatically as serverless functions.
- Ensure `GROQ_API_KEY` is added to the project's environment variables in the Vercel dashboard.

---
*Built for the Senior Full-Stack Engineer Take-Home Assignment.*
