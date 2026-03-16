import { describe, it, expect } from 'vitest';
import { Node, type NodeDefinition } from './node';
import { NodeInputDoesntExistError, NodeOutputDoesntExistError, NodeInvalidSerializedTypeError } from './error';
import { Datum, type DatumConstructor } from '../data/datum';
import { Executor } from '../executor/Executor';
import type { Graph } from '../graph/graph';

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

class TestN extends Node<MockExecutor> {
    get defn(): NodeDefinition { return { class: 'TestN' }; }
    executor() { return new MockExecutor(); }

    addTestInputs() {
        this.addFlowInput('fIn');
        this.addFlowOutput('fOut');
        
        this.addValueInput('vIn', new DummyDatum('inVal'));
        this.addValueOutput('vOut', new DummyDatum('outVal'));
        this.addValueInternal('vInt', new DummyDatum('intVal'));
    }

    testRemove() {
        this.removeFlowInput('fIn');
        this.removeFlowOutput('fOut');
    }

    testFlowThrough(flowIn = true, flowOut = true) {
        this.addFlowThrough(flowIn, flowOut);
    }

    public addValueInternalPublic(id: string, value: Datum) {
        return this.addValueInternal(id, value);
    }
    public addValueInputPublic(id: string, value: Datum) {
        return this.addValueInput(id, value);
    }
    public addFlowInputPublic(id: string) {
        return this.addFlowInput(id);
    }
    public addFlowOutputPublic(id: string) {
        return this.addFlowOutput(id);
    }
    public addValueOutputPublic(id: string, value: Datum) {
        return this.addValueOutput(id, value);
    }
}

describe('Node', () => {
    it('creates basic structure safely', () => {
        const n = new TestN();
        expect(n.nodeID).toBeTruthy();
        expect(n.getFlowInputs().length).toBe(0);
        expect(n.getFlowOutputs().length).toBe(0);
        expect(n.getValueInputs().length).toBe(0);
        expect(n.getValueOutputs().length).toBe(0);
        expect(n.getValueInternals().length).toBe(0);
        expect(n.validate({} as unknown as Graph)).toBe(undefined);
    });

    it('adds and gets inputs and outputs safely', () => {
        const n = new TestN();
        n.addTestInputs();

        expect(n.getFlowInput('fIn')).toBeDefined();
        expect(n.getFlowInputUnsafe('fIn')).toBeDefined();
        expect(n.getFlowOutput('fOut')).toBeDefined();
        expect(n.getFlowOutputUnsafe('fOut')).toBeDefined();

        expect(n.getValueInput('vIn')).toBeDefined();
        expect(n.getValueInputUnsafe('vIn')).toBeDefined();
        expect(n.getValueOutput('vOut')).toBeDefined();
        expect(n.getValueOutputUnsafe('vOut')).toBeDefined();

        expect(n.getValueInternal('vInt')).toBeDefined();
        expect(n.getValueInternalUnsafe('vInt')).toBeDefined();
    });

    it('throws on non-existent ports', () => {
        const n = new TestN();

        expect(() => n.getFlowInput('fIn')).toThrow(NodeInputDoesntExistError);
        expect(() => n.getFlowOutput('fOut')).toThrow(NodeOutputDoesntExistError);
        expect(() => n.getValueInput('vIn')).toThrow(NodeInputDoesntExistError);
        expect(() => n.getValueOutput('vOut')).toThrow(NodeOutputDoesntExistError);
        expect(() => n.getValueInternal('vInt')).toThrow(NodeInputDoesntExistError);
    });

    it('throws on duplicate ports', () => {
        const n = new TestN();
        n.addTestInputs();

        expect(() => n.addValueInternalPublic('vInt', new DummyDatum('x'))).toThrow(/already exists/);
        expect(() => n.addValueInputPublic('vIn', new DummyDatum('x'))).toThrow(/already exists/);

        expect(() => n.addFlowInputPublic('fIn')).toThrow(/already exists/);
        expect(() => n.addFlowOutputPublic('fOut')).toThrow(/already exists/);

        expect(() => n.addValueOutputPublic('vOut', new DummyDatum('x'))).toThrow(/already exists/);
    });

    it('removes flow safely', () => {
        const n = new TestN();
        n.addTestInputs();
        n.testRemove();

        expect(n.getFlowInputs().length).toBe(0);
        expect(n.getFlowOutputs().length).toBe(0);
    });

    it('addFlowThrough works safely', () => {
        const n = new TestN();
        n.testFlowThrough();
        
        expect(n.getFlowInput('in')).toBeDefined();
        expect(n.getFlowOutput('out')).toBeDefined();

        const n2 = new TestN();
        n2.testFlowThrough(false, true);
        expect(n2.getFlowInputs().length).toBe(0);
        expect(n2.getFlowOutputs().length).toBe(1);

        const n3 = new TestN();
        n3.testFlowThrough(true, false);
        expect(n3.getFlowInputs().length).toBe(1);
        expect(n3.getFlowOutputs().length).toBe(0);

        const n4 = new TestN();
        n4.testFlowThrough(false, false);
        expect(n4.getFlowInputs().length).toBe(0);
        expect(n4.getFlowOutputs().length).toBe(0);
    });

    it('JSON ser/de safely', () => {
        const n1 = new TestN();
        n1.addTestInputs();
        
        const json = n1.toJSON();
        
        const n2 = new TestN();
        n2.addTestInputs(); // Must have same structure to desiruzlie properly typically
        
        n2.fromJSON(json);
        
        expect(n2.nodeID).toBe(n1.nodeID);
        expect(n2.getValueInput('vIn').value.value).toBe('inVal');
        expect(n2.getValueOutput('vOut').value.value).toBe('outVal');
        expect(n2.getValueInternal('vInt').value.value).toBe('intVal');
    });

    it('throws on wrong json type', () => {
        const n = new TestN();
        expect(() => {
            n.fromJSON({
                class: 'OtherType',
                id: 'id',
                inputs: {},
                outputs: {},
                internal: {},
            });
        }).toThrow(NodeInvalidSerializedTypeError);
    });

    it('undef value serialization safety', () => {
        const n = new TestN();
        n.addTestInputs();
        n.getValueInput('vIn').value.value = undefined;
        const j = n.toJSON();
        expect(j.inputs.vIn).toBeUndefined();
    });
});
