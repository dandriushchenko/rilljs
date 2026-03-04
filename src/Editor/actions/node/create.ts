import { type Node, type Coords } from '../../../model';
import { type Action } from '../action';

export interface CreateNodes extends Action {
    type: 'CreateNodes';
    nodes: {node: Node, pos: Coords}[];
}
