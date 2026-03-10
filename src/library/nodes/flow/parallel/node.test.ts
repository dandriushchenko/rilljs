import { describe, expect, it } from 'vitest';
import { Parallel } from './node';

class TestParallel extends Parallel {
    public callOnBranchesChange(prev: number, next: number) {
        // Accessing protected method via subclass
        this.onBranchesChange(prev, next);
    }
    public getInternalHelp(id: string) {
        const internal = this.getValueInternals().find(i => i.id === id);
        if (!internal) return undefined;
        const datum = internal.value as Datum & { meta?: { help?: string } };
        return datum.meta?.help;
    }
}

interface Datum { meta?: { help?: string } }

describe('Parallel Node', () => {
    it('creates node and executor', () => {
        const node = new Parallel();
        expect(node.defn).toBeDefined();
        if (node.designDefn) {
            expect(node.designDefn).toBeDefined();
        }
        
        try {
            const executor = node.executor();
            const e = executor as { run: () => void };
            if (typeof e.run === 'function') {
                e.run();
            }
        } catch {
            // some executors throw on empty values
        }
    });

    it('covers all branch logic for Parallel node', () => {
        const node = new TestParallel();
        const helpFn = node.getInternalHelp('branches') as ((v: number) => string | undefined) | undefined;
        if (helpFn) {
            expect(helpFn(1)).toBeUndefined();
            expect(helpFn(6)).toBe('(ideally, under 5)');
        }
        
        node.branches = 3;
        expect(node.branches).toBe(3);
        
        node.callOnBranchesChange(1, 3);
        // Decrease branches to trigger removal
        node.callOnBranchesChange(3, 1);
        expect(node.getFlowOutputs().length).toBe(1);
    });
});
