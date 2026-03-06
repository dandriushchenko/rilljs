import type { Node, NodeConstructor } from '../nodes/node';
import type { DatumDefinition, DatumConstructor } from '../data/datum';
import { RegistryAlreadyExistsError, RegistryUnknownClassError } from './error';

type NodesMap = Record<
  string,
  {
    ctor: NodeConstructor;
    sample: Node;
  }
>;

type DataMap = Record<
  string,
  {
    ctor: DatumConstructor;
  }
>;

export class Registry {
  protected nodesMap: NodesMap;
  protected dataMap: DataMap;

  constructor(nodes: NodeConstructor[] = [], data: DatumConstructor[] = []) {
    this.nodesMap = {};
    this.dataMap = {};
    nodes.forEach((n) => {
      Registry.registerNode(n, this.nodesMap);
    });
    data.forEach((d) => {
      Registry.registerDatum(d, this.dataMap);
    });
  }

  registerNode(node: NodeConstructor) {
    Registry.registerNode(node, this.nodesMap);
  }

  static registerNode(node: NodeConstructor, nodesMap: NodesMap) {
    const instance = new node();
    if (instance.defn.class in nodesMap) {
      throw new RegistryAlreadyExistsError('Node', instance.defn.class);
    }
    nodesMap[instance.defn.class] = {
      ctor: node,
      sample: instance,
    };
  }

  registerDatum(datum: DatumConstructor) {
    Registry.registerDatum(datum, this.dataMap);
  }

  static registerDatum(datum: DatumConstructor, dataMap: DataMap) {
    const defn = datum.defn;
    if (defn.id in dataMap) {
      throw new RegistryAlreadyExistsError('Datum', defn.id);
    }
    dataMap[defn.id] = {
      ctor: datum,
    };
  }

  findNodes(text: string | null, predicate?: (node: Node) => boolean): Node[] {
    const tl = text ? text.toLowerCase() : null;
    return Object.values(this.nodesMap)
      .filter((n) => (predicate ? predicate(n.sample) : true))
      .filter(
        (n) =>
          !tl ||
          tl === '' ||
          `${n.sample.nodeID} ${n.sample.defn.name ?? ''} ${n.sample.defn.description ?? ''}`.toLowerCase().includes(tl)
      )
      .map((n) => n.sample);
  }

  findDatum(text: string | null, predicate?: (datum: DatumDefinition) => boolean): DatumDefinition[] {
    const tl = text ? text.toLowerCase() : null;
    return Object.values(this.dataMap)
      .filter((n) => (predicate ? predicate(n.ctor.defn) : true))
      .filter(
        (n) =>
          !tl ||
          tl === '' ||
          `${n.ctor.defn.id} ${n.ctor.defn.name ?? ''} ${n.ctor.defn.description ?? ''}`.toLowerCase().includes(tl)
      )
      .map((n) => n.ctor.defn);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  create<T extends Node>(id: string): T {
    const details = this.nodesMap[id];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!details) {
      throw new RegistryUnknownClassError(id);
    }

    return new details.ctor() as T;
  }
}
