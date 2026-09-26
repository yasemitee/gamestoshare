// The manage-your-listing flow is on everywhere by default. Set
// NEXT_PUBLIC_ENABLE_MANAGE=false to switch a deploy back to the
// work-in-progress page (this also lifts the ownership check on overwrites).
export const MANAGE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_MANAGE !== 'false';
