import { ColorRGBA, LUT } from "@arction/lcjs";
import {
  colormapDensity,
  colormapGray,
  colormapOdtPetrel,
  colormapOdtSeismic,
  colormapSharp,
  colormapYrwbc
} from "./var_colormaps";
import _ from "lodash";

export function createColormapData(color_list: number[][], vmin_: number, vmax_: number) {
  const ndata_range = color_list.length;
  const data_range = vmax_ - vmin_;
  const delta_data_range = data_range / (ndata_range - 1);

  const vcolormap = [];
  for (let i = 0; i < ndata_range; i++) {
    const V = delta_data_range * i + vmin_;
    const R = ~~(color_list[i][0] * 255);
    const G = ~~(color_list[i][1] * 255);
    const B = ~~(color_list[i][2] * 255);
    const v = {
      value: V,
      color: ColorRGBA(R, G, B)
    };
    vcolormap.push(v);
  }
  return vcolormap;
}

export function get2dRowSize(data: number[][]): number {
  if (data === undefined) return 0;
  return data.length;
}

export function get2dColSize(data: number[][]): number {
  if (data === undefined) return 0;
  return data[0].length;
}

export function get2dMinData(data: number[][]): number {
  if (data === undefined) return 0;

  const minRow = data.map(function (row) {
    return Math.min.apply(Math, row);
  });
  const mmin = Math.min.apply(null, minRow);
  return mmin;
}

export function get2dMaxData(data: number[][]): number {
  if (data === undefined) return 0;

  const maxRow = data.map(function (row) {
    return Math.max.apply(Math, row);
  });
  const mmax = Math.max.apply(null, maxRow);
  return mmax;
}

export function getLcColormap(colormap: { id: number; reverse?: boolean }, mmin_: number, mmax_: number) {
  let cc: number[][] = [];
  
  switch (colormap.id) {
    case 0:
      cc = colormapSharp();
      break;
    case 1:
      cc = colormapYrwbc();
      break;
    case 2:
      cc = colormapOdtSeismic();
      break;
    case 3:
      cc = colormapOdtPetrel();
      break;
    case 4:
      cc = colormapGray();
      break;
    case 5:
      cc = colormapDensity();
      break;
    default:
      cc = colormapOdtPetrel();
      break;
  }
  
  if (colormap.reverse) {
    cc = [...cc].reverse();
  }

  const palette = new LUT({
    steps: createColormapData(cc, mmin_, mmax_),
    interpolate: true
  });
  
  return palette;
}

export function getLcColormapV1(ncolor: number, colormap: any, mmin_: number, mmax_: number)
{
  let cc;
  switch (colormap.id)
  {
    case 0:
      cc = colormapSharp();
      break;
    case 1:
      cc = colormapYrwbc();
      break;
    case 2:
      cc = colormapOdtSeismic();
      break;
    case 3:
      cc = colormapOdtPetrel();
      break;
    case 4:
      cc = colormapGray();
      break;
    case 5:
      cc = colormapDensity();
      break;
    default:
      cc = colormapOdtPetrel();
      break;
  }
  if (colormap.reverse)
    _.reverse(cc);

  let n_cc = cc.length;
  let cc_small = [];
  let c_spacing = Math.round(n_cc/ncolor);
  for(let i=0; i<ncolor; i++)
  {
    cc_small.push(cc[c_spacing*i])
  }
  cc_small.push(cc[n_cc-1]);

  let palette = new LUT({
    steps: createColormapData(cc_small, mmin_, mmax_),
    interpolate: true
  });
  return (palette);
}

export function getColormapName(ii: number)
{
  switch (ii)
  {
    case 0:
      return('Sharp');
    case 1:
      return('YRWBC');
    case 2:
      return('Seismic');
    case 3:
      return('Petrel');
    case 4:
      return('Gray');
    case 5:
      return('Density');
    default:
      return ('Petrel');
  }
}

