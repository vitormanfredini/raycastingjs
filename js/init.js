var raycastingjs;

window.addEventListener("load", function (event) {
    init();
});

function init() {
    
    const raycastingjsEngine = new RayCastingJsEngine(new EngineConfiguration(
        2,
        2,
        1,
        false
    ));

    const pyramid = Object3dGenerator.generatePyramid(100);
    pyramid.position = new Vector3d(100, -40, 200);
    raycastingjsEngine.addObject(pyramid);

    // const sphere = Object3dGenerator.generateSphere(100.0, 10, 10);
    // sphere.position = new Vector3d(100, -40, 200);
    // raycastingjsEngine.addObject(sphere);

    const leftCube = Object3dGenerator.generateCube(150);
    leftCube.position = new Vector3d(-400, -40, 500);
    raycastingjsEngine.addObject(leftCube);

    const middleCube = Object3dGenerator.generateCube(80);
    middleCube.position = new Vector3d(-40, -150, 300);
    raycastingjsEngine.addObject(middleCube);

    const bottomPyramid = Object3dGenerator.generatePyramid(120);
    bottomPyramid.position = new Vector3d(0, 200, 400);
    raycastingjsEngine.addObject(bottomPyramid);

    // strong light coming from the right side
    raycastingjsEngine.addLight(new Light3d(new Vector3d(205, 0, 0), 2.0));

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
        document.getElementById("renderhere").getContext("2d"),
        document.getElementById("renderasciihere"),
        raycastingjsEngine
    );

    const drawLoop = () => {

        const ascii = document.getElementById('ascii').checked;
        const optimization = document.getElementById('optimization').checked;
        const multisampling = parseInt(document.getElementById('multisampling').value);
        
        const screenRatio = window.innerHeight / window.innerWidth;
        const newWidth = parseInt(document.getElementById('resolution').value);
        const newHeight = Math.ceil(newWidth * screenRatio);

        document.getElementById("renderhere").style.display = ascii ? 'none' : 'block';
        document.getElementById("renderasciihere").style.display = ascii ? 'block' : 'none';

        raycastingjs.engine.loadConfig(new EngineConfiguration(
            newWidth,
            newHeight,
            multisampling,
            optimization,
            ascii
        ))

        raycastingjs.update();

        raycastingjs.draw();

        window.requestAnimationFrame(drawLoop);
    };
    window.requestAnimationFrame(drawLoop);
}
