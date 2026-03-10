import { describe, it, expect } from 'vitest';
import { newID } from './id';

describe('newID', () => {
  it('should generate a string', () => {
    const id = newID();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate unique ids', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
        ids.add(newID());
    }
    expect(ids.size).toBe(100);
  });
});
