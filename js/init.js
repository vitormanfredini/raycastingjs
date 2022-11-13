var raycastingjs;

window.addEventListener("load", function(event) {
    init();
});

function init() {
    
    const horizontalResolution = 120;
    const screenRatio = window.innerHeight / window.innerWidth;
    const raycastingjsEngine = new RayCastingJsEngine(horizontalResolution,screenRatio);

    const pyramid1 = Object3dGenerator.generatePyramid(100);
    pyramid1.position = new Vector3d(100,-40,200);
    raycastingjsEngine.addObject(pyramid1);

    const pyramid2 = Object3dGenerator.generateCube(150);
    pyramid2.position = new Vector3d(-400,-40,500);
    raycastingjsEngine.addObject(pyramid2);

    const cube = Object3dGenerator.generateCube(80);
    cube.position = new Vector3d(-40,-150,300);
    raycastingjsEngine.addObject(cube);

    raycastingjsEngine.addLight(new Light3d(
        new Vector3d(200,0,0)
    ));
    
    raycastingjs = new RayCastingJs(
        document.getElementById('renderhere').getContext('2d'),
        raycastingjsEngine
    );

    setInterval(function(){
        raycastingjs.update();
        raycastingjs.draw();
    },33);

}
