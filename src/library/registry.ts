import { Registry } from '../model/registry';
import { type DatumConstructor } from '../model';
import { BuiltinNodeTypes } from './nodes';
import { BuiltinDataTypes } from './data';

export const defaultRegistry = new Registry(BuiltinNodeTypes, BuiltinDataTypes as unknown as DatumConstructor[]);
