-- Council.host Database Schema

-- Users table (from X authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    twitter_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Councils table
CREATE TABLE IF NOT EXISTS councils (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue TEXT NOT NULL,
    convener_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Council members (invited and accepted users)
CREATE TABLE IF NOT EXISTS council_members (
    id SERIAL PRIMARY KEY,
    council_id UUID REFERENCES councils(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    joined_at TIMESTAMP,
    UNIQUE(council_id, user_id)
);

-- Conclusions (proposals)
CREATE TABLE IF NOT EXISTS conclusions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    council_id UUID REFERENCES councils(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    proposed_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_amendment BOOLEAN DEFAULT false,
    replaces_conclusion_id UUID REFERENCES conclusions(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opinions (support/oppose with reasoning)
CREATE TABLE IF NOT EXISTS opinions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conclusion_id UUID REFERENCES conclusions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stance VARCHAR(50) NOT NULL CHECK (stance IN ('support', 'oppose')),
    reasoning TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conclusion_id, user_id)
);

-- Resolutions (move to resolve or close)
CREATE TABLE IF NOT EXISTS resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    council_id UUID REFERENCES councils(id) ON DELETE CASCADE,
    proposed_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('resolve', 'close')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resolution votes
CREATE TABLE IF NOT EXISTS resolution_votes (
    id SERIAL PRIMARY KEY,
    resolution_id UUID REFERENCES resolutions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote VARCHAR(50) NOT NULL CHECK (vote IN ('support', 'oppose')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resolution_id, user_id)
);

-- Final statements
CREATE TABLE IF NOT EXISTS statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    council_id UUID REFERENCES councils(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_councils_convener ON councils(convener_id);
CREATE INDEX IF NOT EXISTS idx_councils_status ON councils(status);
CREATE INDEX IF NOT EXISTS idx_council_members_council ON council_members(council_id);
CREATE INDEX IF NOT EXISTS idx_council_members_user ON council_members(user_id);
CREATE INDEX IF NOT EXISTS idx_conclusions_council ON conclusions(council_id);
CREATE INDEX IF NOT EXISTS idx_opinions_conclusion ON opinions(conclusion_id);
CREATE INDEX IF NOT EXISTS idx_opinions_user ON opinions(user_id);
CREATE INDEX IF NOT EXISTS idx_resolutions_council ON resolutions(council_id);
CREATE INDEX IF NOT EXISTS idx_resolution_votes_resolution ON resolution_votes(resolution_id);
