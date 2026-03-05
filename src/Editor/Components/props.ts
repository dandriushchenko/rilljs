import { type Intent } from './intent';
import { type CSSProperties } from 'react';

export interface IntentProps {
  intent?: Intent;
}

export interface BaseProps {
  className?: string;
  style?: CSSProperties;
}
