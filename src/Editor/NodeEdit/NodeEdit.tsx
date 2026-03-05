import React, { useContext, useMemo } from 'react';

import { type ModelActions, ModelActionsContext } from '../model';
import { type Node } from '../../model';
import { type Theme, ThemeContext } from '../theme';
import { type Options, OptionsContext } from '../options';
import { NodeDrawer } from '../Drawers';

export interface NodeEditProps {
  node: Node;
  invalid?: string;
}

export const NodeEdit = React.memo((props: NodeEditProps) => {
  const { node, invalid } = props;

  const theme = useContext<Theme>(ThemeContext);
  const actions = useContext<ModelActions>(ModelActionsContext);
  const options = useContext<Options>(OptionsContext);

  const Drawer = useMemo(() => {
    const NativeDrawer = options.drawers.nodes[node.defn.class];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return NativeDrawer || NodeDrawer;
  }, [node.defn.class, options]);

  return <Drawer node={node} actions={actions} options={options} theme={theme} invalid={invalid} />;
});
