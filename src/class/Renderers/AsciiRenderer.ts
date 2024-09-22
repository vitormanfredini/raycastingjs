import { Pixel } from "../Pixel";
import { IRenderer } from "./IRenderer";

export class AsciiRenderer implements IRenderer {
    private div: HTMLDivElement;

    constructor(div: HTMLDivElement) {
        this.div = div;
    }

    enable(): void {
        this.div.style.display = 'block';
    }

    disable(): void {
        this.div.style.display = 'none';
    }

    render(pixels: Pixel[], virtualWidth: number): void {
        let asciiString = '';
        for (let c = 0; c < pixels.length; c++) {
            if(c > 0 && c % virtualWidth == 0){
                asciiString += "\n";
            }

            const luminance = pixels[c].calculateLuminance();
            asciiString += this.luminanceToAsciiChar(luminance / 255);
        }
        this.div.innerText = asciiString;
    }

    onResize(virtualWidth: number): void {
        const asciiFontSize = this.getFontSizeToFitScreen(virtualWidth)
        this.div.style.fontSize = asciiFontSize+'px';
        this.div.style.lineHeight = (asciiFontSize * 0.60) +'px';
    }

    luminanceToAsciiChar(normalizedLuminance: number): string {
        // let asciiChardsDarkerToLighter = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^'`. ";
        let asciiChardsDarkerToLighter = " `,-_~:;!+ilI?][}{1)(\\/tfjrxnuvczmwqpdbkhao#MW&8%B@$"
        // asciiChardsDarkerToLighter = asciiChardsDarkerToLighter.split("").reverse().join("");
        const numChars = asciiChardsDarkerToLighter.length;
        const luminanceBoost = 1.2
        let index = numChars * normalizedLuminance * luminanceBoost;
        if (index > numChars - 1){
            index = numChars - 1;
        }
        return asciiChardsDarkerToLighter.charAt(index);
    }

    getFontSizeToFitScreen = (numChars: number) => {

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

}
