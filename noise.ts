import { vec2 } from 'gl-matrix';

const fade1 = (t) => {
  return t * t * (-2 * t + 3);
};

const fade2 = (t) => {
  return t * t * t * (t * (t * 6 - 15) + 10);
};

// const clamp = (min, max, value) => {
//   if (value < min) return min;
//   if (value > max) return max;
//   return value;
// };

// const smoothStep = (min, max, value) => {
//   const v = clamp(min, max, (value - min) / (max - min));
//   return fade1(v);
// };

const lerp = (u, v, a) => {
  return u * (1 - a) + v * a;
};

const getValue = (table, y, x) => {
  return table[y * 16 + x];
};

// 白噪音
const makeValueNoise = () => {
  // 256  晶格表
  const table = new Uint8Array([
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180
  ]);

  const getNoiseByUV = (u, v) => {
    const x = u % 16;
    const y = v % 16;
    let ax = x - (x | 0);
    let ay = y - (y | 0);

    // https://zhuanlan.zhihu.com/p/201012251
    ax = fade1(ax);
    ay = fade1(ay);

    const p00 = getValue(table, y, x);
    const p01 = getValue(table, y + 1, x);
    const p10 = getValue(table, y, x + 1);
    const p11 = getValue(table, y + 1, x + 1);

    const v1 = lerp(p00, p10, ay);
    const v2 = lerp(p01, p11, ay);
    const p = lerp(v1, v2, ax);
    return p;
  };

  return getNoiseByUV;
};

// perlin 噪音
const makePerlinNoise = () => {
  const tables = new Array(16 * 16);

  for (let i = 0; i < 16 * 16; i++) {
    tables[i] = vec2.clone([Math.random(), Math.random()]);
  }

  const getNoiseByUV = (u, v) => {
    u = u % 256;
    v = v % 256;
    const intU = u | 0;
    const intV = v | 0;
    let u1 = u - intU;
    let v1 = v - intV;

    const v00 = vec2.clone([u1, v1]);
    const v01 = vec2.clone([u1, 1 - v1]);
    const v10 = vec2.clone([u1 - 1, v1]);
    const v11 = vec2.clone([u1 - 1, v1 - 1]);

    const g00 = vec2.dot(getValue(tables, intV, intU), v00);
    const g01 = vec2.dot(getValue(tables, intV + 1, intU), v01);
    const g10 = vec2.dot(getValue(tables, intV, intU + 1), v10);
    const g11 = vec2.dot(getValue(tables, intV + 1, intU + 1), v11);
    u1 = fade1(u1);
    v1 = fade1(v1);

    return lerp(lerp(g00, g10, u1), lerp(g01, g11, u1), v1);
  };

  return getNoiseByUV;
};

// 细胞噪声
const makeWorleyNoise = () => {
  const table = new Array(16 * 16);
  for (let i = 0; i < 16 * 16; i++) {
    table[i] = vec2.clone([Math.random(), Math.random()]);
  }
  
};
