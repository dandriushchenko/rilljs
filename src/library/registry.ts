import { Registry } from '../model/registry';
import { type DatumConstructor } from '../model';
import { BuiltinNodeTypes, BuiltinDataTypes } from './index';

export const defaultRegistry = new Registry(
    BuiltinNodeTypes,
    BuiltinDataTypes as unknown as DatumConstructor[]
);

