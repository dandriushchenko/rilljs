import type React from 'react';
import {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

import {type Theme, ThemeContext} from '../../theme';

export function Portal(props: React.PropsWithChildren<{}>): React.ReactPortal {

    const theme = useContext<Theme>(ThemeContext).classes;
    const [containerEl] = useState(() => document.createElement("div"));

    useEffect(() => {
        document.body.appendChild(containerEl);
        return () => {
            document.body.removeChild(containerEl);
        };
    }, [containerEl]);

    useEffect(() => {
        containerEl.className = theme.portal;
    }, [containerEl, theme]);

    return ReactDOM.createPortal(props.children, containerEl);
}
