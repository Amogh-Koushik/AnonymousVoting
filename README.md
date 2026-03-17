# Anonymous Voting Web Application

A secure, anonymous polling platform built with React, Express, MongoDB, and Firebase Authentication.

![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

## Features

- 🔐 **Google OAuth 2.0** — Secure authentication via Firebase
- 🗳️ **Anonymous Voting** — Votes are recorded without publicly linking to users
- 👑 **Admin Dashboard** — Create polls, manage voters, view results, close polls
- 📊 **Live Results** — Animated bar charts with percentage breakdown
- 🔒 **Security** — JWT validation, rate limiting, XSS/NoSQL injection protection, CORS, Helmet
- 📱 **Responsive** — Beautiful glassmorphism UI, works on all screen sizes
- 🔍 **Search & Filter** — Find polls quickly with real-time search and status filters
- 🔔 **Toast Notifications** — User-friendly success/error feedback

## Project Structure

```
Anonymous Voting/
├── client/                  # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Navbar, PollCard, Toast, Loader, ProtectedRoute
│   │   ├── pages/           # Login, Dashboard, Vote, Results, AdminDashboard
│   │   ├── context/         # AuthContext (Firebase + backend sync)
│   │   ├── services/        # Axios API instance with token interceptor
│   │   ├── firebase.js      # Firebase client config
│   │   ├── App.jsx          # Router
│   │   └── index.css        # Tailwind + glassmorphism styles
│   └── ...
├── server/                  # Express + Mongoose
│   ├── config/              # Firebase Admin SDK init
│   ├── middleware/           # Token verification, admin auth
│   ├── models/              # User, Poll schemas
│   ├── routes/              # Auth, Polls endpoints
│   └── server.js            # Entry point with security middleware
├── DEPLOYMENT.md            # Full deployment guide
└── README.md
```

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- Firebase project with Google OAuth enabled
- MongoDB Atlas cluster (or local MongoDB)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Server: copy and fill in .env
cp server/.env.example server/.env

# Client: copy and fill in .env
cp client/.env.example client/.env
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Token | Verify Firebase token, create/find user |
| GET | `/api/auth/me` | Token | Get current user info |
| POST | `/api/polls/create` | Admin | Create a new poll |
| GET | `/api/polls` | Token | Get polls for user |
| POST | `/api/polls/vote` | Token | Submit a vote |
| GET | `/api/polls/results/:id` | Token | Get poll results |
| POST | `/api/polls/close` | Admin | Close a poll |
| DELETE | `/api/polls/:id` | Admin | Delete a poll |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## License

MIT
