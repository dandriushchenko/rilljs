import React, { useState } from 'react';

import { InputField } from '../../../Components';
import { type Text } from '../../../../library';
import { type DataDrawerProps } from '../../props';

export type TextDataDrawerProps = DataDrawerProps<string, Text>;

export function TextDataDrawer(props: TextDataDrawerProps) {
  const { value, options, onValueChange } = props;

  const { readonly } = options;
  const [, redraw] = useState({});

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const v = event.currentTarget.value;
    onValueChange(v);
    redraw({});
  }

  return <InputField value={value.value || ''} onChange={onChange} disabled={readonly} />;
}
