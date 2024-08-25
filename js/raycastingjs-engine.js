class RayCastingJsEngine {
    constructor(horizontalResolution, screenRatio) {
        this.width = horizontalResolution;
        this.height = Math.ceil(this.width * screenRatio);
        this.povDistance = this.width / 3;
        this.pixels = new Array(this.width * this.height).fill(null);
        this.pixelsCalculated = new Array(this.width * this.height).fill(false);
        this.pixelsLastFrame = new Array(this.width * this.height).fill(null);
        this.objects = [];
        this.lights = [];
        this.lastFrameMs = null;
    }

    getEllapsedMsSinceLastFrame() {
        if (this.lastFrameMs === null) {
            this.lastFrameMs = Date.now();
            return 0;
        }
        const currentMs = Date.now();
        const ellapsedMs = currentMs - this.lastFrameMs;
        this.lastFrameMs = currentMs;

        return ellapsedMs;
    }

    addObject(object) {
        this.objects.push(object);
    }

    addLight(light) {
        this.lights.push(light);
    }

    update(timeFactor) {
        this.savePixels();
        
        this.pixelsCalculated.fill(false);

        const multiSampling = 4;

        for (let c = 0; c < this.objects.length; c++) {
            // animate the objects
            if (c == 0) {
                this.objects[c].rotation.y += 0.01 * timeFactor;
            } else if (c == 1) {
                this.objects[c].rotation.x += 0.02 * timeFactor;
                this.objects[c].rotation.z += 0.03 * timeFactor;
            } else {
                this.objects[c].rotation.z -= 0.02 * timeFactor;
                this.objects[c].rotation.y += 0.015 * timeFactor;
            }

            this.objects[c].update();
        }

        for (let y = 0; y < this.height; y+=2) {
            for (let x = y % 4 == 0 ? 0 : 1; x < this.width; x+=2) {
                let index = this.coordsToIndex(x, y);
                this.pixels[index] = this.calculatePixelWithMultisampling(x,y,multiSampling);
                this.pixelsCalculated[index] = true;
            }
        }

        // interpolation method
        // 0: use 2 pixels from left and right
        // 1: use 2 pixels from up and down
        // 2: use 4 pixels from left, top, right and down
        const interpolationOption = 2;

        for (let y = 0; y < this.height; y+=1) {
            for (let x = 0; x < this.width; x+=1) {
                let index = this.coordsToIndex(x, y);

                if(this.pixelsCalculated[index]){
                    continue;
                }

                this.pixels[index] = this.calculatePixelWithInterpolation(x,y,interpolationOption);

                if(this.pixels[index] == null){
                    this.pixels[index] = this.calculatePixelWithMultisampling(x,y,multiSampling);
                }

                this.pixelsCalculated[index] = true;

            }
        }

    }

    savePixels() {
        if (this.pixels[0] === null) {
            return;
        }
        for (let c = 0; c < this.pixels.length; c++) {
            this.pixelsLastFrame[c] = this.pixels[c].copy();
        }
    }

    coordsToIndex(x, y) {
        return y * this.width + x;
    }

    getPixel(x, y) {
        return this.pixels[this.coordsToIndex(x, y)];
    }

    getPixelLastFrame(x, y) {
        return this.pixelsLastFrame[this.coordsToIndex(x, y)];
    }

    calculatePixelWithInterpolation(x,y,interpolationOption){

        let isOnTheBorder = (x == this.width-1) || (y == this.height-1) || x == 0 || y == 0;
        if(isOnTheBorder){
            return null;
        }

        const interpolationOptions = [0,1,2];
        if(!interpolationOptions.includes(interpolationOption)){
            console.log('Interpolation can only be calculated with options ' + ', '.join(interpolationOptions) + 'samples. Using left and right as fallback.');
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

        let interpolatedPixel = new Pixel(0, 0, 0);
        const indexesFirstObjectHit = [];
        const indexesFirstTriangleHit = [];
        for(let coords of pixelsCoordsInterpolateFrom){

            let index = this.coordsToIndex(coords[0], coords[1]);

            if(!this.pixelsCalculated[index]){
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

    calculatePixelWithMultisampling(x,y,samples){

        let samplesAllowed = [1,2,4,8];
        if(!samplesAllowed.includes(samples)){
            console.log('Multisampling can only be calculated with ' + ', '.join(samplesAllowed) + 'samples. Using no-multisampling as fallback.');
            samples = 1;
            return 
        }

        if(samples == 1){
            const newPixel = this._calculatePixel(x, y);
            newPixel.allSamplesHitSameObject = true;
            return newPixel;
        }

        let multisamplingOffsets = [
            [-0.25, -0.25],
            [0.25, 0.25],
        ];

        if(samples >= 4){
            multisamplingOffsets.push([-0.25, 0.25]);
            multisamplingOffsets.push([0.25, -0.25]);
        }

        if(samples >= 8){
            multisamplingOffsets.push([-0.5, 0.5]);
            multisamplingOffsets.push([0.5, -0.5]);
        }

        let newPixel = new Pixel(0, 0, 0);
        const indexesObjectsHit = [];
        const indexesTrianglesHit = [];
        for (let offset of multisamplingOffsets) {
            let sampledPixel = this._calculatePixel(x + offset[0], y + offset[1]);
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

    _calculatePixel(x, y) {
        let pointToAim = new Vector3d(x - this.width / 2, y - this.height / 2, this.povDistance);
        let origin = new Vector3d(0, 0, 0);

        let intersections = this.getIntersectionsWithObjects(origin, pointToAim.subtract(origin));
        const closestIntersection = this.getClosestIntersection(intersections);
        if (closestIntersection === null) {
            return new Pixel(0, 0, 0);
        }
        const closestIntersectionPoint = closestIntersection.point.scale(1.0);
        const closestIntersectionTriangle = closestIntersection.triangle;

        let lightIncidences = [];
        this.lights.forEach((light) => {
            let lightDirection = closestIntersectionPoint.subtract(light.position);
            let lightIntersections = this.getIntersectionsWithObjects(light.position, lightDirection);
            let lightClosestIntersection = this.getClosestIntersection(lightIntersections);
            if (lightClosestIntersection !== null) {
                if (lightClosestIntersection.point.isAtSamePlaceAs(closestIntersectionPoint)) {
                    let incidenceAngle = lightDirection.getAngleToTriangle(closestIntersectionTriangle);
                    lightIncidences.push(new LightIncidence(incidenceAngle, light.intensity));
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

        const color = this.objects[closestIntersection.objectIndex].color;

        const calculatedPixel = new Pixel(
            (color[0] / (closestIntersection.distance / 50)) * lightFactor,
            (color[1] / (closestIntersection.distance / 50)) * lightFactor,
            (color[2] / (closestIntersection.distance / 50)) * lightFactor
        );

        calculatedPixel.indexFirstObjectHit = closestIntersection.objectIndex;
        calculatedPixel.indexFirstTriangleHit = closestIntersection.triangleIndex;

        return calculatedPixel;
    }

    getClosestIntersection(intersections) {
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

    getIntersectionsWithObjects(origin, vector3d) {
        let intersections = [];

        this.objects.forEach((object, objectIndex) => {
            object.triangles.forEach((triangle, triangleIndex) => {
                let intersectionPoint = vector3d.getIntersectionPointWithTriangle(triangle, origin);

                if (intersectionPoint != null) {
                    intersections.push(new Intersection3d(intersectionPoint, intersectionPoint.getDistanceFromOtherVector(origin), objectIndex, triangle, triangleIndex));
                }
            });
        });

        return intersections;
    }
}
