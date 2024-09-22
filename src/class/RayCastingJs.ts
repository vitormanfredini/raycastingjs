import { Pixel } from "./Pixel";
import { RayCastingEngine } from "./RayCastingEngine";

export class RayCastingJs {
    private context: CanvasRenderingContext2D;
    private asciiElement: HTMLDivElement;
    public engine: RayCastingEngine;
    private lastFrameMilliseconds: number;
    private deltaTimeHistory: number[] = [];

    constructor(context: CanvasRenderingContext2D, asciiElement: HTMLDivElement, engine: RayCastingEngine) {
        this.context = context;
        this.asciiElement = asciiElement;
        this.engine = engine;
        this.lastFrameMilliseconds = Date.now();
    }

    update() {
        this.context.canvas.width  = window.innerWidth;
        this.context.canvas.height = window.innerHeight;
        const timeStartedRendering = Date.now();
        const deltaTime = timeStartedRendering - this.lastFrameMilliseconds;
        this.addDeltaTimeToHistory(deltaTime)
        const oneFrameInMilliseconds = 1000 / 60;
        this.engine.update(deltaTime / oneFrameInMilliseconds);
        this.lastFrameMilliseconds = timeStartedRendering;
    }

    draw() {
        if(this.engine.ascii){
            this.drawAscii();
            return;
        }

        this.drawVirtualPixels();
    }

    addDeltaTimeToHistory(deltaTime: number){
        if(this.deltaTimeHistory.length >= 3){
            this.deltaTimeHistory.shift();
        }
        this.deltaTimeHistory.push(deltaTime);
    }

    getFps(): number {
        const sum = this.deltaTimeHistory.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / this.deltaTimeHistory.length;
        return Math.round(1000 / average);
    }

    drawVirtualPixels(){
        let virtualPixelWidth = this.context.canvas.width / this.engine.width;
        for (let y = 0; y < this.engine.height; y++) {
            for (let x = 0; x < this.engine.width; x++) {
                const pixel = this.engine.getPixel(x, y);
                this.drawVirtualPixel(Math.floor(x * virtualPixelWidth), Math.floor(y * virtualPixelWidth), Math.ceil(virtualPixelWidth), (pixel as Pixel));
            }
        }
    }

    drawAscii(){
        let asciiString = '';
        for (let y = 0; y < this.engine.height; y++) {
            for (let x = 0; x < this.engine.width; x++) {
                const pixel = this.engine.getPixel(x, y);
                const luminance = (pixel as Pixel).calculateLuminance();
                asciiString += this.luminanceToAsciiChar(luminance / 255);
            }
            asciiString += "\n";
        }
        this.asciiElement.innerText = asciiString;
    }

    luminanceToAsciiChar(normalizedLuminance: number){
        // let asciiChardsDarkerToLighter = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^'`. ";
        let asciiChardsDarkerToLighter = " `,-_~:;!+ilI?][}{1)(\\/tfjrxnuvczmwqpdbkhao#MW&8%B@$"
        // asciiChardsDarkerToLighter = asciiChardsDarkerToLighter.split("").reverse().join("");
        const numChars = asciiChardsDarkerToLighter.length;
        const luminanceBoost = 1.2
        let index = numChars * normalizedLuminance * luminanceBoost;
        if (index > numChars - 1){
            index = numChars - 1;
        }
        return asciiChardsDarkerToLighter.charAt(index);
    }

    drawVirtualPixel(x: number, y: number, width: number, pixel: Pixel) {
        this.context.fillStyle = `rgb(${pixel.r},${pixel.g},${pixel.b})`;
        this.context.fillRect(x, y, width, width);
    }
}
