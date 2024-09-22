import { Pixel } from "../Pixel";

export interface IRenderer {
    enable: () => void;
    onResize: (virtualWidth: number) => void;
    disable: () => void;
    render: (pixels: Pixel[], width: number) => void;
}
