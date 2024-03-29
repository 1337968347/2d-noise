const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

const normalise = (v) => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  const normalV = [v[0] / length, v[1] / length];

  return normalV;
};

const dot = (v1, v2) => {
  return v1[0] * v2[0] + v1[1] * v2[1];
};

const p = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
  75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
  149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
  27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
  92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
  209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
  147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
  28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 180,
];

const grad3 = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
];

const fade = (t) => {
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const lerp = (u, v, a) => {
  return u * (1 - a) + v * a;
};

const makePerlin = (seed) => {
  const perm = new Array(512);
  const gradP = new Array(512);

  const init = () => {
    if (seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (let i = 0; i < 256; i++) {
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed >> 8) & 255);
      }
      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  init();

  /**
   *
   * @param {*} u [0,1)
   * @param {*} v [0,1)
   */
  const getUVPixel = (u, v) => {
    // 当前晶格左上角的坐标
    const xInt = ~~u;
    const yInt = ~~v;
    // 小数部分
    let u1 = u - xInt;
    let v1 = v - yInt;

    const g00 = dot(gradP[xInt + perm[yInt]], [u1, v1]);

    const g01 = dot(gradP[xInt + perm[yInt + 1]], [u1, v1 - 1]);

    const g10 = dot(gradP[xInt + 1 + perm[yInt]], [u1 - 1, v1]);

    const g11 = dot(gradP[xInt + 1 + perm[yInt + 1]], [u1 - 1, v1 - 1]);

    const u2 = fade(u1);
    const v2 = fade(v1);

    return lerp(lerp(g00, g10, u2), lerp(g01, g11, u2), v2);
  };

  return { getUVPixel };
};

const perlinOper = makePerlin(Math.random());

const w = 500;
const h = 500;
canvasEl.width = w;
canvasEl.height = h;

const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
for (let i = 0; i < w; i++) {
  for (let j = 0; j < h; j++) {
    const p = perlinOper.getUVPixel(i / 50, j / 50);
    imageData.data[(i * w + j) * 4 + 0] = 0;
    imageData.data[(i * w + j) * 4 + 1] = 0;
    imageData.data[(i * w + j) * 4 + 2] = 0;
    imageData.data[(i * w + j) * 4 + 3] = (1-p) * 205;
  }
}
ctx.putImageData(imageData, 0, 0);
