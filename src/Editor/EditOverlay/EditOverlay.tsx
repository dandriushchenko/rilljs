import React, { useContext, useState, useEffect, useMemo } from 'react';

import { ThemeContext, type Theme } from '../theme';
import { mergeClasses } from '../Components';
import { type ModelActions, ModelActionsContext } from '../model';
import { type Coords } from '../../model';
import { NodeEdit } from '../NodeEdit';

export interface EditOverlayProps {
  nodes: string[];
  allowMultiNodeEdit?: boolean;
}

const DEFAULT_WIDTH = 400;

export const EditOverlay = React.memo((props: EditOverlayProps) => {
  const { nodes: ids, allowMultiNodeEdit } = props;

  const theme = useContext<Theme>(ThemeContext).classes;
  const classes = mergeClasses(theme.panel);
  const actions = useContext<ModelActions>(ModelActionsContext);
  const nodes = useMemo(() => {
    return actions.findNodes((n) => ids.includes(n.node.nodeID)).map((n) => ({ node: n.node, invalid: n.invalid }));
  }, [actions, ids]);

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [initialWidth, setInitialWidth] = useState<number>();
  const [mouseDownPos, setMouseDownPos] = useState<Coords>();

  useEffect(() => {
    if (typeof initialWidth === 'undefined' || !mouseDownPos) {
      return;
    }

    const downX = mouseDownPos.x;

    function onMouseMove(event: MouseEvent) {
      const diff = downX - event.clientX;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newWidth = initialWidth! + diff;
      setWidth(Math.max(DEFAULT_WIDTH, Math.abs(newWidth)));
    }

    function onMouseUp() {
      setInitialWidth(undefined);
      setMouseDownPos(undefined);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [initialWidth, mouseDownPos]);

  function stopPropagation(event: React.SyntheticEvent) {
    event.stopPropagation();
  }

  function onMouseDown(event: React.MouseEvent) {
    setMouseDownPos({
      x: event.clientX,
      y: event.clientY,
    });
    setInitialWidth(width);
  }

  if (nodes.length === 0 || (!allowMultiNodeEdit && nodes.length > 1)) {
    return null;
  }

  return (
    <div
      style={{
        zIndex: 1,
        position: 'absolute',
        top: 5,
        right: 5,
        // bottom: 10,
        maxHeight: 'calc(100% - 20px)',
        padding: 5,
        overflow: 'scroll',
        // overflow: 'auto',
        // pointerEvents: 'none'
      }}
    >
      <div
        className={classes}
        style={{
          width,
          maxWidth: 'calc(100% - 20px) !important',
          display: 'flex',
          flexDirection: 'row',
          paddingLeft: 0,
          pointerEvents: 'all',
        }}
        onClick={stopPropagation}
        onDoubleClick={stopPropagation}
        onContextMenu={stopPropagation}
      >
        <div className={theme.resizer} onMouseDown={onMouseDown} />
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
          }}
        >
          {nodes.map((n) => (
            <NodeEdit key={n.node.nodeID} node={n.node} invalid={n.invalid} />
          ))}
        </div>
      </div>
    </div>
  );
});
