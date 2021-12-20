import {hsvToRgb} from "../utils/hsl2rgb"

function clamp(v, min, max) {
    return Math.max(Math.min(v, max), min)
}
export function colorFromPos(positions: Array<number>) {
    const arr = new Array(positions.length).fill(0)
    for (var i = 0; i < arr.length; i+=4) {
        const theta = Math.atan2(positions[i + 1], positions[i]) / (2 * Math.PI) + 0.5
        if (i < 500)
        console.log(theta)
        const rgb = hsvToRgb(theta, 0.5, 0.5)
        if (i < 500) console.log(rgb)
        arr[i] = rgb.r
        arr[i + 1] = rgb.g
        arr[i + 2] = rgb.b
        arr[i + 3] = 1
    }
    console.log(arr)
    return arr
}