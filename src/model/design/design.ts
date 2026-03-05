import { type NodeDesign } from './node';
import { type Node } from '../nodes';
import { layout } from './layout';
import { type ConnectionDesign } from './connection';
import { type Connection } from '../connections';
import { type GroupDesign } from './group';
import { type Coords } from '../types';

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

export function createDefaultNodeDesign(n: Node): NodeDesign {
  const design = n.designDefn;
  return {
    x: 0,
    y: 0,
    width: 200,
    height: design?.height ?? 0, // Default to minHeight in theme
  };
}

export function createDefaultConnectionDesign(c?: Connection): ConnectionDesign {
  void c;
  return {};
}

export function createDefaultDesign(nodes: Node[] = [], connections: Connection[] = [], groups: GroupDesign[] = []) {
  const res: Design = {
    groups,
    nodes: {},
    connections: {},
    mode: DesignViewMode.Normal,
    pan: { x: 0, y: 0 },
    scale: 1.0,
    version: 1,
  };

  for (const n of nodes) {
    res.nodes[n.nodeID] = createDefaultNodeDesign(n);
  }

  for (const c of connections) {
    res.connections[c.id] = createDefaultConnectionDesign(c);
  }

  layout(res);
  return res;
}
