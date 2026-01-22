import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { query } from '../db/index.js';

interface TwitterProfile {
  id: string;
  username: string;
  displayName: string;
  photos?: { value: string }[];
}

export function configureTwitterAuth() {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY!,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
        callbackURL: process.env.TWITTER_CALLBACK_URL!,
        includeEmail: false,
      },
      async (token, tokenSecret, profile: TwitterProfile, done) => {
        try {
          // Check if user exists
          const existingUser = await query(
            'SELECT * FROM users WHERE twitter_id = $1',
            [profile.id]
          );

          if (existingUser.rows.length > 0) {
            // Update user info
            const updatedUser = await query(
              `UPDATE users
               SET username = $1, display_name = $2, profile_image_url = $3, updated_at = CURRENT_TIMESTAMP
               WHERE twitter_id = $4
               RETURNING *`,
              [
                profile.username,
                profile.displayName,
                profile.photos?.[0]?.value || null,
                profile.id,
              ]
            );
            return done(null, updatedUser.rows[0]);
          }

          // Create new user
          const newUser = await query(
            `INSERT INTO users (twitter_id, username, display_name, profile_image_url)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
              profile.id,
              profile.username,
              profile.displayName,
              profile.photos?.[0]?.value || null,
            ]
          );

          return done(null, newUser.rows[0]);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const result = await query('SELECT * FROM users WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (error) {
      done(error);
    }
  });
}
