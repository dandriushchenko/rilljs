import { type Port } from './port';

export const ConnectionType = {
    Flow: 'flow',
    Value: 'value'
} as const;
export type ConnectionType = typeof ConnectionType[keyof typeof ConnectionType];

export interface ConnectionJSON {
    id: string;
    source: Port;
    destination: Port;
    type: ConnectionType;
    disabled?: boolean;
}

export type Connection = ConnectionJSON;
