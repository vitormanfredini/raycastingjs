import { Color, Object3d } from "./class/Object3d";
import { Vector3d } from "./class/Vector3d";

const generatePyramid = (scale: number) => {
    const triangles = [];
    triangles.push([new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);
    triangles.push([new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);
    triangles.push([new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);
    triangles.push([new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale), new Vector3d(0 * scale, -1 * scale, 0 * scale)]);

    triangles.push([new Vector3d(1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, 1 * scale), new Vector3d(-1 * scale, 1 * scale, 1 * scale)]);
    triangles.push([new Vector3d(-1 * scale, 1 * scale, 1 * scale), new Vector3d(-1 * scale, 1 * scale, -1 * scale), new Vector3d(1 * scale, 1 * scale, -1 * scale)]);

    const position = new Vector3d(0, 0, 0);
    const rotation = new Vector3d(0, 0, 0);
    const color: Color = {
        r: Math.sqrt(Math.random()) * 255,
        g: Math.sqrt(Math.random()) * 255,
        b: Math.sqrt(Math.random()) * 255
    };

    return new Object3d(triangles, position, rotation, color);
}

const generateCube = (scale: number) => {
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
    const color = {
        r: Math.sqrt(Math.random()) * 255,
        g: Math.sqrt(Math.random()) * 255,
        b: Math.sqrt(Math.random()) * 255
    };

    return new Object3d(triangles, position, rotation, color);
}

const generateSphere = (radius: number, segments: number, rings: number) => {
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
    const color = {
        r: Math.sqrt(Math.random()) * 255,
        g: Math.sqrt(Math.random()) * 255,
        b: Math.sqrt(Math.random()) * 255
    };

    return new Object3d(sphereTriangles, position, rotation, color);
}


const getFontSizeToFitScreen = (numChars: number) => {

    const div = document.createElement('div');
    div.className = 'howManyChars';
    div.innerText += 'A';
    document.body.appendChild(div);

    const oneLineHeight = div.clientHeight;

    for(let c=0;c<numChars-1;c++){
        div.innerText += 'A';
    }

    let fontSize = 1;
    for(let c=0;c<500;c++){
        div.style.fontSize = fontSize+'px';
        if(div.clientHeight > oneLineHeight){
            break
        }
        fontSize += 0.25
    }

    const divRemove = document.querySelector('.howManyChars');
    if (divRemove) divRemove.remove();
    
    return fontSize
}

export {
    getFontSizeToFitScreen,
    generateCube,
    generatePyramid,
    generateSphere
}