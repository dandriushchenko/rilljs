import { describe, it, expect, vi } from 'vitest';
import { Graph } from './graph';
import { Node, type NodeDefinition } from '../nodes/node';
import type { InputFlow } from '../nodes/input';
import { Datum, type DatumConstructor } from '../data/datum';
import { Registry } from '../registry/registry';
import { ConnectionType } from '../connections';
import { InstanceIDAlreadyExists, InstanceDoesntExist, ConnectionIsNotValid, InvalidPort } from './error';
import { RegistryUnknownClassError } from '../registry/error';
import { NodeInvalidSerializedTypeError } from '../nodes/error';
import { Executor } from '../executor/Executor';

class MockExecutor extends Executor {
    run() {
        // Mock execution
    }
}

class DummyDatum extends Datum {
    static defn = { id: 'Dummy' };
    get defn() { return DummyDatum.defn; }
    get ctor() { return DummyDatum as unknown as DatumConstructor; }
    toJSON() { return this.value; }
    static fromJSON(v: unknown) { return v; }
}

class TestNode extends Node<MockExecutor> {
    get defn(): NodeDefinition { return { class: 'TestNode' }; }
    executor() { return new MockExecutor(); }

    addTestPorts() {
        this.addFlowInput('fIn');
        this.addFlowOutput('fOut');
        
        this.addValueInput('vIn', new DummyDatum('inVal'));
        this.addValueOutput('vOut', new DummyDatum('outVal'));
    }

    addMissingPorts() {
        this.addFlowOutput('fOut');
        this.addValueOutput('vOut', new DummyDatum('outVal'));
    }

    public addValueInputPublic(id: string, value: Datum) {
        return this.addValueInput(id, value);
    }
    public addValueOutputPublic(id: string, value: Datum) {
        return this.addValueOutput(id, value);
    }
}

