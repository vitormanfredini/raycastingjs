class RayCastingJs {
    
    constructor(context, engine) {
        this.context = context;
        this.engine = engine;
    }

    update() {
        this.context.canvas.width  = window.innerWidth;
        this.context.canvas.height = window.innerHeight;
        
        this.engine.update();
    }

    draw() {

        let virtualPixelWidth = this.context.canvas.width / this.engine.width;
        for (let y = 0; y < this.engine.height; y++) {
            for (let x = 0; x < this.engine.width; x++) {
                let pixel = this.engine.getPixel(x,y);
                this.drawVirtualPixel(x*virtualPixelWidth, y*virtualPixelWidth, virtualPixelWidth, pixel);
            }
        }

    }

    drawVirtualPixel(x, y, width, pixel) {
        this.context.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        this.context.fillRect(
            Math.floor(x),
            Math.floor(y),
            Math.ceil(width),
            Math.ceil(width)
        );
    }

}
