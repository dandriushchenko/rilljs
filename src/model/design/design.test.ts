import { describe, it, expect } from 'vitest';
import { createDefaultNodeDesign, createDefaultConnectionDesign, createDefaultDesign } from './design';
import { Node, type NodeDefinition } from '../nodes/node';
import { Executor } from '../executor/Executor';
import type { ConnectionJSON } from '../connections';

class MockExecutor extends Executor {
    run() {
        // Mock execution
    }
}

class TestNode extends Node<MockExecutor> {
    get defn(): NodeDefinition {
        return { class: 'TestNode' };
    }
    executor(): MockExecutor {
        return new MockExecutor();
    }
}

class TestNodeWithDesign extends Node<MockExecutor> {
    get defn(): NodeDefinition {
        return { class: 'TestNodeWithDesign' };
    }
    get designDefn() {
        return { height: 123 };
    }
    executor(): MockExecutor {
        return new MockExecutor();
    }
}

describe('design', () => {
    it('createDefaultNodeDesign', () => {
        const n1 = new TestNode();
        const d1 = createDefaultNodeDesign(n1);
        expect(d1.height).toBe(0);

        const n2 = new TestNodeWithDesign();
        const d2 = createDefaultNodeDesign(n2);
        expect(d2.height).toBe(123);
    });

    it('createDefaultConnectionDesign', () => {
        const d = createDefaultConnectionDesign();
        expect(d).toEqual({});
    });

    it('createDefaultDesign', () => {
        const n1 = new TestNode();
        const n2 = new TestNode();
        n1.nodeID = 'n1';
        n2.nodeID = 'n2';

        const conn = { id: 'c1', source: { node: 'n1', port: 'p1'}, destination: { node: 'n2', port: 'p2' }, type: 0 };
        
        const d = createDefaultDesign([n1, n2], [conn as unknown as ConnectionJSON], []);
        expect(Object.keys(d.nodes).length).toBe(2);
        expect(Object.keys(d.connections).length).toBe(1);
        
        // Tests layout logic implicitly
        expect(d.nodes.n1.x).toBe(0);
        expect(d.nodes.n1.y).toBe(0);
        expect(d.nodes.n2.x).toBe(100);
        expect(d.nodes.n2.y).toBe(100);
    });
});
