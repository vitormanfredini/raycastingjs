class RayCastingJsEngine {

    constructor(horizontalResolution, screenRatio){
        this.width = horizontalResolution;
        this.height = Math.ceil(this.width * screenRatio);
        this.povDistance = this.width / 3;
        this.pixels = new Array(this.width * this.height).fill(null);
        this.objects = [];
        this.lights = []
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

    addLight(light) {
        this.lights.push(light);
    }
    
    update() {

        let ellapsedMs = this.getEllapsedMsSinceLastFrame();
        let timeFactor = this.getTimeFactor(ellapsedMs);

        for(let c = 0;c < this.objects.length; c++){

            // animate the objects
            if (c == 0){
                this.objects[c].rotation.y += 0.01 * timeFactor;
            }else if (c == 1){
                this.objects[c].rotation.x += 0.02 * timeFactor;
                this.objects[c].rotation.z += 0.03 * timeFactor;
            }else{
                this.objects[c].rotation.z -= 0.02 * timeFactor;
                this.objects[c].rotation.y += 0.015 * timeFactor;
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

        let intersections = this.getIntersectionsWithObjects(origin, pointToAim.subtract(origin));
        const closestIntersection = this.getClosestIntersection(intersections);
        if (closestIntersection === null){
            return new Pixel(0, 0, 0);
        }
        const closestIntersectionPoint = closestIntersection.point.scale(1.0);

        let countLightHits = 0;
        this.lights.forEach(light => {
            let lightIntersections = this.getIntersectionsWithObjects(light.position, closestIntersectionPoint.subtract(light.position));
            let lightClosestIntersection = this.getClosestIntersection(lightIntersections);
            if(lightClosestIntersection !== null){
                if(lightClosestIntersection.point.isAtSamePlaceAs(closestIntersectionPoint)){
                    // let distance = lightClosestIntersection.point.getDistanceFromOtherVector(light.position);
                    countLightHits += 1;
                }
            }
        })
        
        let lightFactor = 1.0 + (countLightHits * 0.5);

        const color = this.objects[closestIntersection.objectIndex].color;

        return new Pixel(
            (color[0] / (closestIntersection.distance / 50)) * lightFactor,
            (color[1] / (closestIntersection.distance / 50)) * lightFactor,
            (color[2] / (closestIntersection.distance / 50)) * lightFactor
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

        this.objects.forEach((object, objectIndex) => {

            object.triangles.forEach(triangle => {

                let intersectionPoint = vector3d.getIntersectionPointWithTriangle(triangle, origin);
                
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