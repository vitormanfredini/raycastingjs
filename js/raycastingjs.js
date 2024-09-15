class RayCastingJs {
    constructor(context, asciiElement, engine) {
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
        // console.log(deltaTime);
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

    drawVirtualPixels(){
        let virtualPixelWidth = this.context.canvas.width / this.engine.width;
        for (let y = 0; y < this.engine.height; y++) {
            for (let x = 0; x < this.engine.width; x++) {
                let pixel = this.engine.getPixel(x, y);
                let pixelLastFrame = this.engine.getPixelLastFrame(x, y);
                if (pixel.isEqual(pixelLastFrame)) {
                    continue;
                }
                this.drawVirtualPixel(Math.floor(x * virtualPixelWidth), Math.floor(y * virtualPixelWidth), Math.ceil(virtualPixelWidth), pixel);
            }
        }
    }

    drawAscii(){
        let asciiString = '';
        for (let y = 0; y < this.engine.height; y++) {
            for (let x = 0; x < this.engine.width; x++) {
                const pixel = this.engine.getPixel(x, y);
                const luminance = pixel.calculateLuminance();
                asciiString += this.luminanceToAsciiChar(luminance);
            }
            asciiString += "\n";
        }
        this.asciiElement.innerText = asciiString;
    }

    luminanceToAsciiChar(luminance){
        const asciiChardsDarkerToLighter = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^'`. ";
        const numChars = asciiChardsDarkerToLighter.length;
        let index = numChars * (luminance / 100);
        if (index > numChars - 1){
            index = numChars - 1;
        }
        return asciiChardsDarkerToLighter.charAt(index);
    }

    drawVirtualPixel(x, y, width, pixel) {
        this.context.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        this.context.fillRect(x, y, width, width);
    }
}
