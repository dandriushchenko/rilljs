import { Bool } from './bool';
import { Text } from './text';
import { RNumber } from './number';
import { type DatumConstructor } from '../../model';

export * from './bool';
export * from './number';
export * from './text';

export const BuiltinDataTypes: Array<DatumConstructor<boolean> | DatumConstructor<string> | DatumConstructor<number>> = [
    Bool,
    Text,
    RNumber
];
