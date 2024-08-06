class Vector3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getIntersectionPointWithTriangle(vertices, origin) {
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

    getAngleToOtherVector(other) {
        const dotProduct = this.dotProduct(other);
        return (dotProduct / this.getDistanceFromOrigin() / other.getDistanceFromOrigin()) * 90;
    }

    crossProduct(vector) {
        return new Vector3d(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x);
    }

    dotProduct(vector3d) {
        return this.x * vector3d.x + this.y * vector3d.y + this.z * vector3d.z;
    }

    getDistanceFromOrigin() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    getDistanceFromOtherVector(vector) {
        return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2) + Math.pow(vector.z - this.z, 2));
    }

    subtract(vector) {
        return new Vector3d(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    add(vector) {
        return new Vector3d(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    scale(scalar) {
        return new Vector3d(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    isAtSamePlaceAs(vector) {
        const epsilon = 0.0001;
        const distance = this.getDistanceFromOtherVector(vector);
        if (distance < epsilon) {
            return true;
        }
        return false;
    }

    getAngleToTriangle(triangle) {
        const A = triangle[1].subtract(triangle[0]);
        const B = triangle[2].subtract(triangle[0]);
        const normal = new Vector3d(A.y * B.z - A.z * B.y, A.z * B.x - A.x * B.z, A.x * B.y - A.y * B.x);
        return this.getAngleToOtherVector(normal);
    }
}
