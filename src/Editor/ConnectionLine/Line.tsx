import React, { useContext } from 'react';

import { ConnectionType, type Coords } from '../../model';
import { ThemeContext, type Theme } from '../theme';
import { mergeClasses, type BaseProps } from '../Components';

export interface LineProps extends BaseProps {
  from: Coords;
  to: Coords;
  type: ConnectionType;
  vector: boolean;

  onClick?: (event: React.MouseEvent<SVGElement>) => void;
  onAnimationStart?: (event: React.AnimationEvent<SVGElement>) => void;
  onAnimationEnd?: (event: React.AnimationEvent<SVGElement>) => void;
}

function LineImpl(props: LineProps) {
  const theme = useContext<Theme>(ThemeContext).canvas.connection;

  const {
    from: fromOriginal,
    to: toOriginal,
    type,
    vector,
    style,
    className,
    onClick,
    onAnimationStart,
    onAnimationEnd,
  } = props;

  const isReversed = false; // toOriginal.x < fromOriginal.x;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const to = isReversed ? fromOriginal : toOriginal;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const from = isReversed ? toOriginal : fromOriginal;

  const halfX = Math.abs(((to.x - from.x) / 3) * 2);
  const classes = mergeClasses(className, type === ConnectionType.Flow ? theme.flow : theme.value);

  const LineLevelThreshold = 10;
  const extrude = 10;
  // if (Math.abs(to.x - from.x) <= LineLevelThreshold) {
  //     return (
  //         <>
  //             <line
  //                 style={style}
  //                 x1={from.x}
  //                 y1={from.y}
  //                 x2={from.x + extrude}
  //                 y2={from.y}
  //                 className={classes}
  //                 onClick={onClick}
  //                 onAnimationStart={onAnimationStart}
  //                 onAnimationEnd={onAnimationEnd}
  //             />
  //             <line
  //                 style={style}
  //                 x1={from.x + extrude}
  //                 y1={from.y}
  //                 x2={to.x - extrude}
  //                 y2={to.y}
  //                 className={classes}
  //                 onClick={onClick}
  //                 onAnimationStart={onAnimationStart}
  //                 onAnimationEnd={onAnimationEnd}
  //             />
  //             <line
  //                 style={style}
  //                 x1={to.x - extrude}
  //                 y1={to.y}
  //                 x2={to.x}
  //                 y2={to.y}
  //                 markerEnd={vector ? undefined : ''}
  //                 className={classes}
  //                 onClick={onClick}
  //                 onAnimationStart={onAnimationStart}
  //                 onAnimationEnd={onAnimationEnd}
  //             />
  //         </>
  //     );
  // } else
  if (Math.abs(to.y - from.y) <= LineLevelThreshold) {
    return (
      <>
        <line
          style={style}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          markerEnd={vector ? undefined : ''}
          className={classes}
          onClick={onClick}
          onAnimationStart={onAnimationStart}
          onAnimationEnd={onAnimationEnd}
        />
      </>
    );
  } else {
    return (
      <path
        style={style}
        d={`M${String(from.x)},${String(from.y)} L${String(from.x + extrude)},${String(from.y)} C${String(from.x + halfX)},${String(from.y)} ${String(to.x - halfX)},${String(to.y)} ${String(to.x - extrude)},${String(to.y)} L${String(to.x)},${String(to.y)}`}
        markerEnd={vector ? undefined : ''}
        className={classes}
        onClick={onClick}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
      />
    );
  }
}

export const Line = React.memo(LineImpl);
