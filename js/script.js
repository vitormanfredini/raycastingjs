var raycastingjs;

window.addEventListener("load", function(event) {
    init();
});

function init() {
    
    const raycastingjsEngine = new RayCastingJsEngine(
        120,
        window.innerHeight / window.innerWidth
        );

    const newObject1 = Object3dGenerator.generatePiramid(100);
    newObject1.position = new Vector3d(80,-40,200);
    newObject1.color = [250,20,20];
    raycastingjsEngine.addObject(newObject1);

    const newObject2 = Object3dGenerator.generatePiramid(100);
    newObject2.position = new Vector3d(-130,-40,250);
    newObject2.color = [20,0,250];
    raycastingjsEngine.addObject(newObject2);
    
    raycastingjs = new RayCastingJs(
        document.getElementById('renderhere').getContext('2d'),
        raycastingjsEngine
    );

    setInterval(function(){
        raycastingjs.update();
        raycastingjs.draw();
    },33);

}

