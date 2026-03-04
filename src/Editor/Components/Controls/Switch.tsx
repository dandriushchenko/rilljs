import { useContext } from 'react';

import { type ControlProps, Control } from './Control';
import { type Theme, ThemeContext } from '../../theme';

export interface SwitchProps extends ControlProps {
    innerLabelChecked?: string;
    innerLabel?: string;
}

export function Switch(props: SwitchProps) {
    const {
        innerLabelChecked,
        innerLabel,
        ...rest
    } = props;

    const theme = useContext<Theme>(ThemeContext).classes.controls;
    const switchLabels = innerLabel || innerLabelChecked ? [
            <div
                key="checked"
                className={theme.indicatorChild}
            >
                <div className={theme.switchInnerText}>
                    {innerLabelChecked ?? innerLabel}
                </div>
            </div>,
            <div
                key="unchecked"
                className={theme.indicatorChild}
            >
                <div className={theme.switchInnerText}>{innerLabel}</div>
            </div>
        ] : '';
    return (
        <Control
            {...rest}
            type="checkbox"
            typeClassName={theme.switch}
            indicatorChildren={switchLabels}
        />
    );
}
