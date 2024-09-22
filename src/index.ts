import { RayCastingEngine } from './class/RayCastingEngine';
import { Vector3d } from './class/Vector3d';
import {
    generateCube,
    generatePyramid,
    generateSphere,
    getConfig
} from './utils'
import { RayCastingJs } from './class/RayCastingJs';
import { DefaultRenderer } from './class/Renderers/DefaultRenderer';
import { AsciiRenderer } from './class/Renderers/AsciiRenderer';

let raycastingjs: RayCastingJs;

window.addEventListener("load", function (event) {
    init();
});

window.onresize = () => {
    resize();
}

function resize(){
    if(raycastingjs){
        raycastingjs.loadConfig(getConfig());
        raycastingjs.onResize();
    }
}

document.querySelectorAll('#sidemenu input, #sidemenu select').forEach(element => {
    element.addEventListener('change', function(event) {
        raycastingjs.loadConfig(getConfig());
    });
});

function init() {
    
    const raycastingjsEngine = new RayCastingEngine();

    const pyramid = generatePyramid(100);
    pyramid.position = new Vector3d(100, -40, 200);
    raycastingjsEngine.addObject(pyramid);

    // const sphere = Object3dGenerator.generateSphere(100.0, 10, 10);
    // sphere.position = new Vector3d(100, -40, 200);
    // raycastingjsEngine.addObject(sphere);

    const leftCube = generateCube(150);
    leftCube.position = new Vector3d(-400, -40, 500);
    raycastingjsEngine.addObject(leftCube);

    const middleCube = generateCube(80);
    middleCube.position = new Vector3d(-40, -150, 300);
    raycastingjsEngine.addObject(middleCube);

    const bottomPyramid = generatePyramid(120);
    bottomPyramid.position = new Vector3d(0, 200, 400);
    raycastingjsEngine.addObject(bottomPyramid);

    raycastingjsEngine.addLight({
        position: new Vector3d(205, 0, 0),
        intensity: 2.0,
        enabled: true
    });

    raycastingjsEngine.addLight({
        position: new Vector3d(0,-200,0),
        intensity: 2.0,
        enabled: false
    });

    raycastingjsEngine.addLight({
        position: new Vector3d(-200,0,100),
        intensity: 3.0,
        enabled: false
    });

    raycastingjsEngine.addLight({
        position: new Vector3d(0,200,50),
        intensity: 4.0,
        enabled: false
    });

    raycastingjs = new RayCastingJs(
        raycastingjsEngine,
        getConfig()
    );

    raycastingjs.addRenderer(
        new DefaultRenderer(document.getElementById("renderhere") as HTMLCanvasElement),
        'default'
    )

    raycastingjs.addRenderer(
        new AsciiRenderer(document.getElementById("renderasciihere") as HTMLDivElement),
        'ascii'
    )

    resize();

    const drawLoop = () => {
        raycastingjs.update();
        raycastingjs.draw();
        const fpsCounterElement = document.getElementById("fps") as HTMLDivElement;
        fpsCounterElement.innerText = raycastingjs.getFps().toString();

        window.requestAnimationFrame(drawLoop);
    };
    window.requestAnimationFrame(drawLoop);
}
