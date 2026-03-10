import { type Datum } from '../data';
import { type IOValue } from './value';
import { type IOFlow } from './flow';

export type OutputValue<DT = unknown, T extends Datum<DT> = Datum<DT>> = IOValue<DT, T>;
export type OutputFlow = IOFlow;
