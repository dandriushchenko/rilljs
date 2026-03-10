import { type Node } from '../nodes/node';

export abstract class ExecutorError extends Error {}

export class ExecutorUndefinedInputError extends ExecutorError {
  constructor(node: Node, input: string) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    super(`Input ${input} value is undefined in node ${String(node)}.`);
  }
}
