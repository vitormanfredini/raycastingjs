class Pixel{
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    copy(){
        return new Pixel(this.r,this.g,this.b)
    }

    isEqual(other){
        if(other == null){
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
}