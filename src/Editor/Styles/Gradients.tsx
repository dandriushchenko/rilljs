import React, { useContext } from 'react';
import { type Theme, ThemeContext } from '../theme';

export const Gradients = React.memo(() => {
  const theme = useContext<Theme>(ThemeContext).filters.gradients;

  return (
    <>
      {Object.keys(theme).map((key) => {
        const f = theme[key];
        return (
          <linearGradient
            key={key}
            id={key}
            x1={`${String(f.x1)}%`}
            y1={`${String(f.y1)}%`}
            x2={`${String(f.x2)}%`}
            y2={`${String(f.y2)}%`}
          >
            {f.stops.map((s, si) => (
              <stop key={si} offset={`${String(s.offset)}%`} stopColor={s.stopColor} />
            ))}
          </linearGradient>
        );
      })}
    </>
  );
});
