import { describe, expect, it } from 'vitest';
import { ExecutorUndefinedInputError } from './error';
import type { Node } from '../nodes/node';

describe('Executor errors', () => {
  it('ExecutorUndefinedInputError', () => {
    const node = { toString: () => 'MyNode' } as unknown as Node;
    const err = new ExecutorUndefinedInputError(node, 'myInput');
    expect(err.message).toBe('Input myInput value is undefined in node MyNode.');
  });
});
