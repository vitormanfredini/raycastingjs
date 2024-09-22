export class Vector3d {
    public x: number
    public y: number
    public z: number

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getIntersectionPointWithTriangle(vertices: Vector3d[], origin: Vector3d) {
        let kEpsilon = 0.00001;

        let v0 = vertices[0];
        let v1 = vertices[1];
        let v2 = vertices[2];

        let v0v1 = v1.subtract(v0);
        let v0v2 = v2.subtract(v0);
        let normalVector = v0v1.crossProduct(v0v2);

        // are ray and plane parallel?
        let normalVectorDotRayDirection = normalVector.dotProduct(this);
        if (Math.abs(normalVectorDotRayDirection) < kEpsilon) {
            return null;
        }

        let d = -normalVector.dotProduct(v0);
        var t = -(normalVector.dotProduct(origin) + d) / normalVectorDotRayDirection;

        // is triangle behind the ray?
        if (t < 0) {
            return null;
        }

        let intersectionPoint = origin.add(this.scale(t));

        // Step 2: inside-outside test
        let planeNormal; //vector perpendicular to triangle's plane

        // is it outside edge 0?
        let edge0 = v1.subtract(v0);
        let vp0 = intersectionPoint.subtract(v0);
        planeNormal = edge0.crossProduct(vp0);
        if (normalVector.dotProduct(planeNormal) < 0) {
            return null;
        }

        // is it outside edge 1?
        let edge1 = v2.subtract(v1);
        let vp1 = intersectionPoint.subtract(v1);
        planeNormal = edge1.crossProduct(vp1);
        if (normalVector.dotProduct(planeNormal) < 0) {
            return null;
        }

        // is it outside edge 2?
        let edge2 = v0.subtract(v2);
        let vp2 = intersectionPoint.subtract(v2);
        planeNormal = edge2.crossProduct(vp2);
        if (normalVector.dotProduct(planeNormal) < 0) {
            return null;
        }

        return intersectionPoint;
    }

    getAngleToOtherVector(other: Vector3d) {
        const dotProduct = this.dotProduct(other);
        return (dotProduct / this.getDistanceFromOrigin() / other.getDistanceFromOrigin()) * 90;
    }

    crossProduct(other: Vector3d) {
        return new Vector3d(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }

    dotProduct(other: Vector3d) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    getDistanceFromOrigin() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    getDistanceFromOtherVector(other: Vector3d) {
        return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2) + Math.pow(other.z - this.z, 2));
    }

    subtract(other: Vector3d) {
        return new Vector3d(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    add(other: Vector3d) {
        return new Vector3d(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    scale(scalar: number) {
        return new Vector3d(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    isAtSamePlaceAs(other: Vector3d) {
        const epsilon = 0.0001;
        const distance = this.getDistanceFromOtherVector(other);
        if (distance < epsilon) {
            return true;
        }
        return false;
    }

    getAngleToTriangle(triangle: Vector3d[]) {
        const A = triangle[1].subtract(triangle[0]);
        const B = triangle[2].subtract(triangle[0]);
        const normal = new Vector3d(A.y * B.z - A.z * B.y, A.z * B.x - A.x * B.z, A.x * B.y - A.y * B.x);
        return this.getAngleToOtherVector(normal);
    }
}
