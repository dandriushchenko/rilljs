import { type Node } from '../../../model';
import { type Action } from '../action';

export interface UpdateNode extends Action {
  type: 'UpdateNode';
  node: Node;
}
