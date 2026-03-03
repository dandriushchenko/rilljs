import { Registry } from '../model/registry';
import { BuiltinNodeTypes, BuiltinDataTypes } from './index';

export const defaultRegistry = new Registry(
    BuiltinNodeTypes,
    BuiltinDataTypes
);

