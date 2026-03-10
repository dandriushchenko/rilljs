import { describe, it, expect } from 'vitest';
import { 
    InstanceIDAlreadyExists, 
    InstanceDoesntExist, 
    ConnectionIsNotValid, 
    InvalidPort 
} from './error';
import { ConnectionType } from '../connections';

describe('Graph errors', () => {
    it('InstanceIDAlreadyExists', () => {
        const err = new InstanceIDAlreadyExists('id1');
        expect(err.message).toContain('id1');
    });

    it('InstanceDoesntExist', () => {
        const err = new InstanceDoesntExist('id1');
        expect(err.message).toContain('id1');
    });

    it('ConnectionIsNotValid', () => {
        const conn = { id: 'c1', type: ConnectionType.Flow, source: { node: 'n1', port: 'p1' }, destination: { node: 'n2', port: 'p2' } };
        const err1 = new ConnectionIsNotValid(conn);
        expect(err1.message).toContain('Connection is not valid:');
        expect(err1.message).toContain('n1');

        const err2 = new ConnectionIsNotValid(conn, 'Custom msg');
        expect(err2.message).toContain('Custom msg');
    });

    it('InvalidPort', () => {
        const err = new InvalidPort('n1', 'p1');
        expect(err.message).toContain('n1');
        expect(err.message).toContain('p1');
    });
});
