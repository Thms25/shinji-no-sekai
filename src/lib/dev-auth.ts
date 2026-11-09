/**
 * Local development skips the admin login: `next dev` treats every request as the
 * admin, so the editor opens and saves without signing in. `next build` / `next
 * start` always run with NODE_ENV=production, so this is never on in production.
 */
export const DEV_AUTH_BYPASS = process.env.NODE_ENV === 'development'

export const DEV_ADMIN = {
  userId: 'dev-admin',
  email: 'dev@localhost',
  role: 'admin' as const,
}
