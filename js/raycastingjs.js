class RayCastingJs {
    constructor(context, engine) {
        this.context = context;
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

    drawVirtualPixel(x, y, width, pixel) {
        this.context.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        this.context.fillRect(x, y, width, width);
    }
}
