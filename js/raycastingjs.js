class RayCastingJs {
    constructor(context, engine) {
        this.context = context;
        this.context.canvas.width = window.innerWidth;
        this.context.canvas.height = window.innerHeight;
        this.engine = engine;
    }

    update() {
        this.engine.update();
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
