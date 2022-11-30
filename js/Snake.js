import { GameObject } from "/js/GameObject.js";
import {Cell} from '/js/Cell.js';
export class Snake extends GameObject{
    constructor(info,gamemap)
    {
        //info是一个Object，维护初始化蛇所需要的信息
        super();
        //蛇的id
        this.id=info.id;
        //蛇的颜色
        this.color=info.color;
        this.gamemap=gamemap;
        //蛇的身体，初始只有一个Cell，为蛇头
        this.cells=[new Cell(info.r,info.c)];
        //蛇的方向
        this.direction=-1;//0,1,2,3表示上右下左
        //蛇的眼睛的方向，这个参数在绘制蛇眼的时候要用到
        this.eye_direction=0;
        if(this.id===1)this.eye_direction=2;
        //为了方便根据蛇的朝向绘制出蛇的眼睛，定义了一个偏移数组
        //eye_dx数组描述在x方向上眼睛的偏移,数组形状为(4,2)
        //4表示四个方向,2表示两个眼睛
        //比如eye_dx[0][0]=-1表示蛇的朝向为上，左眼要偏移-1单位
        //具体偏移多少像素后面会计算
        this.eye_dx=[
            [-1,1],
            [1,1],
            [1,-1],
            [-1,-1],
        ];
        this.eye_dy=[
            [-1,-1],
            [-1,1],
            [1,1],
            [-1,1],

        ];

        this.speed=5;
        this.status="idle";//idle表示静止,move表示正在移动,die表示死亡
        this.dr=[-1,0,1,0];
        this.dc=[0,1,0,-1];
        this.eps=1e-2;
    }
    start()
    {

    }
    next_step()//将蛇的状态变为下一步
    {
        const d=this.direction;
        this.next_cell=new Cell(this.cells[0].r+this.dr[d],this.cells[0].c+this.dc[d]);
        this.eye_direction=d; 
        this.direction=-1;
        this.status="move";
        const k=this.cells.length;
        for(let i=k;i>0;i--)
        {
            this.cells[i]=JSON.parse(JSON.stringify(this.cells[i-1]));
        }
    }
    set_direction(d)
    {
        this.direction=d;
    }
    update_move()
    {
        const dx=this.next_cell.x-this.cells[0].x;
        const dy=this.next_cell.y-this.cells[0].y;
        const distance=Math.sqrt(dx*dx+dy*dy);
        if(distance<this.eps)//走到目标点后
        {
            this.cells[0]=this.next_cell;//新增一个蛇头
            this.next_cell=null;
            this.status="idle"; 
              
        }else{
            const move_distance=this.speed*this.timedelta/1000;//每两帧之间走过的距离
            this.cells[0].x+=move_distance*dx/distance;
            this.cells[0].y+=move_distance*dy/distance;
        }

    }
    update()
    {
        if(this.status==='move')
        {
            this.update_move();
        }
        this.render();
    }
    render()
    {
        const L=this.gamemap.L;
        const ctx=this.gamemap.ctx;
        ctx.fillStyle=this.color;
        //绘制蛇的身体
        for(const cell of this.cells)
        {
            ctx.beginPath();
            ctx.arc(cell.x*L,cell.y*L,L/2*0.8,0,Math.PI*2);
            ctx.fill();
        }

        //绘制蛇的两个眼睛
        ctx.fillStyle="black";
        for(let i=0;i<2;i++)
        {
            const eye_x=(this.cells[0].x+this.eye_dx[this.eye_direction][i]*0.2)*L;
            const eye_y=(this.cells[0].y+this.eye_dy[this.eye_direction][i]*0.2)*L;
            ctx.beginPath();
            ctx.arc(eye_x,eye_y,L*0.05,0,Math.PI*2);
            ctx.fill();
        }
    }
}