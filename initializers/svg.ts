export async function fromSvg(svg: string, width: number, height: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  const b64 = btoa(svg);
  const svgUrl = `data:image/svg+xml;base64,${b64}`;
  const img = new Image();
  img.src = svgUrl;
  await new Promise((resolve) => {
    img.onload = () => resolve(img.height);
  });

  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  console.log(pixels);
  const colors = [];
  const positions = [];
  let j = 0;
  for (var i = 0; i < pixels.length; i += 4) {
    if (pixels[i] == 0) continue;

    const pIdx = i / 4;
    positions.push(
      ((pIdx % imageData.height) / imageData.width) * 2 - 1,
      (Math.floor(pIdx / imageData.width) / imageData.height) * 2 - 1,
      Math.random(), // put a random value in z for randomness between colors
      1
    );
    colors.push(1, 0, 0, 1);

    positions.push(
      ((pIdx % imageData.height) / imageData.width) * 2 - 1,
      (Math.floor(pIdx / imageData.width) / imageData.height) * 2 - 1,
      Math.random(),
      1
    );

    colors.push(0, 1, 0, 1);

    positions.push(
      ((pIdx % imageData.height) / imageData.width) * 2 - 1,
      (Math.floor(pIdx / imageData.width) / imageData.height) * 2 - 1,
      Math.random(),
      1
    );

    colors.push(0, 0, 1, 1);
  }

  const count = colors.length / 4
  const w = Math.ceil(Math.sqrt(count))
  console.log("W", w)
  const bufferSize = w * w * 4
  while (positions.length < bufferSize) {
      positions.push(0)
      colors.push(0)
  }
  console.log(colors.length)
  return { colors, positions, count};
}
