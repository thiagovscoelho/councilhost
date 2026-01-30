import { User as AppUser } from './user.js';

declare global {
  namespace Express {
    interface User {
      id: number;
      twitter_id: string;
      username: string;
      display_name: string;
      profile_image_url?: string;
    }
  }
}

export {};
