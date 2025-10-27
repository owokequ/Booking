import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { user_id: string; event_id: number };
  }
}
