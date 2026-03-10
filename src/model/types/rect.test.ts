import { describe, it, expect } from 'vitest';
import { rectToBox, rectFromPoints, rectsOverlap, rectsEqual, coordsInRect } from './rect';

describe('rect', () => {
  it('rectToBox', () => {
    const box = rectToBox({ x: 10, y: 20, width: 30, height: 40 });
    expect(box).toEqual({ left: 10, top: 20, right: 40, bottom: 60 });
  });

  it('rectFromPoints', () => {
    const r1 = rectFromPoints({ x: 10, y: 10 }, { x: 50, y: 70 });
    expect(r1).toEqual({ x: 10, y: 10, width: 40, height: 60 });

    const r2 = rectFromPoints({ x: 10, y: 10 }, { x: 50, y: 70 }, { x: 5, y: 5 });
    expect(r2).toEqual({ x: 5, y: 5, width: 40, height: 60 });

    const r3 = rectFromPoints({ x: 50, y: 70 }, { x: 10, y: 10 });
    expect(r3).toEqual({ x: 10, y: 10, width: 40, height: 60 });
  });

  it('rectsOverlap', () => {
    const r1 = { x: 0, y: 0, width: 10, height: 10 };
    const r2 = { x: 5, y: 5, width: 10, height: 10 };
    const r3 = { x: 15, y: 15, width: 10, height: 10 };
    const r4 = { x: 0, y: 15, width: 10, height: 10 };

    expect(rectsOverlap(r1, r2)).toBe(true);
    expect(rectsOverlap(r1, r3)).toBe(false);
    expect(rectsOverlap(r1, r4)).toBe(false);
    expect(rectsOverlap(r4, r1)).toBe(false);
  });

  it('rectsEqual', () => {
    const r1 = { x: 0, y: 0, width: 10, height: 10 };
    const r2 = { x: 0, y: 0, width: 10, height: 10 };
    const r3 = { x: 0, y: 0, width: 11, height: 10 };
    expect(rectsEqual(r1, r2)).toBe(true);
    expect(rectsEqual(r1, r3)).toBe(false);
  });

  it('coordsInRect', () => {
    const r = { x: 10, y: 10, width: 10, height: 10 };
    expect(coordsInRect({ x: 15, y: 15 }, r)).toBe(true);
    expect(coordsInRect({ x: 5, y: 15 }, r)).toBe(false);
    expect(coordsInRect({ x: 15, y: 5 }, r)).toBe(false);
    expect(coordsInRect({ x: 25, y: 15 }, r)).toBe(false);
    expect(coordsInRect({ x: 15, y: 25 }, r)).toBe(false);
    expect(coordsInRect({ x: 10, y: 10 }, r)).toBe(true);
    expect(coordsInRect({ x: 20, y: 20 }, r)).toBe(true);
  });
});
