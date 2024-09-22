import { Pixel } from "../Pixel";
import { IRenderer } from "./IRenderer";

export class DefaultRenderer implements IRenderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    enable(): void {
        this.canvas.style.display = 'block';
    }

    disable(): void {
        this.canvas.style.display = 'none';
    }

    render(pixels: Pixel[], virtualWidth: number): void {
        let virtualPixelWidth = Math.ceil(this.context.canvas.width / virtualWidth);
        let x = 0;
        let y = 0;
        for (let c = 0; c < pixels.length; c++) {
            this.context.fillStyle = `rgb(${pixels[c].r},${pixels[c].g},${pixels[c].b})`;
            this.context.fillRect(x * virtualPixelWidth, y * virtualPixelWidth, virtualPixelWidth, virtualPixelWidth);

            x += 1
            if(x >= virtualWidth){
                x = 0;
                y += 1;
            }
        }
    }

    onResize(virtualWidth: number): void {
        this.context.canvas.width = window.innerWidth;
        this.context.canvas.height = window.innerHeight;
    }

}
