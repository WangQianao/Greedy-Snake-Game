import { GameObject } from "/js/GameObject.js";
import {Wall} from "/js/Wall.js";

export class GameMap extends GameObject{
    constructor(parent)
    {
        super();
        this.parent=$('.'+parent)[0];
        this.$canvas=$('canvas')[0];
        this.ctx=this.$canvas.getContext('2d');
        this.rows=13;
        this.cols=14;
        this.L=0;

        this.inner_walls_count=20;
        this.walls=[];
    }
    start(){
        for(let i=0;i<1000;i++)//暴力生成地图
        {
            if(this.create_walls())break;
        }
    }
    update_size()
    {
        
        this.L=parseInt(Math.min(this.parent.clientWidth/this.cols,this.parent.clientHeight/this.rows));
        this.ctx.canvas.width=this.L*this.cols;
        this.ctx.canvas.height=this.L*this.rows;

    }
    check_connectivity(g,sx,sy,tx,ty)//深度优先检查连通性
    {
        if(sx==tx&&sy==ty)return true;
        g[sx][sy]=true;
        let dx=[-1,0,1,0],dy=[0,1,0,-1];
        for(let i=0;i<4;i++)
        {
            let xx=sx+dx[i],yy=sy+dy[i];
            if(g[xx][yy])continue;
            if(xx<1||xx>this.rows-2||yy<1||yy>this.cols-2)continue;
            if(this.check_connectivity(g,xx,yy,tx,ty))return true;
        }
        return false;
    }
    create_walls()
    {
        const g=[];//g为一个二维数组，标志着地图上某处是否有障碍物，true为有
        for(let r=0;r<this.rows;r++)
        {
            g[r]=[];
            for(let c=0;c<this.cols;c++)
            {
                g[r][c]=false;
            }
        }
        for (let r=0;r<this.rows;r++)
        {
            g[r][0]=g[r][this.cols-1]=true;
        }
        for(let c=0;c<this.cols;c++)
        {
            g[0][c]=g[this.rows-1][c]=true;
        }

        //创建内部的随机障碍物,必须是沿中心轴对称
        for(let i=0;i<this.inner_walls_count;i++)
        {
            for(let j=0;j<1000;j++)//暴力生成障碍物
            {
                let r=parseInt(Math.random()*this.rows);
                let c=parseInt(Math.random()*this.cols);
                if(g[r][c] || g[this.rows-1-r][this.cols-1-c])continue;
                if(r===this.rows-2&&c===1 || c==this.cols-2&&r===1)continue;
                g[r][c]=g[this.rows-1-r][this.cols-1-c]=true;

                break;

            }
        }
        const copy_g= JSON.parse(JSON.stringify(g));
        if(!this.check_connectivity(copy_g,this.rows-2,1,1,this.cols-2))return false;

        for(let r=0;r<this.rows;r++)
        {
            for(let c=0;c<this.cols;c++)
            {
                if(g[r][c])
                {
                    this.walls.push(new Wall(r,c,this));
                }
            }
        }
        return true;


    }
    update(){
        this.update_size();
        this.render();

    }
    render(){
        const color_even="#AAD751",color_odd="#A2D149";
        for(let r=0;r<this.rows;r++)
        {
            for(let c=0;c<this.cols;c++)
            {
                if((r+c)%2 ===0)
                {
                    this.ctx.fillStyle=color_even;
                }else{
                    this.ctx.fillStyle=color_odd;
                }
                this.ctx.fillRect(c*this.L,r*this.L,this.L,this.L);
            }
        }

    }
}