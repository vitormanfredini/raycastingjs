import { getFontSizeToFitScreen } from '../utils'
import { Color, Object3d } from './Object3d'
import { Pixel } from './Pixel'
import { Vector3d } from './Vector3d'

export type EngineConfiguration = {
    multisampling: number
    optimization: boolean
    width: number
    height: number
    ascii: boolean
}

export type Intersection3d = {
    point: Vector3d
    distance: number
    objectIndex: number
    triangle: Vector3d[]
    triangleIndex: number
}

export type Light3d = {
    position: Vector3d
    intensity: number
}

export type LightIncidence = {
    angle: number
    intensity: number
}

export class RayCastingEngine {
    public ascii: boolean = false;
    public width: number = 1
    public height: number = 1
    private multisampling: number = 1;
    private optimization: boolean = false;
    private objects: Object3d[] = [];
    private lights: Light3d[] = [];
    private pixels: (Pixel | null)[] = []
    private pixelsLastFrame: (Pixel | null)[] = []
    private lastFrameMs: number
    private asciiFontSize: number = 1
    private lastWindowWidth: number = 1
    private lastWindowHeight: number = 1
    private povDistance: number = 1

    constructor() {
        this.povDistance = this.width / 3;
        this.lastFrameMs = Date.now();
    }

    loadConfig(config: EngineConfiguration){
        
        const configSizeChanged = this.width != config.width || this.height != config.height;
        const windowSizeChanged = window.innerWidth != this.lastWindowWidth || window.innerHeight != this.lastWindowHeight;

        if(configSizeChanged || windowSizeChanged){
            this.width = config.width;
            this.height = config.height;
            this.povDistance = this.width / 3;
            this.asciiFontSize = getFontSizeToFitScreen(this.width)
            const asciiDiv = document.getElementById('renderasciihere') as HTMLDivElement
            asciiDiv.style.fontSize = this.asciiFontSize+'px';
            asciiDiv.style.lineHeight = (this.asciiFontSize * 0.60) +'px';
            this.lastWindowWidth = window.innerWidth
            this.lastWindowHeight = window.innerHeight
            this.pixels = new Array(this.width * this.height).fill(null);
            this.pixelsLastFrame = new Array(this.width * this.height).fill(null);
        }

        this.multisampling = config.multisampling;
        this.optimization = config.optimization;
        this.ascii = config.ascii;
        
    }

    getEllapsedMsSinceLastFrame() {
        const currentMs = Date.now();
        const ellapsedMs = currentMs - this.lastFrameMs;
        this.lastFrameMs = currentMs;

        return ellapsedMs;
    }

    addObject(object: Object3d) {
        this.objects.push(object);
    }

    addLight(light: Light3d) {
        this.lights.push(light);
    }

    update(timeFactor: number) {
        this.savePixelsFromLastFrame();
        this.pixels.fill(null);

        for (let c = 0; c < this.objects.length; c++) {
            // animate the objects
            if (c == 0) {
                this.objects[c].rotation.y += 0.0023 * timeFactor;
            } else if (c == 1) {
                this.objects[c].rotation.x += 0.0041 * timeFactor;
                this.objects[c].rotation.z += 0.027 * timeFactor;
            } else {
                this.objects[c].rotation.z -= 0.0043 * timeFactor;
                this.objects[c].rotation.y += 0.0028 * timeFactor;
            }

            this.objects[c].update();
        }

        for (let y = 0; y < this.height; y+=2) {
            for (let x = y % 4 == 0 ? 0 : 1; x < this.width; x+=2) {
                let index = this.coordsToIndex(x, y);
                this.pixels[index] = this.calculatePixelWithMultisampling(x,y,this.multisampling);
            }
        }

        // interpolation method
        // 0: use 2 pixels from left and right
        // 1: use 2 pixels from up and down
        // 2: use 4 pixels from left, top, right and down
        const interpolationOption = 0;

        for (let y = 0; y < this.height; y+=1) {
            for (let x = 0; x < this.width; x+=1) {
                let index = this.coordsToIndex(x, y);

                if(this.pixels[index] !== null){
                    continue;
                }

                if(this.optimization){
                    this.pixels[index] = this.calculatePixelWithInterpolation(x, y, interpolationOption);
                }

                if(this.pixels[index] === null){
                    this.pixels[index] = this.calculatePixelWithMultisampling(x, y, this.multisampling);
                }

            }
        }

    }

