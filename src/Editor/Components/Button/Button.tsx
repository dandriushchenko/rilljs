import React, { useContext } from 'react';
import { mergeClasses } from '../utils';
import { type Theme, ThemeContext } from '../../theme';
import { type BaseProps } from '../props';
import { type IconName } from '../Icons';
import { Icon } from '../Icon';

export interface ButtonProps extends BaseProps {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  icon?: IconName | React.ReactNode;
  active?: boolean;
  fill?: boolean;
  disabled?: boolean;
  text?: string;
  title?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export function Button(props: React.PropsWithChildren<ButtonProps>) {
  const { icon, active, fill, disabled, children, text, className, style, title, onClick } = props;

  const theme = useContext<Theme>(ThemeContext);
  const classes = mergeClasses(
    theme.classes.button,
    {
      [theme.classes.active]: active,
      [theme.classes.disabled]: disabled,
      [theme.classes.fill]: fill,
    },
    className
  );

  return (
    <button type='button' className={classes} style={style} onClick={onClick} title={title}>
      {icon && <Icon icon={icon} />}
      {(text ?? children) && (
        <span key='text' className={theme.classes.buttonText}>
          {children}
        </span>
      )}
    </button>
  );
}
