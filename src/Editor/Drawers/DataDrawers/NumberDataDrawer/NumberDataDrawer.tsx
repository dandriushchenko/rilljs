import React, { useState } from 'react';

import { InputField } from '../../../Components';
import { type RNumber } from '../../../../library';
import { type DataDrawerProps } from '../../props';

export type NumberDataDrawerProps = DataDrawerProps<number, RNumber>;

export function NumberDataDrawer(props: NumberDataDrawerProps) {
  const { value, onValueChange, options } = props;

  const { readonly } = options;
  const [, redraw] = useState({});

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    let v = +event.currentTarget.value;
    if (isNaN(v)) {
      v = 0;
    }
    onValueChange(v);
    redraw({});
  }

  return <InputField type='text' value={value.value} onChange={onChange} disabled={readonly} />;
}
