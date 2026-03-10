import { describe, it, expect } from 'vitest';
import { DatumInvalidTypeError, ConverterRuntimeConvertToFailure, ConverterRuntimeConvertFromFailure } from './error';

describe('Data errors', () => {
    it('DatumInvalidTypeError', () => {
        const err = new DatumInvalidTypeError('string', 123);
        expect(err.message).toBe('Expected type string, while received type number');
        expect(err.value).toBe(123);
    });

    it('ConverterRuntimeConvertToFailure', () => {
        const err = new ConverterRuntimeConvertToFailure('base', 'toType', new Error('Inner'));
        expect(err.message).toContain('base');
        expect(err.message).toContain('toType');
        expect(err.message).toContain('Inner');
    });

    it('ConverterRuntimeConvertFromFailure', () => {
        const err = new ConverterRuntimeConvertFromFailure('base', 'fromType', new Error('Inner'));
        expect(err.message).toContain('base');
        expect(err.message).toContain('fromType');
        expect(err.message).toContain('Inner');
    });
});
