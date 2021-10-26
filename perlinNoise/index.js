const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

const makePerlin = (w, h) => {
  const getPerlinTable = (w, h) => {
    const p = new Uint8Array(w * w * 4);
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        p[(i * w + j) * 4 + 0] = Math.random() * 255;
        p[(i * w + j) * 4 + 1] = Math.random() * 255;
        p[(i * w + j) * 4 + 2] = Math.random() * 255;
        p[(i * w + j) * 4 + 3] = 255;
      }
    }
    return p;
  };

  const perlinTable = getPerlinTable(w, h);

  const fade = (t) => {
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  /**
   *
   * @param {*} u [0,1)
   * @param {*} v [0,1)
   */
  const getUVPixel = (u, v) => {
    const x1 = u * w;
    const y1 = v * h;
    const x2 = ~~x1;
    const y2 = ~~y1;

    const result = new Uint8Array(4);
    [
      [x2, y2],
      [x2 + 1, y2],
      [x2, y2 + 1],
      [x2 + 1, y2 + 1],
    ].map(([x, y]) => {
      const i = (x * w + y) * 4;

      const v = [x1 - x, x2 - y];
      const p = [
        (perlinTable[i] || 255) / 255,
        (perlinTable[i + 2] || 255) / 255,
      ];
      const t = v[0] * p[0] + v[1] * p[1];
      result[0] += t * perlinTable[i];
      result[1] += t * perlinTable[i + 1];
      result[2] += t * perlinTable[i + 2];
    });
    result[3] = 255;
    return result;
  };

  return { getUVPixel };
};

const perlinOper = makePerlin(50, 50);

const w = 256;
const h = 256;
canvasEl.width = w;
canvasEl.height = h;

const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
for (let i = 0; i < w; i++) {
  for (let j = 0; j < h; j++) {
    const noise = perlinOper.getUVPixel(i / w, j / h);
    imageData.data[(i * w + j) * 4 + 0] = noise[0];
    imageData.data[(i * w + j) * 4 + 1] = noise[1];
    imageData.data[(i * w + j) * 4 + 2] = noise[2];
    imageData.data[(i * w + j) * 4 + 3] = noise[3];
  }
}
ctx.putImageData(imageData, 0, 0);
