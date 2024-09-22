export class Pixel {

    public r: number
    public g: number
    public b: number
    public indexFirstObjectHit: number
    public indexFirstTriangleHit: number
    public allSamplesHitSameObject: boolean

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.indexFirstObjectHit = -1;
        this.indexFirstTriangleHit = -1;
        this.allSamplesHitSameObject = false;
    }

    copy(){
        let newPixel = new Pixel(this.r,this.g,this.b);
        newPixel.indexFirstObjectHit = this.indexFirstObjectHit;
        newPixel.indexFirstTriangleHit = this.indexFirstTriangleHit;
        newPixel.allSamplesHitSameObject = this.allSamplesHitSameObject;
        return newPixel;
    }

    isEqual(other: Pixel | null){
        if(other === null){
            return false;
        }
        if(this.r != other.r){
            return false;
        }
        if(this.g != other.g){
            return false;
        }
        if(this.b != other.b){
            return false;
        }
        return true;
    }

    calculateLuminance(){
        return (0.299*this.r + 0.587*this.g + 0.114*this.b)
    }
}