export function getColormapAsset(ii: number)
{
  switch (ii)
  {
    case 0:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAABlElEQVR4nO3V22qDQBRA0aP+/yfH6UMp5KGFpmkuG9YCyWECjiPI3tZl1qyZOWdmfXPdsn7PPX6aH7nnK855z3tZMzPbzH7MbPvndT1vf1z/j3v8dn1/1J7H48+53/6Ma7ZZa5vznLlcZs5znjr/5v9n7/mKc94yf31mc8zMfvX7zPkd9zze75z7AECQgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJAkYAEkCBkCSgAGQJGAAJH0Ae+JIl9UOpkAAAAAASUVORK5CYII=');
    case 1:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAABgklEQVR4nO3V0UqFUBBA0VH//4tD7aGCXoIK8bphLTg4IDicB9nL+TbnHDOzz8zxef47X/ENO3/eec7MLDPbNrOuH+eK+ervvWLntj3ynueyzHkucxwz+z5zHHPr/Jv3d+98xT3/Mn/9ZrPNzPrteef8xJ3b8+65DgAECRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQNI7pZtIl7iDnMMAAAAASUVORK5CYII=');
    case 2:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAACc0lEQVR4nO3VTW7bSBSF0VtsOUHQ+19FrzFVPdAfRdF2gIwucA4gmH4qVpEe+Bv/JWuMZEsykozx+tkOv2ck2/a+boxkHOfb+frc996e12f75OTMfLHHn6wfJ+s/O/N0NvL4Y/3N+v38uMdxtp/vZ1+tP555fJbP9ni5/2z+yR7fzrdc/c0eY0vGv7fPr+tn+5nkZ9b4kYyP2+dHst2ucznMLkkuWeN2/bjn8vh9jUuSj2S7rctz3RqX6/f7dbf71312v85H5rhkrn+y1spaK3Pm9nM9Zmtl9/35d3PO5/XuuzlX1h+uf9l37s+cr/eerT8843O+3udzZb48x9ke8212fO7TvfPJ/JvZt2ce9s3K4dk/W//+ntmvXed7rDmzcvae1/V5e8/53De7PY6z/fwxm7szD8+Y3Zln++d6//OdTt4z9zN3+3+xR/Zn5vXseXLWfe28nXH9+Ttz/n78WwGAKgIGQCUBA6CSgAFQScAAqCRgAFQSMAAqCRgAlQQMgEoCBkAlAQOgkoABUEnAAKgkYABUEjAAKgkYAJUEDIBKAgZAJQEDoJKAAVBJwACoJGAAVBIwACoJGACVBAyASgIGQCUBA6CSgAFQScAAqCRgAFQSMAAqCRgAlQQMgEoCBkAlAQOgkoABUEnAAKgkYABUEjAAKgkYAJUEDIBKAgZAJQEDoJKAAVBJwACoJGAAVBIwACoJGACVBAyASgIGQCUBA6CSgAFQScAAqCRgAFQSMAAqCRgAlQQMgEoCBkAlAQOgkoABUEnAAKgkYABUEjAAKgkYAJUEDIBKAgZAJQEDoJKAAVBJwACoJGAAVBIwACr9DxWKX7lFww/QAAAAAElFTkSuQmCC');
    case 3:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAACy0lEQVR4nO3VUc7cKgwGUMPsfw93m5UafB9CCMlMF2DpHCmC2A5/H4Z+7b8/I/PIGMeIOCLyb0YeEXlkxJExjlz7PGZvZOQx5nue3121kXN/1mKenSMjRtz9az7vuRwZmfc5MeJ8X9+MiPkeGauWq7b3znpkPtZrLh69bT7i1RtnPzPm5nHmmo9XLZ7zZ2WrXTOv+fZVe6/nvu21Fl+11q791mtX7zXfYs2vXrv22/lfvVetb/t97rWeT9tq7a739jq/bfUWrT/P6Fd9/tFrrvdY9evM3nv0dcbd670/zrrXPvvX7Pn9Pd+j799/+qz1VWstInJEjmN7Roy5Puprbq55RIwRmef8ec49s97Xus/Mft5zcd2VWTufXGec87l6677lmL/Ve/78jY4fd2Wu8a7tv/2tHq9ejsed2tf2vj/Xv2H9lq+5eHz7uBevu9S22nPueY/2ma9a+zG/rY/9j9o9d/2u37V87K/72ntE/Oj1ntvcda/yfNp2bt978y6u2vb84z0+93ufvegR7fOcj2u/1z/PM6JH9M/zjHX+to/PfJ/1+V8OANQiwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAl/Q9hfuWSNOOtpwAAAABJRU5ErkJggg==');
    case 4:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAABQ0lEQVR4nO3VMQrEQAwEQfn+/+aVP3CB7ayhKllYBBP2dc7Z3Z3dnZn5+z79e3tv06ZNmzZtfr3/DQAECRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQJKAAZAkYAAkCRgASQIGQNINKZD4sD4uX3cAAAAASUVORK5CYII=');
    case 5:
      return('data:image/png;base64,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');
    default:
      return('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAABICAYAAACX+KDqAAACy0lEQVR4nO3VUc7cKgwGUMPsfw93m5UafB9CCMlMF2DpHCmC2A5/H4Z+7b8/I/PIGMeIOCLyb0YeEXlkxJExjlz7PGZvZOQx5nue3121kXN/1mKenSMjRtz9az7vuRwZmfc5MeJ8X9+MiPkeGauWq7b3znpkPtZrLh69bT7i1RtnPzPm5nHmmo9XLZ7zZ2WrXTOv+fZVe6/nvu21Fl+11q791mtX7zXfYs2vXrv22/lfvVetb/t97rWeT9tq7a739jq/bfUWrT/P6Fd9/tFrrvdY9evM3nv0dcbd670/zrrXPvvX7Pn9Pd+j799/+qz1VWstInJEjmN7Roy5Puprbq55RIwRmef8ec49s97Xus/Mft5zcd2VWTufXGec87l6677lmL/Ve/78jY4fd2Wu8a7tv/2tHq9ejsed2tf2vj/Xv2H9lq+5eHz7uBevu9S22nPueY/2ma9a+zG/rY/9j9o9d/2u37V87K/72ntE/Oj1ntvcda/yfNp2bt978y6u2vb84z0+93ufvegR7fOcj2u/1z/PM6JH9M/zjHX+to/PfJ/1+V8OANQiwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAlCTAAShJgAJQkwAAoSYABUJIAA6AkAQZASQIMgJIEGAAl/Q9hfuWSNOOtpwAAAABJRU5ErkJggg==');
  }
}