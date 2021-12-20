import noise from '../utils/noise'

// each data point contains [r, theta, rand, 1]
export function initEye(radius: number) {
    const tendrils = 164
  const arr = Array(radius * radius * 4).fill(0);
  for (var i = 0; i < radius * radius * 4; i += 4) {
      const row = Math.floor(Math.random() * tendrils)
      const theta = Math.PI * 2 / tendrils * row
      const tendrilExtend = noise.get(row * 20, 0.5) * 0.1
      const r = Math.random() * (0.7 + tendrilExtend) + 0.3

    arr[i] = r
    arr[i + 1] = theta;
    arr[i + 2] = Math.random();
    arr[i + 3] = 1 // w needs to not be 0
  }
  return arr;
}
