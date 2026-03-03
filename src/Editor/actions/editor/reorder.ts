import { type Action } from '../action';

export const NodeOrder = {
    SendToBack: 0,
    SendBackward: 1,
    BringForward: 2,
    SendToFront: 3
} as const;
export type NodeOrder = typeof NodeOrder[keyof typeof NodeOrder];

export interface ReorderNode extends Action {
    type: 'ReorderNode';
    id: string;
    order: NodeOrder;
}
