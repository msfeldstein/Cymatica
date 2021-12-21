export function fromSvg(svg: string, width: number, height: number) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext('2d')
    document.body.appendChild(canvas)
    canvas.width = width
    canvas.height = height
    
}