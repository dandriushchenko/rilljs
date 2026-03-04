import {
    TextTypeID, NumberTypeID, BoolTypeID
} from '../../../library';
import { TextDataDrawer } from './TextDataDrawer';
import { type DataDrawerProps } from '../props';
import { NumberDataDrawer } from './NumberDataDrawer';
import { BoolDataDrawer } from './BoolDataDrawer';

export * from './TextDataDrawer';
export * from './NumberDataDrawer';
export * from './BoolDataDrawer';

// eslint-disable-next-line @typescript-eslint/no-deprecated
export const defaultDataDrawers: Record<string, React.FunctionComponent<DataDrawerProps> | React.ClassicComponentClass<DataDrawerProps>> = {
    // We will validate classes dynamically, so need to suppress here the types
    [TextTypeID]: TextDataDrawer as React.FunctionComponent<DataDrawerProps>,
    [NumberTypeID]: NumberDataDrawer as React.FunctionComponent<DataDrawerProps>,
    [BoolTypeID]: BoolDataDrawer as React.FunctionComponent<DataDrawerProps>
};
