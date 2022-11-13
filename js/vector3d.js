class Vector3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getIntersectionPointWithTriangle(orig, vertices, returnBoolean = false) {

        let kEpsilon = 0.00001;

        let v0 = vertices[0];
        let v1 = vertices[1];
        let v2 = vertices[2];
        
        // compute plane's normal
        let v0v1 = v1.subtract(v0); 
        let v0v2 = v2.subtract(v0); 
        // no need to normalize
        let N = v0v1.crossProduct(v0v2);  //N 
     
        // Step 1: finding P
     
        // check if ray and plane are parallel.
        let NdotRayDirection = N.dotProduct(this); 
        if (Math.abs(NdotRayDirection) < kEpsilon) {
            return null;  
        }
     
        let d = -N.dotProduct(v0); 
     
        var t = -(N.dotProduct(orig) + d) / NdotRayDirection; 
     
        // check if the triangle is in behind the ray
        if (t < 0){
            return null;
        }
     
        // compute the intersection point using equation 1
        let P = orig.add(this.scale(t));
     
        // Step 2: inside-outside test
        let C;  //vector perpendicular to triangle's plane 
     
        // check if it's inside or outside edge 0
        let edge0 = v1.subtract(v0); 
        let vp0 = P.subtract(v0); 
        C = edge0.crossProduct(vp0); 
        if (N.dotProduct(C) < 0) {
            return null;
        }
     
        // check if it's inside or outside edge 1
        let edge1 = v2.subtract(v1); 
        let vp1 = P.subtract(v1); 
        C = edge1.crossProduct(vp1); 
        if (N.dotProduct(C) < 0){
            return null;
        }
     
        // check if it's inside or outside edge 2
        let edge2 = v0.subtract(v2); 
        let vp2 = P.subtract(v2); 
        C = edge2.crossProduct(vp2); 
        if (N.dotProduct(C) < 0){
            return null;
        }

        return P;
    } 

    crossProduct(vector) {
        return new Vector3d(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
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
}