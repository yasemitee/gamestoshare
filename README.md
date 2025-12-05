<div align="center">

# 🎮 GamesToShare

**Gaming matchmaking platform for Steam users**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)

_Share your Steam library, find players with common interests, send friend requests. No registration needed._

</div>

---

## Overview

GamesToShare allows Steam users to create listings indicating which games they're looking for and which games they can offer. The platform automatically fetches game data from Steam profiles and helps users find compatible sharing partners in their region.

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS,  Motion (Framer Motion)
- PostgreSQL, Prisma ORM
- Deployed on Vercel.

## Project Structure
```
gamestoshare/
├── app/                          
│   ├── api/                      # API Routes (Backend)
│   │   ├── listings/             
│   │   └── steam/                
│   │
│   ├── components/               # React components
│   │   ├── content/              
│   │   ├── home/                 
│   │   ├── layout/               
│   │   ├── listings/             
│   │   ├── ui/                   
│   │   └── verification/         # Steam verification flow
│   │
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      
│   │   ├── db/                   
│   │   ├── steam/                
│   │   └── utils/                
│   │
│   ├── listings/                 
│   │   ├── [id]/                 
│   │   └── create/               
│   │
│   ├── info/                     
│   ├── terms/                    
│   ├── globals.css               
│   ├── layout.tsx                
│   └── page.tsx                  
│
└── prisma/                       # Database schema
    ├── schema.prisma             
    └── migrations/               
```

## Key Features

No registration required (Steam ID only), automatic game import from Steam profiles, optional username visibility, Steam bio verification system, region filtering for Steam Family Sharing compatibility, and game matching between users.

## Prerequisites

Node.js 20+, PostgreSQL database, Steam Web API key.

## Installation

Install dependencies:
```bash
npm install
```

Set up environment variables by creating a `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
STEAM_API_KEY="your_steam_api_key"
CRON_SECRET="your_cron_secret"
```

Initialize the database:
```bash
npx prisma generate
npx prisma migrate deploy
```

Run the development server:
```bash
npm run dev
```

Open http://localhost:3000 to view the application.

## Database Schema

The database has three main models: **Listing** (user game sharing announcements with Steam profile info and location, one active listing per Steam ID using upsert pattern), **Game** (Steam games metadata auto-populated from Steam API), and **ListingGame** (junction table linking listings to games, distinguishing between "looking for" and "offering").

## Security

Bio verification system prevents unauthorized listing creation. Soft delete pattern for data retention. Rate limiting on Steam API calls. Input sanitization on all user data. CORS configured for API routes.