    savePixelsFromLastFrame() {
        for (let c = 0; c < this.pixels.length; c++) {
            const pixel = this.pixels[c];
            if(pixel === null){
                break
            }
            this.pixelsLastFrame[c] = pixel.copy();
        }
    }

    coordsToIndex(x: number, y: number) {
        return y * this.width + x;
    }

    getPixel(x: number, y: number) {
        return this.pixels[this.coordsToIndex(x, y)];
    }

    getPixelLastFrame(x: number, y: number) {
        return this.pixelsLastFrame[this.coordsToIndex(x, y)];
    }

    calculatePixelWithInterpolation(x: number, y: number, interpolationOption: number): Pixel | null {

        let isOnTheBorder = (x == this.width-1) || (y == this.height-1) || x == 0 || y == 0;
        if(isOnTheBorder){
            return null;
        }

        const interpolationOptions = [0,1,2];
        if(!interpolationOptions.includes(interpolationOption)){
            console.log('Interpolation can only be calculated with options ' + interpolationOptions.join(', ') + 'samples. Using left and right as fallback.');
            interpolationOption = 0;
        }

        const pixelsCoordsInterpolateFrom = [];
        if(interpolationOption == 0 || interpolationOption == 2){
            pixelsCoordsInterpolateFrom.push([x+1,y]);
            pixelsCoordsInterpolateFrom.push([x-1,y]);
        }
        if(interpolationOption == 1 || interpolationOption == 2){
            pixelsCoordsInterpolateFrom.push([x,y+1]);
            pixelsCoordsInterpolateFrom.push([x,y-1]);
        }

        const interpolatedPixel = new Pixel(0, 0, 0);
        const indexesFirstObjectHit = [];
        const indexesFirstTriangleHit = [];
        for(let coords of pixelsCoordsInterpolateFrom){

            let index = this.coordsToIndex(coords[0], coords[1]);

            if(this.pixels[index] === null){
                return null;
            }

            if(!this.pixels[index].allSamplesHitSameObject){
                return null;
            }

            indexesFirstObjectHit.push(this.pixels[index].indexFirstObjectHit);
            indexesFirstTriangleHit.push(this.pixels[index].indexFirstTriangleHit);

            interpolatedPixel.r += this.pixels[index].r / pixelsCoordsInterpolateFrom.length;
            interpolatedPixel.g += this.pixels[index].g / pixelsCoordsInterpolateFrom.length;
            interpolatedPixel.b += this.pixels[index].b / pixelsCoordsInterpolateFrom.length;
        }

        const allPixelsSamplesHitSameObject = indexesFirstObjectHit.every( (val, i, arr) => (val === arr[0]) );
        const allPixelsSamplesHitSameTriangle = indexesFirstTriangleHit.every( (val, i, arr) => (val === arr[0]) );

        if(!allPixelsSamplesHitSameObject || !allPixelsSamplesHitSameTriangle){
            return null;
        }

        return interpolatedPixel;
    }

    calculatePixelWithMultisampling(x: number,y: number,samples: number): Pixel {

        let samplesAllowed = [1,2,4,8];
        if(!samplesAllowed.includes(samples)){
            console.log('Multisampling can only be calculated with ' + samplesAllowed.join(', ') + 'samples. Using no-multisampling as fallback.');
            samples = 1;
        }

        if(samples == 1){
            const newPixel = this._calculatePixel(x, y);
            newPixel.allSamplesHitSameObject = true;
            return newPixel;
        }

        let multisamplingOffsets: { x: number, y: number }[] = [
            { x:-0.25, y:-0.25 },
            { x: 0.25, y:0.25 },
        ];

        if(samples >= 4){
            multisamplingOffsets.push({ x:-0.25, y:0.25 });
            multisamplingOffsets.push({ x:0.25, y:-0.25 });
        }

        if(samples >= 8){
            multisamplingOffsets.push({ x:-0.5, y:0.5 });
            multisamplingOffsets.push({ x:0.5, y:-0.5 });
        }

        const newPixel = new Pixel(0, 0, 0);
        const indexesObjectsHit = [];
        const indexesTrianglesHit = [];
        for (let offset of multisamplingOffsets) {
            let sampledPixel = this._calculatePixel(x + offset.x, y + offset.y);
            newPixel.r += sampledPixel.r / multisamplingOffsets.length;
            newPixel.g += sampledPixel.g / multisamplingOffsets.length;
            newPixel.b += sampledPixel.b / multisamplingOffsets.length;
            indexesObjectsHit.push(sampledPixel.indexFirstObjectHit);
            indexesTrianglesHit.push(sampledPixel.indexFirstTriangleHit);
        }

        let allSamplesHitSameObject = indexesObjectsHit.every( (val, i, arr) => (val === arr[0]) );
        let allSamplesHitSameTriangle = indexesTrianglesHit.every( (val, i, arr) => (val === arr[0]) );
        newPixel.allSamplesHitSameObject = allSamplesHitSameObject && allSamplesHitSameTriangle;
        newPixel.indexFirstObjectHit = indexesObjectsHit[0];
        newPixel.indexFirstTriangleHit = indexesTrianglesHit[0];

        return newPixel;

    }

