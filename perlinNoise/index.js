const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

const w = 512;
const h = 512;

canvasEl.width = w;
canvasEl.height = h;

const getPerlinTable = () => {
  const p = new Uint8Array(400);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      p[(i * 10 + j) * 4 + 0] = Math.random() * 255;
      p[(i * 10 + j) * 4 + 1] = Math.random() * 255;
      p[(i * 10 + j) * 4 + 2] = Math.random() * 255;
      p[(i * 10 + j) * 4 + 3] = 255;
    }
  }
  return p;
};

const perlinTable = getPerlinTable();

const perlinNoise = (uv) => {
  const x = ~~uv[0] % 10;
  const y = ~~uv[1] % 10;
  const i = (x * 10 + y) * 4;
  return new Uint8Array([
    perlinTable[i],
    perlinTable[i + 1],
    perlinTable[i + 2],
    perlinTable[i + 3],
  ]);
};

const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
for (let i = 0; i < w; i++) {
  for (let j = 0; j < h; j++) {
    const noise = perlinNoise([i / 10, j / 10]);
    imageData.data[(i * w + j) * 4 + 0] = noise[0];
    imageData.data[(i * w + j) * 4 + 1] = noise[1];
    imageData.data[(i * w + j) * 4 + 2] = noise[2];
    imageData.data[(i * w + j) * 4 + 3] = noise[3];
  }
}
ctx.putImageData(imageData, 0, 0);
