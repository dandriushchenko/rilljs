import { boolConverter } from './bool';
import { numberConverter } from './number';
import { textConverter } from './text';
import { type ConverterFrom, type ConverterTo } from '../../model';

export * from './bool';
export * from './text';

export const BuiltinConverters = [
    boolConverter,
    numberConverter,
    textConverter
] as unknown as (ConverterFrom & ConverterTo)[];
