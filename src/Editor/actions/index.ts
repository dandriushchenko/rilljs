export * from './action';
export * from './node';
export * from './connection';
export * from './editor';

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
