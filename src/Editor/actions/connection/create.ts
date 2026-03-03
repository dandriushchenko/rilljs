import { type Action } from '../action';
import { type Port, type ConnectionType } from '../../../model';

export interface CreateConnection extends Action {
    type: 'CreateConnection';
    from: Port;
    to: Port;
    connectionType: ConnectionType;
}
