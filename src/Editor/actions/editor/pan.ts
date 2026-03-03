import { type Action } from '../action';
import { type Coords } from '../../../model';

export interface PanView extends Action {
    type: 'PanView';
    pan: Coords;
}

export function PanViewCompressor(_previous: PanView, current: PanView) {
    return current;
}
