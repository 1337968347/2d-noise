const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

const makePerlin = (w, h) => {
  const getPerlinTable = (w, h) => {
    const p = new Array(w * w);
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        p[i * w + j] = Math.random();
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
    const x2 = ~~x1;
    const y2 = ~~y1;
    const u1 = x1 - x2;
    const v1 = y1 - y2;

    const [g1, g2, g3, g4] = [
      [x2, y2],
      [x2 + 1, y2],
      [x2, y2 + 1],
      [x2 + 1, y2 + 1],
    ].map(([x, y]) => {
      const i = x * w + y;
      return perlinTable[i] || 0;
    });
    // https://pic4.zhimg.com/80/v2-a54749b9a5f536968344c88f9e09d95b_720w.jpg
    const b = lerp(g1, g2, u1);
    const a = lerp(g3, g4, u1);
    const p = lerp(b, a, v1);
    return p;
  };

  return { getUVPixel };
};

const perlinOper = makePerlin(20, 20);

const w = 512;
const h = 512;
canvasEl.width = w;
canvasEl.height = h;

const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
for (let i = 0; i < w; i++) {
  for (let j = 0; j < h; j++) {
    const p = perlinOper.getUVPixel(i / w, j / h);
    imageData.data[(i * w + j) * 4 + 0] = 0;
    imageData.data[(i * w + j) * 4 + 1] = 42;
    imageData.data[(i * w + j) * 4 + 2] = 0;
    imageData.data[(i * w + j) * 4 + 3] = p * 255;
  }
}
ctx.putImageData(imageData, 0, 0);
