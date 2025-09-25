import { SolidFill } from "@arction/lcjs";

export function forEachIn(object: any, clbk: (value: any) => any) {
  const obj: any = {};
  for (const a in object)
    obj[a] = clbk(object[a]);
  return obj;
}

export function createColorObject(colors: any) {
  return forEachIn(colors, (color: any) => new SolidFill({ color }));
}

export function getIndexFromArray(x: number, dx: number): number {
  const p = Math.round(x / dx);
  return p;
}

export function getIndexFromArray3(x: number, dx: number, dstart: number): number {
  const p = Math.round((x - dstart) / dx);
  return p;
}

export function setPositionFromIndex(idx: number, dx: number, dstart: number): string {
  const p = dstart + (idx * dx);
  return p.toFixed(3);
}