    _calculatePixel(x: number, y: number): Pixel {
        let pointToAim = new Vector3d(x - this.width / 2, y - this.height / 2, this.povDistance);
        let origin = new Vector3d(0, 0, 0);

        let intersections = this.getIntersectionsWithObjects(origin, pointToAim.subtract(origin));
        const closestIntersection = this.getClosestIntersection(intersections);
        if (closestIntersection === null) {
            return new Pixel(0, 0, 0);
        }
        const closestIntersectionPoint = closestIntersection.point.scale(1.0);
        const closestIntersectionTriangle = closestIntersection.triangle;

        let lightIncidences: LightIncidence[] = [];
        this.lights.forEach((light) => {
            let lightDirection = closestIntersectionPoint.subtract(light.position);
            let lightIntersections = this.getIntersectionsWithObjects(light.position, lightDirection);
            let lightClosestIntersection = this.getClosestIntersection(lightIntersections);
            if (lightClosestIntersection !== null) {
                if (lightClosestIntersection.point.isAtSamePlaceAs(closestIntersectionPoint)) {
                    let incidenceAngle = lightDirection.getAngleToTriangle(closestIntersectionTriangle);
                    lightIncidences.push({
                        angle: incidenceAngle,
                        intensity: light.intensity
                    });
                }
            }
        });

        let lightFactor = 1.0;
        lightIncidences.forEach((lightIncidence) => {
            let angle = lightIncidence.angle;
            angle = Math.abs(angle);
            if (angle > 90) {
                angle = 90 - (angle - 90);
            }
            lightFactor += (angle / 90) * lightIncidence.intensity;
        });

        const color: Color = this.objects[closestIntersection.objectIndex].color;

        const calculatedPixel = new Pixel(
            (color.r / (closestIntersection.distance / 50)) * lightFactor,
            (color.g / (closestIntersection.distance / 50)) * lightFactor,
            (color.b / (closestIntersection.distance / 50)) * lightFactor
        );

        calculatedPixel.indexFirstObjectHit = closestIntersection.objectIndex;
        calculatedPixel.indexFirstTriangleHit = closestIntersection.triangleIndex;

        return calculatedPixel;
    }

    getClosestIntersection(intersections: Intersection3d[]): Intersection3d | null {
        let minDistance = Infinity;
        let closestIntersection = null;

        intersections.forEach((intersection, intersectionIndex) => {
            if (intersection.distance < minDistance) {
                closestIntersection = intersection;
                minDistance = intersection.distance;
            }
        });

        return closestIntersection;
    }

    getIntersectionsWithObjects(originPoint: Vector3d, vector: Vector3d): Intersection3d[] {
        let intersections: Intersection3d[] = [];

        this.objects.forEach((object, objectIndex) => {
            object.triangles.forEach((triangle, triangleIndex) => {
                let intersectionPoint = vector.getIntersectionPointWithTriangle(triangle, originPoint);

                if (intersectionPoint !== null) {
                    intersections.push({
                        point: intersectionPoint,
                        distance: intersectionPoint.getDistanceFromOtherVector(originPoint),
                        objectIndex: objectIndex,
                        triangle: triangle,
                        triangleIndex: triangleIndex
                    });
                }
            });
        });

        return intersections;
    }
}
