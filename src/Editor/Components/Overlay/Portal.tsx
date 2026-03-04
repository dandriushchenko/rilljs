import type React from 'react';
import {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

import {type Theme, ThemeContext} from '../../theme';

export type PortalProps = Record<string, unknown>;
export function Portal(props: React.PropsWithChildren<PortalProps>): React.ReactPortal | null {

    const theme = useContext<Theme>(ThemeContext).classes;
    const [containerEl] = useState(() => document.createElement("div"));

    useEffect(() => {
        document.body.appendChild(containerEl);
        return () => {
            document.body.removeChild(containerEl);
        };
    }, [containerEl]);

    useEffect(() => {
        containerEl.setAttribute('class', theme.portal || '');
    }, [containerEl, theme]);

    return ReactDOM.createPortal(props.children, containerEl);
}
