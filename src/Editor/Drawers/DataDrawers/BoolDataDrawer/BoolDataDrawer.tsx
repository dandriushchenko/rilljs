import React, { useState } from 'react';

import { Switch } from '../../../Components';
import { type Bool } from '../../../../library';
import { type DataDrawerProps } from '../../props';

export type BoolDataDrawerProps = DataDrawerProps<boolean, Bool>;

export function BoolDataDrawer(props: BoolDataDrawerProps) {
  const { value, theme, options, onValueChange } = props;

  const { readonly } = options;
  const [, redraw] = useState({});

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const v = event.currentTarget.checked;
    onValueChange(v);
    redraw({});
  }

  const label = 'Bool';
  const help = 'help';
  const labelHelp = 'labelHelp';

  return (
    <>
      <Switch label={label} checked={value.value} onChange={onChange} disabled={readonly} />
      {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (help || labelHelp) && (
          <div className={theme.classes.help}>
            {labelHelp}
            {help}
          </div>
        )
      }
    </>
  );
}
