import { describe, it, expect } from 'vitest';
import { distance } from './coords';

describe('coords distance', () => {
    it('calculates distance correctly', () => {
        expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
        expect(distance({ x: 10, y: -5 }, { x: 10, y: 5 })).toBe(10);
    });
});
