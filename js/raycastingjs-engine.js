class RayCastingJsEngine {

    constructor(horizontalResolution, screenRatio){
        this.width = horizontalResolution;
        this.height = Math.ceil(this.width * screenRatio);
        this.povDistance = this.width / 3;
        this.pixels = new Array(this.width * this.height).fill(null);
        this.objects = [];
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

    getTimeFactor(ellapsedMs) {
        return ellapsedMs / 33;
    }

    addObject(object) {
        this.objects.push(object);
    }
    
    update() {

        let ellapsedMs = this.getEllapsedMsSinceLastFrame();
        let timeFactor = this.getTimeFactor(ellapsedMs);

        for(let c = 0;c < this.objects.length; c++){
            if (c == 0){
                this.objects[c].rotation.y += 0.01 * timeFactor;
            }
            if (c == 1){
                this.objects[c].rotation.x += 0.02 * timeFactor;
                this.objects[c].rotation.z += 0.03 * timeFactor;
            }
            this.objects[c].update();
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.pixels[this.coordsToIndex(x,y)] = this.calculatePixel(x,y);
            }
        }
    }

    coordsToIndex(x,y) {
        return (y * this.width) + x;
    }

    getPixel(x, y) {
        return this.pixels[this.coordsToIndex(x, y)];
    }

    calculatePixel(x,y) {
        let pointToAim = new Vector3d(
            x - (this.width / 2),
            y - (this.height / 2),
            this.povDistance,
        );
        let origin = new Vector3d(0,0,0);
        
        const intersections = this.getIntersectionsWithObjects(origin, pointToAim);
        const closestIntersection = this.getClosestIntersection(intersections);
        
        if (closestIntersection == null){
            return new Pixel(0, 0, 0);
        }

        const color = this.objects[closestIntersection.objectIndex].color;

        return new Pixel(
            color[0] / (closestIntersection.distance / 50),
            color[1] / (closestIntersection.distance / 50),
            color[2] / (closestIntersection.distance / 50)
        );
        
    }

    getClosestIntersection(intersections){
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
        let distanceOriginToVector = vector3d.getDistanceFromOtherVector(origin);

        this.objects.forEach((object, objectIndex) => {

            object.triangles.forEach(triangle => {

                let intersectionPoint =  vector3d.getIntersectionPointWithTriangle(
                    origin,
                    triangle,
                    distanceOriginToVector
                );
                
                if(intersectionPoint != null){
                    intersections.push(new Intersection3d(
                        intersectionPoint,
                        intersectionPoint.getDistanceFromOtherVector(origin),
                        objectIndex
                    ));
                }

            });

        })

        return intersections;
    }

}