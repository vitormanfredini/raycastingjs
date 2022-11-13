var raycastingjs;

window.addEventListener("load", function(event) {
    init();
});

function init() {
    
    const horizontalResolution = 120;
    const screenRatio = window.innerHeight / window.innerWidth;
    const raycastingjsEngine = new RayCastingJsEngine(horizontalResolution,screenRatio);

    const redPyramid = Object3dGenerator.generatePyramid(100);
    redPyramid.position = new Vector3d(80,-40,200);
    raycastingjsEngine.addObject(redPyramid);

    const otherPyramid = Object3dGenerator.generatePyramid(100);
    otherPyramid.position = new Vector3d(-130,-40,250);
    raycastingjsEngine.addObject(otherPyramid);

    const cube = Object3dGenerator.generateCube(80);
    cube.position = new Vector3d(-10,-150,250);
    raycastingjsEngine.addObject(cube);
    
    raycastingjs = new RayCastingJs(
        document.getElementById('renderhere').getContext('2d'),
        raycastingjsEngine
    );

    setInterval(function(){
        raycastingjs.update();
        raycastingjs.draw();
    },33);

}
