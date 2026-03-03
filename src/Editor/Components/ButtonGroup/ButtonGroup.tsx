import React, { useMemo, useContext } from 'react';
import { type BaseProps } from '../props';
import { type Theme, ThemeContext } from '../../theme';
import { mergeClasses } from '../utils';

export interface ButtonGroupProps extends BaseProps {
    fill?: boolean;
}

export function ButtonGroup(props: React.PropsWithChildren<ButtonGroupProps>) {
    const {
        className,
        fill,
        style,
        children
    } = props;

    const theme = useContext<Theme>(ThemeContext).classes;
    const classes = useMemo(() => {
        return mergeClasses(
            theme.buttonGroup,
            {
                [theme.fill]: fill
            },
            className
        );
    }, [className, fill, theme]);

    return (
        <div
            className={classes}
            style={style}
        >
            {children}
        </div>        
    );
}
