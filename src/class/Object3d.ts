import { Vector3d } from './Vector3d'

export type Color = {
    r: number
    g: number
    b: number
}

export class Object3d {
    public triangles: Vector3d[][]
    public position: Vector3d
    public rotation: Vector3d
    public color: Color
    private trianglesOriginal: Vector3d[][]

    constructor(triangles: Vector3d[][], position: Vector3d, rotation: Vector3d, color: Color) {
        this.trianglesOriginal = triangles;
        this.triangles = this.copyTriangles(triangles);
        this.position = position;
        this.rotation = rotation;
        this.color = color;
    }

    copyTriangles(trianglesToCopy: Vector3d[][]){
        let triangles = []
        for(let t = 0; t < trianglesToCopy.length; t++){
            let vertices = []
            for(let v = 0; v < trianglesToCopy[t].length; v++){
                vertices.push(new Vector3d(
                    trianglesToCopy[t][v].x,
                    trianglesToCopy[t][v].y,
                    trianglesToCopy[t][v].z
                ))
            }
            triangles.push(vertices);
        }
        return triangles;
    }

    update() {
        this.triangles = this.copyTriangles(this.trianglesOriginal);
        this.rotate();
        this.translate();
    }

    rotate() {

        let pitch = this.rotation.y;
        let roll = this.rotation.x;
        let yaw = this.rotation.z;

        var cosa = Math.cos(yaw);
        var sina = Math.sin(yaw);
    
        var cosb = Math.cos(pitch);
        var sinb = Math.sin(pitch);
    
        var cosc = Math.cos(roll);
        var sinc = Math.sin(roll);
    
        var Axx = cosa*cosb;
        var Axy = cosa*sinb*sinc - sina*cosc;
        var Axz = cosa*sinb*cosc + sina*sinc;
    
        var Ayx = sina*cosb;
        var Ayy = sina*sinb*sinc + cosa*cosc;
        var Ayz = sina*sinb*cosc - cosa*sinc;
    
        var Azx = -sinb;
        var Azy = cosb*sinc;
        var Azz = cosb*cosc;
    

        for(let t = 0; t < this.triangles.length; t++){
            for(let v = 0; v < this.triangles[t].length; v++){
                
                var px = this.triangles[t][v].x;
                var py = this.triangles[t][v].y;
                var pz = this.triangles[t][v].z;

                this.triangles[t][v].x = Axx*px + Axy*py + Axz*pz;
                this.triangles[t][v].y = Ayx*px + Ayy*py + Ayz*pz;
                this.triangles[t][v].z = Azx*px + Azy*py + Azz*pz;

            }
        }
    }
    
    translate() {
        for(let t = 0; t < this.triangles.length; t++){
            for(let v = 0; v < this.triangles[t].length; v++){
                this.triangles[t][v] = this.translate3dPoint(this.triangles[t][v], this.position);
            }
        }
    }

    translate3dPoint(point3d: Vector3d, translation3d: Vector3d){
        point3d.x += translation3d.x;
        point3d.y += translation3d.y;
        point3d.z += translation3d.z;
        return point3d;
    }
    
}
    
