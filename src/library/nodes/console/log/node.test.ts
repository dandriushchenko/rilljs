import { describe, expect, it, vi } from 'vitest';
import { ConsoleLog, ConsoleLogNodeClass } from './node';
import { ExecutorUndefinedInputError } from '../../../../model';

describe('Console Log Node', () => {
  it('creates node with correct definitions', () => {
    const node = new ConsoleLog('test msg');
    
    expect(node.defn.class).toBe(ConsoleLogNodeClass);
    expect(node.defn.name).toBe('Console Log');
    expect(node.designDefn.color).toBeDefined();

    expect(node.message).toBe('test msg');
    node.message = 'new msg';
    expect(node.message).toBe('new msg');

    const executor = node.executor();
    expect(executor).toBeDefined();
    
    // Test the executor run
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { /* mock */ });
    executor.run();
    expect(consoleSpy).toHaveBeenCalledWith('new msg');
    consoleSpy.mockRestore();
  });

  it('throws on undefined message in executor', () => {
    const node = new ConsoleLog();
    // Default message is empty string ''
    expect(node.message).toBe('');
    expect(() => node.executor()).toThrowError(ExecutorUndefinedInputError);
  });
});
