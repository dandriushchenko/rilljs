export interface Action {
  type: string;
}

export type ActionCompressor<T extends Action> = (previous: T, current: T) => T | undefined;
