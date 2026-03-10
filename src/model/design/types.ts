import type { NodeDesign } from './node';
import type { ConnectionDesign } from './connection';
import type { GroupDesign } from './group';
import type { Coords } from '../types';

export const DesignViewMode = {
  Detailed: 0,
  Normal: 1,
  Minimal: 2,
} as const;
export type DesignViewMode = (typeof DesignViewMode)[keyof typeof DesignViewMode];

export interface Design {
  groups: GroupDesign[];
  nodes: Record<string, NodeDesign>;
  connections: Record<string, ConnectionDesign>;
  pan: Coords;
  scale: number;
  mode: DesignViewMode;
  version: 1;
}
