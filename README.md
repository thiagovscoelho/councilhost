# Council.host

**Convene • Propose • Opine • Amend • Resolve**

Council.host is a collaborative decision-making platform for X (formerly Twitter) users. Create councils, propose conclusions, gather opinions, and reach consensus through structured deliberation.

## Features

- **Convene**: Invite X users to form a council on a specific issue
- **Propose**: Add conclusions to discuss and deliberate
- **Opine**: Support or oppose conclusions with reasoning
- **Amend**: Propose improvements to existing conclusions
- **Resolve**: Reach unanimous agreement and publish joint statements

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Deployed on Vercel

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Passport (X OAuth)
- Deployed on Railway

## Project Structure

```
councilhost/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── backend/                # Backend source
│   └── src/
│       ├── routes/         # API routes
│       ├── auth/           # Authentication
│       ├── middleware/     # Express middleware
│       └── db/             # Database connection
├── DEPLOYMENT.md           # Deployment guide
└── app-idea.txt            # Original app concept
```

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- X Developer account with API credentials

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd councilhost
```

2. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
```

3. Create and seed the database:
```bash
psql -U postgres -c "CREATE DATABASE councilhost"
psql -U postgres -d councilhost -f schema.sql
```

4. Start the backend:
```bash
npm run dev
```

5. In a new terminal, set up the frontend:
```bash
cd ..
npm install
cp .env.example .env
# Edit .env with API URL (http://localhost:3001)
```

6. Start the frontend:
```bash
npm run dev
```

7. Open http://localhost:5173 in your browser

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to production using Vercel and Railway.

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Backend (backend/.env)
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/councilhost
SESSION_SECRET=your-secret-key
TWITTER_CONSUMER_KEY=your-twitter-key
TWITTER_CONSUMER_SECRET=your-twitter-secret
TWITTER_CALLBACK_URL=http://localhost:3001/auth/twitter/callback
```

## API Documentation

### Authentication
- `GET /auth/twitter` - Initiate X OAuth
- `GET /auth/twitter/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Councils
- `GET /api/councils` - Get user's councils
- `GET /api/councils/:id` - Get specific council
- `POST /api/councils` - Create council
- `POST /api/councils/:id/accept` - Accept invitation
- `POST /api/councils/:id/decline` - Decline invitation

### Conclusions
- `GET /api/conclusions/council/:councilId` - Get conclusions
- `POST /api/conclusions` - Create proposal
- `POST /api/conclusions/:id/opinion` - Add opinion

### Resolutions
- `GET /api/resolutions/council/:councilId` - Get resolutions
- `POST /api/resolutions` - Propose resolution
- `POST /api/resolutions/:id/vote` - Vote on resolution

## Contributing

This is a personal project, but suggestions and feedback are welcome! It’s public domain CC0, so go ahead and fork it and build a better one

## License

CC0 Public Domain – see LICENSE file for details

## Credits

Built with Claude Code by Anthropic
