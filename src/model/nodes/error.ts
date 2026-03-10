
export abstract class NodeError extends Error {}

export class NodeInvalidSerializedTypeError extends Error {
  value: { id: string };
  constructor(expected: string, value: { id: string }) {
    super(`Expected node type ${expected}, while received type ${value.id}`);
    this.value = value;
  }
}

export class NodeInputAlreadyExistsError extends Error {
  constructor(id: string, node: { defn: { class: string } }) {
    super(`Node input with ID ${id} already exists. (Node class: ${node.defn.class})`);
  }
}

export class NodeInputDoesntExistError extends Error {
  constructor(id: string, node: { defn: { class: string } }) {
    super(`Node input with ID ${id} doesn't exist. (Node class: ${node.defn.class})`);
  }
}

export class NodeOutputAlreadyExistsError extends Error {
  constructor(id: string, node: { defn: { class: string } }) {
    super(`Node output with ID ${id} already exists. (Node class: ${node.defn.class})`);
  }
}

export class NodeOutputDoesntExistError extends Error {
  constructor(id: string, node: { defn: { class: string } }) {
    super(`Node output with ID ${id} doesn't exist. (Node class: ${node.defn.class})`);
  }
}
