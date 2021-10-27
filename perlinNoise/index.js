const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

const normalise = (v) => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  const normalV = [v[0] / length, v[1] / length];

  return normalV;
};

const dot = (v1, v2) => {
  return v1[0] * v2[0] + v1[1] + v2[1];
};

const makePerlin = (w, h) => {
  const getPerlinTable = (w, h) => {
    const p = new Array(w * w * 2);
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        const v = normalise([Math.random(), Math.random()]);
        p[(i * w + j) * 2] = v[0];
        p[(i * w + j) * 2 + 1] = v[1];
      }
    }
    return p;
  };

  const perlinTable = getPerlinTable(w, h);

  const fade = (t) => {
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  const lerp = (u, v, a) => {
    return fade(u * (1 - a) + v * a);
  };

  /**
   *
   * @param {*} u [0,1)
   * @param {*} v [0,1)
   */
  const getUVPixel = (u, v) => {
    const x1 = u * w;
    const y1 = v * h;
    // 当前晶格左上角的坐标
    const xInt = ~~x1;
    const yInt = ~~y1;
    // 小数部分
    const u1 = x1 - xInt;
    const v1 = y1 - yInt;

    const g00 = [
      perlinTable[(xInt * w + yInt) * 2] || 0,
      perlinTable[(xInt * w + yInt) * 2 + 1] || 0,
    ];

    const g10 = [
      perlinTable[((xInt + 1) * w + yInt) * 2] || 0,
      perlinTable[((xInt + 1) * w + yInt) * 2 + 1] || 0,
    ];

    const g01 = [
      perlinTable[(xInt * w + yInt + 1) * 2] || 0,
      perlinTable[(xInt * w + yInt + 1) * 2 + 1] || 0,
    ];

    const g11 = [
      perlinTable[((xInt + 1) * w + yInt + 1) * 2] || 0,
      perlinTable[((xInt + 1) * w + yInt + 1) * 2 + 1] || 0,
    ];

    const v00 = dot(g00, [u1, v1]);
    const v10 = dot(g10, [u1 - 1.0, v1]);
    const v01 = dot(g01, [u1, v1 - 1.0]);
    const v11 = dot(g11, [u1 - 1.0, v1 - 1.0]);

    console.log(v00, v10, v01, v11);
    return 0;
  };

  return { getUVPixel };
};

const perlinOper = makePerlin(30, 30);

const w = 64;
const h = 64;
canvasEl.width = w;
canvasEl.height = h;

const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
for (let i = 0; i < w; i++) {
  for (let j = 0; j < h; j++) {
    const p = perlinOper.getUVPixel(i / w, j / h);
    imageData.data[(i * w + j) * 4 + 0] = 0;
    imageData.data[(i * w + j) * 4 + 1] = 0;
    imageData.data[(i * w + j) * 4 + 2] = 42;
    imageData.data[(i * w + j) * 4 + 3] = p * 255;
  }
}
ctx.putImageData(imageData, 0, 0);
