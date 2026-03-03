import { type Action } from '../action';
import { type Port } from '../../../model';

export interface UpdateConnection extends Action {
    type: 'UpdateConnection';
    id: string;
    source?: Port;
    destination?: Port;
    disabled?: boolean;
}
