import React, { useContext } from 'react';

import { type Rect } from '../model';
import { type Theme, ThemeContext } from './theme';
import { type BaseProps, mergeClasses } from './Components';

export interface GridProps extends BaseProps {
    rect: Rect;
}

export function Lasso(props: React.PropsWithChildren<GridProps>) {
    const {
        rect,
        className,
        style
    } = props;

    const theme = useContext<Theme>(ThemeContext).canvas.lasso;

    return (
        <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            className={mergeClasses(className, theme)}
            style={style}
        />
    );
}
