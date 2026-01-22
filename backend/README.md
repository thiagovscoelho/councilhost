# Council.host Backend API

Backend API server for Council.host, built with Node.js, Express, and PostgreSQL.

## Features

- X (Twitter) OAuth authentication
- PostgreSQL database
- RESTful API endpoints
- Session management
- Rate limiting
- Security middleware (Helmet, CORS)

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- X Developer account with API credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your credentials:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A random secret for session management
   - `TWITTER_CONSUMER_KEY`: Your X API consumer key
   - `TWITTER_CONSUMER_SECRET`: Your X API consumer secret
   - `TWITTER_CALLBACK_URL`: Your OAuth callback URL

4. Set up the database:
```bash
psql -U postgres -d councilhost -f schema.sql
```

### Development

Run the development server with hot reload:
```bash
npm run dev
```

The server will start on http://localhost:3001

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `GET /auth/twitter` - Initiate Twitter OAuth
- `GET /auth/twitter/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Councils
- `GET /api/councils` - Get all councils for current user
- `GET /api/councils/:id` - Get specific council
- `POST /api/councils` - Create new council
- `POST /api/councils/:id/accept` - Accept invitation
- `POST /api/councils/:id/decline` - Decline invitation

### Conclusions
- `GET /api/conclusions/council/:councilId` - Get conclusions for council
- `POST /api/conclusions` - Create proposal
- `POST /api/conclusions/:id/opinion` - Add/update opinion

### Resolutions
- `GET /api/resolutions/council/:councilId` - Get resolutions for council
- `POST /api/resolutions` - Propose resolution
- `POST /api/resolutions/:id/vote` - Vote on resolution

## Deployment

### Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and link project:
```bash
railway login
railway link
```

3. Add PostgreSQL:
```bash
railway add --plugin postgresql
```

4. Set environment variables in Railway dashboard

5. Deploy:
```bash
railway up
```

## Environment Variables

See `.env.example` for all required environment variables.
