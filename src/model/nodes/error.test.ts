import { describe, it, expect } from 'vitest';
import { 
    NodeInvalidSerializedTypeError,
    NodeInputAlreadyExistsError,
    NodeInputDoesntExistError,
    NodeOutputAlreadyExistsError,
    NodeOutputDoesntExistError
} from './error';

describe('Node errors', () => {
    it('NodeInvalidSerializedTypeError', () => {
        const err = new NodeInvalidSerializedTypeError('expectedType', { id: 'actualType' });
        expect(err.message).toContain('expectedType');
        expect(err.message).toContain('actualType');
        expect(err.value).toEqual({ id: 'actualType' });
    });

    const mockNode = { defn: { class: 'NodeClass' } };

    it('NodeInputAlreadyExistsError', () => {
        const err = new NodeInputAlreadyExistsError('in1', mockNode);
        expect(err.message).toContain('in1');
        expect(err.message).toContain('NodeClass');
    });

    it('NodeInputDoesntExistError', () => {
        const err = new NodeInputDoesntExistError('in1', mockNode);
        expect(err.message).toContain('in1');
        expect(err.message).toContain('NodeClass');
    });

    it('NodeOutputAlreadyExistsError', () => {
        const err = new NodeOutputAlreadyExistsError('out1', mockNode);
        expect(err.message).toContain('out1');
        expect(err.message).toContain('NodeClass');
    });

    it('NodeOutputDoesntExistError', () => {
        const err = new NodeOutputDoesntExistError('out1', mockNode);
        expect(err.message).toContain('out1');
        expect(err.message).toContain('NodeClass');
    });
});
