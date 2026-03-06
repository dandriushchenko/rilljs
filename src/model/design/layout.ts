import type { Design } from './types';

export function layout(design: Design) {
  const nodes = Object.values(design.nodes);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.x = i * 100;
    node.y = i * 100;
  }
}
