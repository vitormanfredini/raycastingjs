class Object3dGenerator {
    static generatePyramid(scale) {
        const triangles = [];
        triangles.push([new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);
        triangles.push([new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);
        triangles.push([new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);
        triangles.push([new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);

        triangles.push([new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, -1 * scale)]);

        const position = new Vector3d(0, 0, 0);
        const rotation = new Vector3d(0, 0, 0);
        const color = [Math.sqrt(Math.random()) * 255, Math.sqrt(Math.random()) * 255, Math.sqrt(Math.random()) * 255];

        return new Object3d(triangles, position, rotation, color);
    }

    static generateCube(scale) {
        const triangles = [];

        triangles.push([new Vector3d(-1 * scale, -1 * scale, -1 * scale), new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, -1 * scale, -1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, -1 * scale, -1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, -1 * scale, 1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(1 * scale, -1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale), new Vector3d(1 * scale, -1 * scale, 1 * scale)]);

        triangles.push([new Vector3d(-1 * scale, -1 * scale, -1 * scale), new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, -1 * scale, -1 * scale), new Vector3d(-1 * scale, -1 * scale, 1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(1 * scale, -1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(1 * scale, -1 * scale, -1 * scale), new Vector3d(1 * scale, -1 * scale, 1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, -1 * scale, -1 * scale), new Vector3d(1 * scale, -1 * scale, -1 * scale), new Vector3d(1 * scale, -1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, -1 * scale, -1 * scale), new Vector3d(-1 * scale, -1 * scale, 1 * scale), new Vector3d(1 * scale, -1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale)]);
        triangles.push([new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale)]);

        const position = new Vector3d(0, 0, 0);
        const rotation = new Vector3d(0, 0, 0);
        const color = [Math.sqrt(Math.random()) * 255, Math.sqrt(Math.random()) * 255, Math.sqrt(Math.random()) * 255];

        return new Object3d(triangles, position, rotation, color);
    }

    static generateSphere(radius, segments, rings) {
        const triangles = [];
        const PI = Math.PI;

        for (let latNumber = 0; latNumber <= rings; latNumber++) {
            const theta = (latNumber * PI) / rings;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= segments; longNumber++) {
                const phi = (longNumber * 2 * PI) / segments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;

                const vertex = new Vector3d(radius * x, radius * y, radius * z);
                triangles.push(vertex);
            }
        }

        const sphereTriangles = [];

        for (let latNumber = 0; latNumber < rings; latNumber++) {
            for (let longNumber = 0; longNumber < segments; longNumber++) {
                const first = latNumber * (segments + 1) + longNumber;
                const second = first + segments + 1;

                sphereTriangles.push([triangles[first], triangles[second], triangles[first + 1]]);

                sphereTriangles.push([triangles[second], triangles[second + 1], triangles[first + 1]]);
            }
        }

        const position = new Vector3d(0, 0, 0);
        const rotation = new Vector3d(0, 0, 0);
        const color = [Math.sqrt(Math.random()) * 255, Math.sqrt(Math.random()) * 255, Math.sqrt(Math.random()) * 255];

        return new Object3d(sphereTriangles, position, rotation, color);
    }
}
