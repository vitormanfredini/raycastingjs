class Object3dGenerator {

    static generatePyramid(scale) {

        const triangles = [];
        triangles.push([
            new Vector3d(-1*scale, 1*scale,-1*scale),
            new Vector3d( 1*scale, 1*scale,-1*scale),
            new Vector3d( 0*scale,-1*scale, 0*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale, 1*scale,-1*scale),
            new Vector3d(-1*scale, 1*scale, 1*scale),
            new Vector3d( 0*scale,-1*scale, 0*scale),
        ]);
        triangles.push([
            new Vector3d( 1*scale, 1*scale,-1*scale),
            new Vector3d( 1*scale, 1*scale, 1*scale),
            new Vector3d( 0*scale,-1*scale, 0*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale, 1*scale, 1*scale),
            new Vector3d( 1*scale, 1*scale, 1*scale),
            new Vector3d( 0*scale,-1*scale, 0*scale),
        ]);

        triangles.push([
            new Vector3d( 1*scale, 1*scale,-1*scale),
            new Vector3d( 1*scale, 1*scale, 1*scale),
            new Vector3d(-1*scale, 1*scale, 1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale, 1*scale, 1*scale),
            new Vector3d(-1*scale, 1*scale,-1*scale),
            new Vector3d( 1*scale, 1*scale,-1*scale),
        ]);
        
        const position = new Vector3d(0,0,0);
        const rotation = new Vector3d(0,0,0);
        const color = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        ];

        return new Object3d(
            triangles,
            position,
            rotation,
            color
        );
        
    }

    static generateCube(scale) {

        const triangles = [];
        
        triangles.push([
            new Vector3d(-1*scale, -1*scale, -1*scale),
            new Vector3d(-1*scale,  1*scale, -1*scale),
            new Vector3d( 1*scale, -1*scale, -1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale,  1*scale, -1*scale),
            new Vector3d( 1*scale,  1*scale, -1*scale),
            new Vector3d( 1*scale, -1*scale, -1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale, -1*scale,  1*scale),
            new Vector3d(-1*scale,  1*scale,  1*scale),
            new Vector3d( 1*scale, -1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale,  1*scale,  1*scale),
            new Vector3d( 1*scale,  1*scale,  1*scale),
            new Vector3d( 1*scale, -1*scale,  1*scale),
        ]);

        triangles.push([
            new Vector3d(-1*scale, -1*scale, -1*scale),
            new Vector3d(-1*scale,  1*scale, -1*scale),
            new Vector3d(-1*scale,  1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale, -1*scale, -1*scale),
            new Vector3d(-1*scale, -1*scale,  1*scale),
            new Vector3d(-1*scale,  1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d( 1*scale, -1*scale, -1*scale),
            new Vector3d( 1*scale,  1*scale, -1*scale),
            new Vector3d( 1*scale,  1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d( 1*scale, -1*scale, -1*scale),
            new Vector3d( 1*scale, -1*scale,  1*scale),
            new Vector3d( 1*scale,  1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale, -1*scale, -1*scale),
            new Vector3d( 1*scale, -1*scale, -1*scale),
            new Vector3d( 1*scale, -1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale, -1*scale, -1*scale),
            new Vector3d(-1*scale, -1*scale,  1*scale),
            new Vector3d( 1*scale, -1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale,  1*scale, -1*scale),
            new Vector3d( 1*scale,  1*scale, -1*scale),
            new Vector3d( 1*scale,  1*scale,  1*scale),
        ]);
        triangles.push([
            new Vector3d(-1*scale,  1*scale, -1*scale),
            new Vector3d(-1*scale,  1*scale,  1*scale),
            new Vector3d( 1*scale,  1*scale,  1*scale),
        ]);
        
        const position = new Vector3d(0,0,0);
        const rotation = new Vector3d(0,0,0);
        const color = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        ];

        return new Object3d(
            triangles,
            position,
            rotation,
            color
        );
        
    }
    
}
    
