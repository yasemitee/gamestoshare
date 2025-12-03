<div align="center">

# 🎮 GamesToShare

**Gaming matchmaking platform for Steam users**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)

_Share your Steam library, find players with common interests, send friend requests. No registration needed._

[Report Bug](https://github.com/yasemitee/gamestoshare/issues) · [Request Feature](https://github.com/yasemitee/gamestoshare/issues)

</div>

---

## About The Project

GamesToShare is a **full-stack web application** that solves a common problem in the gaming community: finding players who own or want the same games as you.

### Why was this platform made

Gamers often struggle to find friends to play specific games with. Traditional methods involve:

- Posting in Discord servers with hundreds of messages
- Scrolling through Steam community forums
- Manually checking friends' libraries one by one

So GTS can be used as a centralized platform where users can:

1. **Create listings** with games they're looking for and games they can offer
2. **Browse other players** filtered by location and platform
3. **Send friend requests** directly through Steam
4. **No registration required** - just Steam ID verification

---

## Key Features

### **Anonymous Authentication System**

- **No traditional registration** - uses Steam ID as unique identifier
- **Bio verification** system with security codes (prevents impersonation)
- **Privacy controls** - users choose whether to display their username publicly
- **Smart upsert logic** - one active listing per user (prevents spam)

### **Intelligent Matching System**

- **Game crossmatch algorithm** - finds common games between users
- **Real-time search** with debouncing and caching
- **Filters by location, platform, and game titles**

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

If you found this project interesting, consider giving it a ⭐!

</div>
