import type { Node, NodeDesign, Coords, Rect } from '../../model';
import type { CanvasTheme } from '../theme';

export interface NodeLayoutPort {
    port: Coords;
    icon?: Rect;
    text: Rect;
}

export interface NodeLayout {
    flowsIn: Record<string, NodeLayoutPort>;
    flowsOut: Record<string, NodeLayoutPort>;
    valuesIn: Record<string, NodeLayoutPort>;
    valuesOut: Record<string, NodeLayoutPort>;
    height: number;
    classCaption: Coords;
}

export function calcNodeAndPortsLayout(node: Node, design: NodeDesign, theme: CanvasTheme, portsCentered: boolean): NodeLayout {
    const flowsIn = node.getFlowInputs();
    const flowsOut = node.getFlowOutputs();
    const flowLines = Math.max(flowsIn.length, flowsOut.length);
    const valuesIn = node.getValueInputs();
    const valuesOut = node.getValueOutputs();
    const valuesLines = Math.max(valuesIn.length, valuesOut.length);

    const res: NodeLayout = {
        flowsIn: {},
        flowsOut: {},
        valuesIn: {},
        valuesOut: {},
        height:
            theme.node.header.height +
            flowLines * theme.node.ports.flow.height +
            valuesLines * theme.node.ports.value.height,
        classCaption: {
            x: 0,
            y: -15
        }
    };

    const flowOffset = theme.node.ports.flow.width + theme.node.ports.flow.width * 2 / 3;
    const flowCentered = portsCentered ? theme.node.ports.flow.height / 2 : 0;
    const valueOffset = theme.node.ports.value.width + theme.node.ports.value.width * 2 / 3;
    const valueCentered = portsCentered ? theme.node.ports.value.height / 2 : 0;
    const portOffset = Math.max(flowOffset, valueOffset);

    const padding = 7;

    flowsIn.forEach((f, fi) => {
        const fullWidth = fi >= flowsOut.length;
        res.flowsIn[f.id] = {
            port: {
                x: -portOffset,
                y: theme.node.header.height + fi * theme.node.ports.flow.height + flowCentered
            },
            text: {
                x: padding,
                y: theme.node.header.height + fi * theme.node.ports.flow.height + flowCentered,
                width: fullWidth ? design.width - padding * 2 : design.width / 2 - padding,
                height: theme.node.ports.flow.height
            }
        };
    });

    flowsOut.forEach((f, fi) => {
        const fullWidth = fi >= flowsIn.length;
        res.flowsOut[f.id] = {
            port: {
                x: design.width + portOffset,
                y: theme.node.header.height + fi * theme.node.ports.flow.height + flowCentered
            },
            text: {
                x: fullWidth ? padding : design.width / 2,
                y: theme.node.header.height + fi * theme.node.ports.flow.height + flowCentered,
                width: fullWidth ? design.width - padding * 2 : design.width / 2 - padding,
                height: theme.node.ports.flow.height
            }
        };
    });

    valuesIn.forEach((v, vi) => {
        const fullWidth = vi >= valuesOut.length;
        res.valuesIn[v.id] = {
            port: {
                x: -portOffset,
                y: theme.node.header.height + vi * theme.node.ports.value.height + flowLines * theme.node.ports.flow.height + valueCentered
            },
            text: {
                x: padding,
                y: theme.node.header.height + vi * theme.node.ports.value.height + flowLines * theme.node.ports.flow.height + valueCentered,
                width: fullWidth ? design.width - padding * 2 : design.width / 2 - padding,
                height: theme.node.ports.value.height
            }
        };
    });

    valuesOut.forEach((v, vi) => {
        const fullWidth = vi >= valuesIn.length;
        res.valuesOut[v.id] = {
            port: {
                x: design.width + portOffset,
                y: theme.node.header.height + vi * theme.node.ports.value.height + flowLines * theme.node.ports.flow.height + valueCentered
            },
            text: {
                x: fullWidth ? padding : design.width / 2,
                y: theme.node.header.height + vi * theme.node.ports.value.height + flowLines * theme.node.ports.flow.height + valueCentered,
                width: fullWidth ? design.width - padding * 2 : design.width / 2 - padding,
                height: theme.node.ports.value.height
            }
        };
    });

    return res;
}
