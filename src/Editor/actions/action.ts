import {
  type PanView,
  type SelectNodes,
  type GroupNodes,
  type UngroupNodes,
  type ZoomView,
  type ReorderNode,
} from './editor';
import { type CreateNodes, type DeleteNodes, type UpdateNode, type MoveNodes } from './node';
import {
  type CreateConnection,
  type DeleteConnections,
  type DesignConnection,
  type UpdateConnection,
} from './connection';

export interface Action {
  type: string;
}

export type ActionType =
  | PanView
  | ZoomView
  | ReorderNode
  | SelectNodes
  | GroupNodes
  | UngroupNodes
  | CreateNodes
  | DeleteNodes
  | MoveNodes
  | UpdateNode
  | CreateConnection
  | DeleteConnections
  | DesignConnection
  | UpdateConnection;

export type ActionCompressor<T extends Action> = (previous: T, current: T) => T | undefined;
