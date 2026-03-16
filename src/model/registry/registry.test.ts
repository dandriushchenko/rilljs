
import { describe, it, expect } from 'vitest';
import { Registry } from './registry';
import { RegistryAlreadyExistsError, RegistryUnknownClassError } from './error';
import { Node, type NodeDefinition } from '../nodes/node';
import { Datum, type DatumDefinition, type DatumConstructor } from '../data/datum';
import { Executor } from '../executor/Executor';

class MockExecutor extends Executor {
    run() {
        // Mock execution
    }
}

class TestNode1 extends Node<MockExecutor> {
    get defn(): NodeDefinition {
        return { class: 'TestNode1', name: 'N1', description: 'Desc 1' };
    }
    executor(): MockExecutor {
        return new MockExecutor();
    }
}

class TestNode2 extends Node<MockExecutor> {
    get defn(): NodeDefinition {
        return { class: 'TestNode2', name: 'N2', description: 'Desc 2' };
    }
    executor(): MockExecutor {
        return new MockExecutor();
    }
}

class TestDatum1 extends Datum<string, string> {
    static defn: DatumDefinition = { id: 'TestDatum1', name: 'D1', description: 'Desc D1' };
    get defn(): DatumDefinition { return TestDatum1.defn; }
    get ctor(): DatumConstructor<string> { return TestDatum1 as unknown as DatumConstructor<string>; }
    toJSON(): string { return this.value; }
    static fromJSON(v: unknown) { return v as string; }
}

class TestDatum2 extends Datum<number, number> {
    static defn: DatumDefinition = { id: 'TestDatum2', name: 'D2', description: 'Desc D2' };
    get defn(): DatumDefinition { return TestDatum2.defn; }
    get ctor(): DatumConstructor<number> { return TestDatum2 as unknown as DatumConstructor<number>; }
    toJSON(): number { return this.value; }
    static fromJSON(v: unknown) { return v as number; }
}

class TestNodeNoName extends Node<MockExecutor> {
    get defn(): NodeDefinition {
        return { class: 'TestNodeNoName' }; // Missing name / description
    }
    executor(): MockExecutor {
        return new MockExecutor();
    }
}

class TestDatumNoName extends Datum<number, number> {
    static defn: DatumDefinition = { id: 'TestDatumNoName' }; // Missing name / description
    get defn(): DatumDefinition { return TestDatumNoName.defn; }
    get ctor(): DatumConstructor<number> { return TestDatumNoName as unknown as DatumConstructor<number>; }
    toJSON(): number { return this.value; }
    static fromJSON(v: unknown) { return v as number; }
}

describe('Registry', () => {
    it('creates with empty registry', () => {
        const r = new Registry();
        expect(r.findNodes(null).length).toBe(0);
        expect(r.findDatum(null).length).toBe(0);
    });

    it('creates with initial items', () => {
        const r = new Registry([TestNode1], [TestDatum1 as unknown as DatumConstructor]);
        expect(r.findNodes(null).length).toBe(1);
        expect(r.findDatum(null).length).toBe(1);
    });

    it('findNodes filters correctly', () => {
        const r = new Registry([TestNode1, TestNode2, TestNodeNoName]);
        expect(r.findNodes('N1').length).toBe(1);
        expect(r.findNodes('desc 1').length).toBe(1);
        expect(r.findNodes('desc 2').length).toBe(1);
        expect(r.findNodes('noname').length).toBe(0); 
        
        expect(r.findNodes(null, (n) => n.defn.class === 'TestNodeNoName').length).toBe(1);
    });

    it('findDatum filters correctly', () => {
        const r = new Registry([], [TestDatum1, TestDatum2, TestDatumNoName] as unknown as DatumConstructor[]);
        expect(r.findDatum('D1').length).toBe(1);
        expect(r.findDatum('2').length).toBe(1);
        expect(r.findDatum('noname').length).toBe(1);
        
        expect(r.findDatum(null, (d) => d.id === 'TestDatumNoName').length).toBe(1);
    });

    it('creates instances correctly', () => {
        const r = new Registry([TestNode1]);
        const n = r.create<TestNode1>('TestNode1');
        expect(n).toBeInstanceOf(TestNode1);
        
        expect(() => {
            r.create('UnknownNode');
        }).toThrow(RegistryUnknownClassError);
    });

    it('prevents double registration of nodes and data', () => {
        const r = new Registry();
        r.registerNode(TestNode1);
        expect(() => {
            r.registerNode(TestNode1);
        }).toThrow(RegistryAlreadyExistsError);

        r.registerDatum(TestDatum1 as unknown as DatumConstructor);
        expect(() => {
            r.registerDatum(TestDatum1 as unknown as DatumConstructor);
        }).toThrow(RegistryAlreadyExistsError);
    });
    
    it('RegistryError instances', () => {
        const err1 = new RegistryAlreadyExistsError('Type', 'id1');
        expect(err1.message).toBe('Type with ID id1 is already registered');
        
        const err2 = new RegistryUnknownClassError('MyClass');
        expect(err2.message).toBe('Class MyClass is unknown');
    });
});
