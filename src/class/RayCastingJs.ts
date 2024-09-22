import { RayCastingEngine } from "./RayCastingEngine";
import { IRenderer } from "./Renderers/IRenderer"

export type RayCastingJsConfig = {
    width: number;
    height: number;
    multisampling: number;
    optimization: boolean;
    renderer: string;
    lightLeft: boolean;
    lightTop: boolean;
    lightRight: boolean;
    lightBottom: boolean;
}

export class RayCastingJs {
    public engine: RayCastingEngine;
    private lastFrameMilliseconds: number;
    
    private deltaTimeHistory: number[] = [];

    private renderers: {
        [key: string]: IRenderer
    } = {};

    private config: RayCastingJsConfig = {
        height: 1,
        width: 1,
        multisampling: 1,
        optimization: false,
        renderer: '',
        lightLeft: false,
        lightTop: false,
        lightRight: false,
        lightBottom: false
    };

    constructor(engine: RayCastingEngine, initialConfig: RayCastingJsConfig) {
        this.engine = engine;
        this.loadConfig(initialConfig);
        this.engine.setSizes(this.config.width,this.config.height);
        this.lastFrameMilliseconds = Date.now();
    }

    loadConfig(config: RayCastingJsConfig) {
        const isChangingRenderers = this.config.renderer != config.renderer;
        if(isChangingRenderers){
            for(const renderer in this.renderers){
                if(renderer == config.renderer){
                    this.renderers[renderer].enable();
                }else{
                    this.renderers[renderer].disable();
                }
            }
        }

        this.engine.enableLight(0, config.lightRight);
        this.engine.enableLight(1, config.lightTop);
        this.engine.enableLight(2, config.lightLeft);
        this.engine.enableLight(3, config.lightBottom);

        this.config = config;
        this.engine.setSizes(this.config.width,this.config.height);
        this.onResize()
    }

    addRenderer(renderer: IRenderer, name: string) {
        this.renderers[name] = renderer;
    }

    update() {
        const timeStartedRendering = Date.now();
        const deltaTime = timeStartedRendering - this.lastFrameMilliseconds;
        this.addDeltaTimeToHistory(deltaTime)
        const oneFrameInMilliseconds = 1000 / 60;
        this.engine.update(this.config, deltaTime / oneFrameInMilliseconds);
        this.lastFrameMilliseconds = timeStartedRendering;
    }

    onResize() {
        if(Object.keys(this.renderers).length == 0){
            return;
        }
        this.renderers[this.config.renderer].onResize(this.config.width)
    }

    draw() {
        this.renderers[this.config.renderer].render(
            this.engine.getPixels(),
            this.engine.width,
        )
    }

    addDeltaTimeToHistory(deltaTime: number){
        if(this.deltaTimeHistory.length >= 5){
            this.deltaTimeHistory.shift();
        }
        this.deltaTimeHistory.push(deltaTime);
    }

    getFps(): number {
        const sum = this.deltaTimeHistory.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / this.deltaTimeHistory.length;
        return Math.round(1000 / average);
    }

}
