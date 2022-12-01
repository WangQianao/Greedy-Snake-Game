import { GameObject } from "/js/snake/GameObject.js";

export class Score extends GameObject{

    constructor(info,gamemap){
        super();
        this.r=info.r;
        this.c=info.c;
        this.gamemap=gamemap;
       
    }
    update(){
        this.render();
    }
    render(){
        //绘制score
        let L=this.gamemap.L;
        let ctx=this.gamemap.ctx;
        ctx.fillStyle='yellow';
        ctx.beginPath();
        ctx.arc((this.c+0.5)*L,(this.r+0.5)*L,L/2*0.8,0,Math.PI*2);
        ctx.fill();
    }
}