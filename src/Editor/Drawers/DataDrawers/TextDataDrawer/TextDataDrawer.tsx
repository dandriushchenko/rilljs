import React, { useState } from 'react';

import { InputField } from '../../../Components';
import { type Text } from '../../../../library';
import { type DataDrawerProps } from '../../props';

export type TextDataDrawerProps = DataDrawerProps<string, Text>;

export function TextDataDrawer(props: TextDataDrawerProps) {
    const {
        value,
        options,
        onValueChange
    } = props;

    const { readonly } = options;
    const [, redraw] = useState({});

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    function onChange(event: React.FormEvent<HTMLInputElement>) {
        const v = event.currentTarget.value;
        onValueChange(v);
        redraw({});
    }

    return (
        <InputField
            value={value.value || ''}
            onChange={onChange}
            disabled={readonly}
        />
    );    
}