describe('Graph', () => {
    it('creates graph and manages converter', () => {
        const cFrom = { 
            baseType: 'Base', 
            fromTypes: ['T1', 'T2'], 
            convertFrom: (f: unknown) => 'CV_' + (f as string) 
        };
        const cTo = { 
            baseType: 'Base', 
            toTypes: ['T3', 'T4'], 
            convertTo: (v: unknown) => (v as string) + '_TV' 
        };
        
        const g = new Graph([], [], [cFrom], [cTo]);
        
        expect(g.getConverter('T1', 'Base')).toBeDefined();
        expect(g.getConverter('Base', 'T3')).toBeDefined();
        // Test array from
        expect(g.getConverterMethod('T4', 'Base')).toBeUndefined();
        const methodTo2 = g.getConverterMethod('Base', 'T4');
        expect(methodTo2?.('Value')).toBe('Value_TV');
        expect(g.getConverter('TX', 'Base')).toBeUndefined();

        const methodFrom = g.getConverterMethod('T1', 'Base');
        expect(methodFrom).toBeDefined();
        expect(methodFrom?.('Hello')).toBe('CV_Hello');

        const methodTo = g.getConverterMethod('Base', 'T3');
        expect(methodTo).toBeDefined();
        expect(methodTo?.('Value')).toBe('Value_TV');

        expect(g.getConverterMethod('TX', 'Base')).toBeUndefined();
    });

    it('throws on ambiguous converter', () => {
        const cFrom1 = { baseType: 'Base', fromTypes: 'T1', convertFrom: () => '' };
        const cFrom2 = { baseType: 'Base', fromTypes: 'T1', convertFrom: () => '' };
        expect(() => {
            new Graph([], [], [cFrom1, cFrom2], []);
        }).toThrowError(/ambiguous/);

        const cTo1 = { baseType: 'Base', toTypes: 'T3', convertTo: () => '' };
        const cTo2 = { baseType: 'Base', toTypes: 'T3', convertTo: () => '' };
        expect(() => {
            new Graph([], [], [], [cTo1, cTo2]);
        }).toThrowError(/ambiguous/);
    });

    it('adds and gets nodes', () => {
        const g = new Graph();
        const n1 = new TestNode();
        g.addNode(n1);

        expect(g.getNodes().length).toBe(1);
        expect(g.getNode(n1.nodeID)).toBe(n1);

        expect(() => {
            g.addNode(n1);
        }).toThrowError(InstanceIDAlreadyExists);
    });

    it('removes nodes and their connections', () => {
        const g = new Graph();
        const n1 = new TestNode(); n1.addTestPorts();
        const n2 = new TestNode(); n2.addTestPorts();
        g.addNode(n1);
        g.addNode(n2);

        g.createFlowConnection(n1, n2, 'fOut', 'fIn');
        g.createDataConnection({ node: n1, port: 'vOut' }, { node: n2, port: 'vIn' });

        expect(g.getConnections().length).toBe(2);

        g.removeNode(n1);
        expect(g.getNodes().length).toBe(1);
        expect(g.getConnections().length).toBe(0); // Connections removed automatically

        expect(() => {
            g.removeNode('X');
        }).toThrowError(InstanceDoesntExist);
    });

    it('port flow fetching', () => {
        const g = new Graph();
        const n1 = new TestNode(); n1.addTestPorts();
        g.addNode(n1);

        expect(g.getNodeInputFlow({ node: n1.nodeID, port: 'fIn' })?.flow.id).toBe('fIn');
        expect(g.getNodeOutputFlow({ node: n1.nodeID, port: 'fOut' })?.flow.id).toBe('fOut');
        
        expect(g.getNodeInputValue({ node: n1.nodeID, port: 'vIn' })?.value.id).toBe('vIn');
        expect(g.getNodeOutputValue({ node: n1.nodeID, port: 'vOut' })?.value.id).toBe('vOut');

        // Missing things return undefined
        expect(g.getNodeInputFlow({ node: 'unknown', port: 'fIn' })).toBeUndefined();
        expect(g.getNodeInputFlow({ node: n1.nodeID, port: 'X' })).toBeUndefined();

        expect(g.getNodeInputValue({ node: 'unknown', port: 'vIn' })).toBeUndefined();
        expect(g.getNodeInputValue({ node: n1.nodeID, port: 'X' })).toBeUndefined();
    });

    it('adds and gets connections', () => {
        const g = new Graph();
        const n1 = new TestNode(); n1.addTestPorts();
        const n2 = new TestNode(); n2.addTestPorts();
        g.addNode(n1);
        g.addNode(n2);

        const conn1 = g.createFlowConnection(n1, n2); // No specific ports should default to first port
        expect(conn1.source.node).toBe(n1.nodeID);
        expect(conn1.source.port).toBe('fOut');

        const conn2 = g.createDataConnection({ node: n1.nodeID, port: 'vOut' }, { node: n2.nodeID, port: 'vIn' });
        
        expect(g.getConnection(conn1.id)).toBeDefined();

        expect(() => {
            g.addConnection(conn1);
        }).toThrowError(InstanceIDAlreadyExists);
        
        // Cannot add connection with identical from/to
        expect(() => {
            g.addConnection({ ...conn2, id: 'c_custom' });
        }).toThrowError(ConnectionIsNotValid);
        
        // Remove connection
        g.removeConnection(conn1.id);
        expect(g.getConnections().length).toBe(1);
        
        expect(() => {
            g.removeConnection('X');
        }).toThrowError(InstanceDoesntExist);

        // create flow connection using string branch coverage
        const conn3 = g.createFlowConnection(n1.nodeID, n2.nodeID);
        expect(conn3).toBeDefined();

        // remove node without removing connections
        const n3 = new TestNode(); n3.addTestPorts();
        g.addNode(n3);
        const conn4 = g.createFlowConnection(n1.nodeID, n3.nodeID);
        expect(conn4).toBeDefined();
        expect(g.getConnections().length).toBe(3); // conn2, conn3, conn4
        g.removeNode(n3, false);
        // It should NOT remove conn4 because we passed `false`
        expect(g.getConnections().length).toBe(3);

        // Remove destination node to test 'destination.node === id' branch
        g.removeNode(n2);
        // This removes conn2 and conn3 because n2 is their destination
        expect(g.getConnections().length).toBe(1); // conn4 is between n1, n3
    });

    it('connections missing ports failure', () => {
        const g = new Graph();
        const n1 = new TestNode(); // No ports
        const n2 = new TestNode(); n2.addTestPorts();
        g.addNode(n1);
        g.addNode(n2);

        expect(() => {
            g.createFlowConnection(n1, n2);
        }).toThrowError(InvalidPort);
        expect(() => {
            g.createFlowConnection(n2, n1, 'fOut', 'missing');
        }).toThrowError(/Node input with ID/);

        expect(() => {
            g.createDataConnection({node: n1, port: 'X'}, {node: n2, port: 'vIn'});
        }).toThrowError(/Node output with ID/);
        expect(() => {
            g.createDataConnection({node: n2, port: 'vOut'}, {node: n1, port: 'Y'});
        }).toThrowError(/Node input with ID/);

        expect(() => {
            g.createFlowConnection('unknown', n2);
        }).toThrowError(InstanceDoesntExist);
        expect(() => {
            g.createDataConnection({node: 'unknown', port: 'v'}, {node: n2, port: 'v'});
        }).toThrowError(InstanceDoesntExist);
        expect(() => {
            g.createDataConnection({node: n2, port: 'vOut'}, {node: 'unknown', port: 'v'});
        }).toThrowError(InstanceDoesntExist);
    });

    it('custom Add Connection invalid', () => {
        const g = new Graph();
        const n1 = new TestNode(); n1.addTestPorts();
        const n2 = new TestNode(); n2.addTestPorts();
        g.addNode(n1);
        
        expect(() => {
            g.addConnection({ id: 'bad', type: ConnectionType.Value, source: { node: n1.nodeID, port: 'vOut' }, destination: { node: 'Y', port: 'vIn' }});
        }).toThrowError(ConnectionIsNotValid);
        expect(() => {
            g.addConnection({ id: 'bad', type: ConnectionType.Flow, source: { node: n1.nodeID, port: 'fOut' }, destination: { node: 'Y', port: 'fIn' }});
        }).toThrowError(ConnectionIsNotValid);
    });

    it('JSON ser/de', () => {
        const g1 = new Graph();
        const n1 = new TestNode(); n1.addTestPorts();
        const n2 = new TestNode(); n2.addTestPorts();
        g1.addNode(n1);
        g1.addNode(n2);
        g1.createFlowConnection(n1, n2);

        const json = g1.toJSON();

        const registry = new Registry([TestNode], [DummyDatum as unknown as DatumConstructor]);
        const g2 = Graph.fromJSON(json, registry);

        expect(g2.getNodes().length).toBe(2);
        expect(g2.getConnections().length).toBe(1);

        // Try serialize bad node using an empty registry
        const emptyRegistry = new Registry();
        expect(() => {
            Graph.fromJSON(json, emptyRegistry);
        }).toThrowError(RegistryUnknownClassError);

        // Test unreachable !node branch 
        const undefinedRegistry = new Registry();
        vi.spyOn(undefinedRegistry, 'create').mockReturnValue(undefined as unknown as Node);
        expect(() => {
            Graph.fromJSON(json, undefinedRegistry);
        }).toThrowError(NodeInvalidSerializedTypeError);
    });

    it('unreachable port values mocking', () => {
        const g = new Graph();
        const n1 = new TestNode(); n1.addTestPorts();
        g.addNode(n1);

        // Mock Node internally to return undefined, bypassing the thrown error
        vi.spyOn(n1, 'getFlowInput').mockImplementation(() => undefined as unknown as InputFlow);
        vi.spyOn(n1, 'getFlowOutput').mockImplementation(() => undefined as unknown as InputFlow);
        vi.spyOn(n1, 'getValueInput').mockImplementation(() => undefined as never);
        vi.spyOn(n1, 'getValueOutput').mockImplementation(() => undefined as never);

        expect(g.getNodeInputFlow({ node: n1.nodeID, port: 'fIn' })).toBeUndefined();
        expect(g.getNodeOutputFlow({ node: n1.nodeID, port: 'fOut' })).toBeUndefined();
        expect(g.getNodeInputValue({ node: n1.nodeID, port: 'vIn' })).toBeUndefined();
        expect(g.getNodeOutputValue({ node: n1.nodeID, port: 'vOut' })).toBeUndefined();

        const n2 = new TestNode(); n2.addTestPorts();
        g.addNode(n2);
        
        // Mock returning undefined for creating connections
        vi.spyOn(n1, 'getFlowInputs').mockReturnValue([]);
        expect(() => {
            g.createFlowConnection(n2, n1);
        }).toThrowError(InvalidPort);

        expect(() => {
            g.createDataConnection({node: n1.nodeID, port: 'vOut'}, {node: n2.nodeID, port: 'vIn'});
        }).toThrowError(InvalidPort);
        
        vi.spyOn(n2, 'getValueInput').mockImplementation(() => undefined as never);
        expect(() => {
            g.createDataConnection({node: n2.nodeID, port: 'vOut'}, {node: n2.nodeID, port: 'vIn'});
        }).toThrowError(InvalidPort);
    });

    it('getConverterMethod coverage', () => {
        const g = new Graph();
        const conv = g.getConverter('any', 'any');
        expect(conv).toBeUndefined();

        // Internally access convertersMap
        interface GraphInternals {
            getConverterKey(t1: string, t2: string): string;
            convertersMap: Record<string, { from: unknown; to: unknown }>;
        }
        const gi = g as unknown as GraphInternals;
        const key = gi.getConverterKey('empty', 'C2');
        gi.convertersMap[key] = { from: undefined, to: undefined }; 
        
        expect(g.getConverter('empty', 'C2')).toBeDefined();
        // Test branch without `.from` and `.to`
        expect(g.getConverterMethod('empty', 'C2')).toBeUndefined();
    });
});
