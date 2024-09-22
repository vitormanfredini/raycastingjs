import { RayCastingEngine } from './class/RayCastingEngine';
import { Vector3d } from './class/Vector3d';
import {
    generateCube,
    generatePyramid,
    generateSphere
} from './utils'
import { RayCastingJs } from './class/RayCastingJs';

let raycastingjs: RayCastingJs;

window.addEventListener("load", function (event) {
    init();
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

    // strong light coming from the right side
    raycastingjsEngine.addLight({
        position: new Vector3d(205, 0, 0),
        intensity: 2.0
    });

    // cluster of dim lights to form smooth shadow
    // raycastingjsEngine.addLight(new Light3d(
    //     new Vector3d(205,0,0),
    //     0.5
    // ));
    // raycastingjsEngine.addLight(new Light3d(
    //     new Vector3d(200,3,0),
    //     0.5
    // ));
    // raycastingjsEngine.addLight(new Light3d(
    //     new Vector3d(200,0,3),
    //     0.5
    // ));
    // raycastingjsEngine.addLight(new Light3d(
    //     new Vector3d(200,0,-3),
    //     0.5
    // ));
    // raycastingjsEngine.addLight(new Light3d(
    //     new Vector3d(200,-3,-3),
    //     0.5
    // ));

    // intense light from the the top
    // raycastingjsEngine.addLight(new Light3d(
    //     new Vector3d(0,-200,0),
    //     2.0
    // ));

    // very intense light from the left
    // raycastingjsEngine.addLight(new Light3d(
    //     new Vector3d(-200,0,100),
    //     4.0
    // ));

    raycastingjs = new RayCastingJs(
        (document.getElementById("renderhere") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D,
        document.getElementById("renderasciihere") as HTMLDivElement,
        raycastingjsEngine
    );

    const drawLoop = () => {

        const ascii = (document.getElementById('ascii') as HTMLInputElement).checked;
        const optimization = (document.getElementById('optimization') as HTMLInputElement).checked;
        const multisampling = parseInt((document.getElementById('multisampling') as HTMLSelectElement).value);
        
        const screenRatio = window.innerHeight / window.innerWidth;
        const newWidth = parseInt((document.getElementById('resolution') as HTMLSelectElement).value);
        const newHeight = Math.ceil(newWidth * screenRatio);

        (document.getElementById("renderhere") as HTMLDivElement).style.display = ascii ? 'none' : 'block';
        (document.getElementById("renderasciihere") as HTMLDivElement).style.display = ascii ? 'block' : 'none';

        raycastingjs.engine.loadConfig({
            width: newWidth,
            height: newHeight,
            multisampling: multisampling,
            optimization: optimization,
            ascii: ascii
        });

        raycastingjs.update();

        raycastingjs.draw();

        (document.getElementById("fps") as HTMLDivElement).innerText = raycastingjs.getFps().toString();

        window.requestAnimationFrame(drawLoop);
    };
    window.requestAnimationFrame(drawLoop);
}
