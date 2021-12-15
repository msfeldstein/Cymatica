const RADIUS = 512;

export function random() {
    return Array(RADIUS * RADIUS * 4)
    .fill(0)
    .map(() => Math.random() * 2 - 1);
}

export function randomDisc(radius: number, randomness: number = 0) {
    const arr = new Array(radius * radius * 4)
    for (var i = 0; i < arr.length; i += 4) {
        const theta = Math.random() * 2 * Math.PI;
        const r = 1 + Math.random() * randomness;
        arr[i] = r * Math.cos(theta)
        arr[i + 1] = r * Math.sin(theta)
        arr[i + 2] = 0
        arr[i + 3] = 1
    }
    return arr
}