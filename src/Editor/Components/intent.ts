export const Intent = {
  Primary: 'primary',
  Warning: 'warning',
  Danger: 'danger',
  Success: 'success',
} as const;

export type Intent = (typeof Intent)[keyof typeof Intent];
