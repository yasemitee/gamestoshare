// The manage-your-listing flow is still unstable, so it stays off on
// production deploys. Set NEXT_PUBLIC_ENABLE_MANAGE=true to opt a deploy in.
export const MANAGE_ENABLED =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_ENABLE_MANAGE === 'true';
