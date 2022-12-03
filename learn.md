# 准备工作

## 创建index.html，一切的开始
新建一个文件夹，起一个你喜欢的名字，标志项目的开始<br>
在文件夹里新建一个html文件，起名index.html<br>
将下面的代码块中的内容复制到index.html文件中
``` 
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>贪吃蛇</title>
    <script src="https://cdn.acwing.com/static/jquery/js/jquery-3.3.1.min.js"></script>
    <style>
        .playground {
            width: 60vw;
            height: 70vh;
            margin: 40px auto;
        }

        .gamemap {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: lightblue;
        }
    </style>
</head>

<body>
    <div class="playground">
        <div class="gamemap">
            <canvas tabindex="0"></canvas>
        </div>
    </div>
</body>

</html>
```
接着用鼠标选中index.html文件，点击鼠标右键，在弹出的菜单中选择第一个“Open with Live Server”,就可以在浏览器中看到我们html文件渲染后的结果啦
![01.png](https://s2.loli.net/2022/11/30/YBDG9Qoie5qtMuF.png)
我们的贪吃蛇游戏就将在这块浅蓝色的区域上进行

## canvas

Canvas API 提供了一个通过JavaScript 和 HTML的canvas 元素来绘制图形的方式。简单来说，我们可以用canvas和js的组合绘制各种各样的图形。

``` 
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <canvas id="canvas"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'green';
        ctx.fillRect(10, 10, 150, 100);

    </script>
</body>

</html>
```

上面的代码就绘制了一个如下图所示的绿色矩形
![02.png](https://s2.loli.net/2022/11/30/1yPObMTLFtnfqmw.png)
我们的贪吃蛇游戏就是基于canvas和js来实现的。如果你不了解canvas，完全没有关系，只需要把它当成一个api来调用就可以了。<br>
我们在canvas标签中，使用了"tabindex=0"这个属性，tabindex属性能够帮助我们实现元素聚焦，使得canvas能够监听键盘输入，从而控制游戏的运行。

## jquery
在上面的代码中，我们用下面这一行代码引入了jquery，jquery是一个库，能够简化我们对html中元素的操作

```
<script src="https://cdn.acwing.com/static/jquery/js/jquery-3.3.1.min.js"></script>
```

## 游戏元素
<p>在贪吃蛇游戏中，我们需要管理很多游戏元素，比如地图，蛇，障碍物等等。我们可以创建一个统一的类GameObject来管理这些元素。</p>
新建一个文件夹 js,用来存放所有用到的js文件,在该文件夹下创建一个名为GameObject.js的文件,将下列代码复制到该文件中

``` javascript
const GAME_OBJECTS = [];
export class GameObject {
    constructor()
    {
        GAME_OBJECTS.push(this);
        this.timedelta=0;
        this.has_called_start=false;
    }
    start()
    {


    }
    update()
    {


    }
    on_destroy()
    {

    }
    destroy()
    {
        this.on_destroy();
        for (let i in GAME_OBJECTS)
        {
            const obj = GAME_OBJECTS[i];
            if(obj === this)
            {
                GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}
let last_timestamp;
const step = timestamp =>{

    for(let obj of GAME_OBJECTS)
    {
        if(!obj.has_called_start)
        {
            obj.has_called_start=true;
            obj.start();
        }else{
            obj.timedelta=timestamp-last_timestamp;
            obj.update();
        }
    }
    last_timestamp=timestamp;
    requestAnimationFrame(step)
}

requestAnimationFrame(step)
```
<p>在代码中，我们声明了一个名为GameObject的类，我们将用这个类去管理所有游戏中的元素。</p>
<p>在游戏中，每一个物体都有创建，更新，以及销毁这样几个阶段，俗称生命周期。体现为start()、update()、on_destory()、destory()函数。一般start和destory相关的函数只会被调用一次，而update函数却会被调用多次。</p>
<p>在代码开头，我们声明了一个GAME_OBJECTS数组,每一个游戏元素都将在被创建的时候加入到这个数组中，在被销毁时它将被移除出这个数组</p>

## window.requestAnimationFrame函数
<p>window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。</p>
<p>回调函数执行次数通常是每秒 60 次
若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用window.requestAnimationFrame()。</p>
<p>回调函数会被传入一个timestamp参数，指示当前被 requestAnimationFrame() 调用的回调函数被触发的时间，单位是毫秒。</p>
<p>在这里，我们声明了一个名为step的回调函数，在这个函数里，我们会更新所有游戏元素的状态，并获取两次调用requestAnimationFrame之间的时间间隔，这个间隔对后续的游戏编写是有用的。</p>

第一章内容到这里就结束了，下一章，我们将开始地图的绘制。

# 地图

## 初始地图
在js文件夹下创建新文件GameMap.js
将下面的代码复制到该文件中

``` javascript
import { GameObject } from "/js/GameObject.js";

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
    }
    start(){
            
    }
    update_size()
    {
        
        this.L=parseInt(Math.min(this.parent.clientWidth/this.cols,this.parent.clientHeight/this.rows));
        this.ctx.canvas.width=this.L*this.cols;
        this.ctx.canvas.height=this.L*this.rows;

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

```
<p>GameMap.js文件中声明了一个GameMap类，继承自GameObject类</p>
<p>在GameMap类里，我们在constructor中做了下面这几件事：

1. 执行父类构造函数，这会将GameMap加入到GAME_OBJECTS数组里
2. 通过jquery拿到了在index.html文件中声明的class为'gamemap'的div和canvas标签
3. 声明了地图的行数和列数，13行14列
4. 声明地图中每一个小方块的大小L，但赋值为0</p>

<p>update函数中，我们调用了两个函数</p>

<p>update_size函数会动态计算地图中每一个方块的大小，画布的宽度和高度(注意canvas的宽和高跟一般的坐标系是颠倒的)。这样做的好处是当我们改变浏览器窗口的大小，我们的地图也会动态地改变大小。</p>
<p>render函数负责地图的最终绘制,在这个函数中，我们用到了 <b>fillRect</b> 这个函数，它是 Canvas 2D API 绘制填充矩形的方法。</p>
<p><b>void ctx.fillRect(x, y, width, height);</b>
这个函数的四个参数分别是：x, y表示这个矩形的开始点（左上点）的坐标 ，width 和 height表示宽度和高度</p>



在index.html文件中，在canvas标签后添加下列代码
``` javascript
<script type="module">
    import {GameMap} from '/js/GameMap.js';
    const gamemap=new GameMap('gamemap');
</script>

```

此时，body标签应该是这样
``` 
<body>
    <div class="playground">
        <div class="gamemap">
            <canvas  tabindex="0"></canvas>
            <script type="module">
                import {GameMap} from '/js/GameMap.js';
                const gamemap=new GameMap('gamemap');
            </script>
        </div>
    </div>
</body>

```
这时候，用live Server打开index.html文件应该是下面这样
![03.png](https://s2.loli.net/2022/11/30/FTxMArpYwWgGvE3.png)



## 地图加上障碍物

在js文件夹下创建Wall.js文件
复制下面的代码到文件中
``` javascript
import { GameObject } from "/js/GameObject.js";

export  class Wall extends GameObject{
    constructor(r,c,gamemap)
    {
        super();
        this.r=r;
        this.c=c;
        this.gamemap=gamemap;
        this.color="#B37226";
    }
    update()
    {
        this.render();
    }
    render()
    {
        const L=this.gamemap.L;
        const ctx=this.gamemap.ctx;
        ctx.fillStyle=this.color;
        ctx.fillRect(this.c*L,this.r*L,L,L);
    }
}

```

这个文件声明了一个名为Wall的类，代表地图中的每一个小障碍物，它同样继承自GameObject。
在它的构造函数中，我们声明了这一个障碍物所在的行和列，以及它的颜色，同时传入了一个GameMap类，以便拿到每一个方块的大小和canvas这两个参数。
在render函数中，我们将这个障碍物通过canvas画出来。

在GameMap.js的constructor函数中，添加下面两行代码,用来指定地图中的障碍物数量和维护所有的障碍物

``` javascript
this.inner_walls_count=20;
this.walls=[];
```
接着，将下面这两个函数复制到GameMap类中
 
``` javascript
//深度优先搜索检查连通性
check_connectivity(g,sx,sy,tx,ty)
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
    //g为一个二维数组，标志着地图上某处是否有障碍物，true为有
    const g=[];
    for(let r=0;r<this.rows;r++)
    {
        g[r]=[];
        for(let c=0;c<this.cols;c++)
        {
            g[r][c]=false;
        }
    }
    //将地图上最外围一圈都放上障碍物，代表地图边界
    for (let r=0;r<this.rows;r++)
    {
        g[r][0]=g[r][this.cols-1]=true;
    }
    for(let c=0;c<this.cols;c++)
    {
        g[0][c]=g[this.rows-1][c]=true;
    }

    //创建内部的随机障碍物,必须是沿中心轴对称
    for(let i=0;i<this.inner_walls_count/2;i++)
    {
        //暴力生成障碍物，生成一千次随机数应该是能保证至少有一次成功生成的
        for(let j=0;j<1000;j++)
        {
            let r=parseInt(Math.random()*this.rows);
            let c=parseInt(Math.random()*this.cols);
            if(g[r][c] || g[this.rows-1-r][this.cols-1-c])continue;
            if(r===this.rows-2&&c===1 || c==this.cols-2&&r===1)continue;
            g[r][c]=g[this.rows-1-r][this.cols-1-c]=true;

            break;

        }
    }
    //生成g数组的一个副本
    const copy_g= JSON.parse(JSON.stringify(g));
    //检查生成的地图
    //如果从左下角不能走到右上角，那么地图生成失败
    if(!this.check_connectivity(copy_g,this.rows-2,1,1,this.cols-2))return false;

    //生成障碍物
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

```

函数create_walls()用来生成障碍物，解释我都写在了代码的注释中
接着，在GameMap的start函数中添加下面的语句

``` javascript
//暴力生成地图
//因为我们是利用随机数随机生成障碍物
//只生成一次可能无法生成成功的地图
//调用一千次应该是能保证最后至少能成功生成一次的
for(let i=0;i<1000;i++)
{
    if(this.create_walls())break;
}

```
当然，别忘了在GameMap的开头引入Wall这个类
如上一番操作之后，GameMap.js文件中应该是这样的
``` javascript
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

```
接下来，用Live Server打开index.html，就能看见地图了
不断使用刷新键刷新网页，可以看到每一次都会动态生成不同的地图

![04.png](https://s2.loli.net/2022/12/03/M89XoGsC5tFvTSD.png)

# 蛇🐍

## 怎样画一条蛇呢
蛇由蛇身和眼睛组成<br>
方便起见，蛇身可以看成是由一连串圆形串起来组成。
比如蛇的长度为3，那么蛇身就由三个圆形组成。
蛇的眼睛也可以看成两个小圆形。

## 如何用canvas画圆形

``` javascript
ctx.fillStyle=this.color;
ctx.beginPath();
ctx.arc(x,y,r,0,Math.PI*2);
ctx.fill();
```
其中 **ctx.arc** 这个函数中，前两个参数x,y表示圆心坐标，r表示半径，后面两个参数表示起始角和结束角，要画圆的画直接填 0 和 Math.PI*2 就好了。

## 蛇身

蛇的身体是由多个圆形构成的，并且我们也需要一直维护构成蛇的身体的这些圆形。

在js文件夹下新建一个Cell.js，将下面的代码复制到该文件中
 
``` javascript
export class Cell {
    constructor(r,c)
    {
        this.r=r;
        this.c=c;
        this.x=c+0.5;
        this.y= r+0.5;
    }


}

```

Cell类描述的就是蛇的身体，蛇身就是由一个一个的Cell构成。

## 方向
在贪吃蛇游戏中，蛇有可能朝四个方向移动，当我们绘制一条蛇的时候，我们必须知道蛇此时正在朝哪一个方向前进。这关系着游戏的逻辑和眼睛的正确绘制。
所以，我们需要记录一个蛇此时所朝向的方向。

## 代码

在js文件夹下新建一个Snake.js
将下面的代码复制到该文件中

``` javascript

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
    }
    start()
    {

    }
    update()
    {
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

```

在GameMap.js的constructor函数中添加下面代码
初始化两条蛇
``` javascript
this.snakes=[
    new Snake({id:0,color:"#4876EC",r:this.rows-2,c:1},this),
    new Snake({id:1,color:"#F94848",r:1,c:this.cols-2},this),
];

```

同时在这个文件中引入Snake.js

``` javascript
import { Snake } from "/js/Snake.js";
```

用Live Server打开index.html，蛇就画出来了（目前只有一个蛇头）。

![05.png](https://s2.loli.net/2022/12/03/6zKhbF2YgCR5i74.png)

# 蛇的移动

<p>我们想用键盘输入控制蛇的移动，首先得让canvas实现对键盘输入的监听。
还记得那个tabindex元素吗？就是在这里派上了用场。</p>
<p>在GameMap.js的GameMap类中添加如下函数实现canvas对键盘输入的监听</p>

其中ArrowUp、ArrowRight、ArrowDown、ArrowLeft分别表示键盘上的上右下左方向键。


``` javascript

add_listening_events()
{
    this.ctx.canvas.focus();
    const [snake0,snake1]=this.snakes;
    this.ctx.canvas.addEventListener("keydown",e =>{
        if (e.key === 'w')snake0.set_direction(0);
        else if(e.key=='d')snake0.set_direction(1);
        else if(e.key=='s')snake0.set_direction(2);
        else if(e.key=='a')snake0.set_direction(3);
        else if(e.key=='ArrowUp')snake1.set_direction(0);
        else if(e.key=='ArrowRight')snake1.set_direction(1);
        else if(e.key=='ArrowDown')snake1.set_direction(2);
        else if(e.key=='ArrowLeft')snake1.set_direction(3);
    });
}


```

同时，在Snake.js的类中实现set_direction方法完成对蛇方向的设置

``` javascript

set_direction(d)
{
    this.direction=d;
}
```

对键盘输入的监听应该一开始就执行，所以我们在GameMap的start函数里调用这个方法。这时候start方法应该是这样子
``` javascript

start(){
    for(let i=0;i<1000;i++)//暴力生成地图
    {
        if(this.create_walls())break;
    }
    this.add_listening_events();
    }

```

<p>蛇的移动需要时间，那么我们需要给蛇设置一个**速度**和一个**状态**。</p>
<p>速度用于控制蛇在每两帧之间（两次调用requestAnimationFrame之间）应该移动的距离。</p>
而状态用于表征蛇当前的行为，比如处于移动状态，待机状态还是死亡状态。
在Snake.js的constructor函数中添加下面两行代码

``` javascript
this.speed=5;//蛇的速度
this.status="idle";//idle表示静止,move表示正在移动,die表示死亡
```

接下来，在GameMap中，如果我们发现两条蛇的方向都不是-1（-1是初始设置的方向也是蛇静止时的方向）并且两条蛇都处于静止状态，那么就应该让这两条蛇移动起来。
在GameMap类中添加下面这两个函数

``` javascript

//检查两条蛇的状态，是否准备好移动
check_ready()
{
    for(const snake of this.snakes)
    {
        if(snake.status!=="idle")return false;
        if(snake.direction===-1)return false;
    }
    return true;
}
next_step()//让两条蛇进入下一回合
{
    for(const snake of this.snakes)
    {
        snake.next_step();
    }
}


```
在GameMap类中的update函数里，我们要调用这两个函数，这时候的update函数应该长这样


``` javascript
update(){
    this.update_size();
    if(this.check_ready())
    {
        this.next_step();
    }
    this.render();

}

```

注意到，我们在GameMap类的next_step函数中调用了snake.next_step();
接下来，让我们实现snake的next_step()函数。
在Snake类中添加如下代码
``` javascript

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
```
在这个函数中我们将蛇的状态改为"move"状态，并且新生成一个Cell，代表蛇身体长度增加一个。并且将cells数组全体后移一位，为这个新生成的蛇头空出空间。注意，这个时候我们还没有将这个新生成的Cell加入到cells数组中。


在Snake.js的constructor函数中添加如下内容

``` javascript
this.dr=[-1,0,1,0];
this.dc=[0,1,0,-1];
this.eps=1e-2;

```
这两个数组定义了蛇朝四个方向移动时的x方向和y方向的偏移量<br>
eps则是在判断蛇是否走到目标点时会用到

<p>我们要将蛇从上一个位置移动到目标位置，那么应该知道每一帧在x方向和y方向我们要走多少距离。
当走到目标点后，我们将生成的新蛇头加入到cells数组中</p>
在Snake类中添加下面这个函数

``` javascript
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
        const move_distance=this.speed*this.timedelta/1000;//每两帧之间走过的距离。速度乘以时间，除以100因为this.timedelta单位是毫秒，要换算为秒
        this.cells[0].x+=move_distance*dx/distance;//在x方向走的距离
        this.cells[0].y+=move_distance*dy/distance;//在y方向走到距离，简单的三角函数
    }

}

```

接着，在Snake.js函数的update函数中，我们调用这个update_move函数，这时，update函数应该是这样。注意，move要放在render之前。

``` javascript
update()
{
    if(this.status==='move')
    {
        this.update_move();
    }
    this.render();
}
```

如果不出意外，到这里，你的两条蛇应该就能听你的命令跑起来了。注意，你需要给两条蛇都下达指令后，两条蛇才会行动。只给一条蛇下达指令是不行的。
![2022-12-03 13-07-28.gif](https://s2.loli.net/2022/12/03/ZWrAxC6EbUJso9H.gif)
可以看到，两条蛇虽然动起来了，但是并不是很平滑，还可以继续美化，并且，障碍物也没有起到它应该有的作用。在下一节，我们将对蛇的移动进行美化，并且加上对蛇碰到障碍物的判断。


# 收尾
## 润色蛇的移动
在上一章，蛇虽然动起来了，但是移动的过程却太过粗糙，没有纵享丝滑。
那么该怎么改进呢？
我们现在的蛇，应该是这个样子
![06.png](https://s2.loli.net/2022/12/01/47tnvQTEAJHwxf1.png)

我们可以考虑在每两个圆圈之间画上一个矩形，填补之间的空白
![07.png](https://s2.loli.net/2022/12/01/8NXhVRCTH1Q2sPM.png)

这样，就可以让蛇变得丝滑了。

将下面的代码加入到Snake类当中的render函数中

``` javascript

for(let i=1;i<this.cells.length;i++)
{
    const a=this.cells[i-1],b=this.cells[i];
    if(Math.abs(a.x-b.x)<this.eps&&Math.abs(a.y-b.y)<this.eps)continue;
    if(Math.abs(a.x-b.x)<this.eps)
    {
    ctx.fillRect((a.x-0.4)*L,Math.min(a.y,b.y)*L,L*0.8,Math.abs(a.y-b.y)*L);
    }else{
    ctx.fillRect(Math.min(a.x,b.x)*L,(a.y-0.4)*L,Math.abs(a.x-b.x)*L,L*0.8);
    }
}

```
这段代码中，我们就是完成在每两个圆形之间画上矩形的操作
圆形有横着和竖着两种情况。对应下面这两张图
![08.png](https://s2.loli.net/2022/12/01/gxordjivaGbLUh8.png)

![09.png](https://s2.loli.net/2022/12/01/pdRYXGCZ38VTHoJ.png)


此时，Snake类中的render函数应该是这样的
``` javascript
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
    for(let i=1;i<this.cells.length;i++)
    {
            const a=this.cells[i-1],b=this.cells[i];
            if(Math.abs(a.x-b.x)<this.eps&&Math.abs(a.y-b.y)<this.eps)continue;
            if(Math.abs(a.x-b.x)<this.eps)
            {
            ctx.fillRect((a.x-0.4)*L,Math.min(a.y,b.y)*L,L*0.8,Math.abs(a.y-b.y)*L);
            }else{
            ctx.fillRect(Math.min(a.x,b.x)*L,(a.y-0.4)*L,Math.abs(a.x-b.x)*L,L*0.8);
            }
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

```
这时候，再用LiveServer打开index.html文件，控制蛇移动，就会发现蛇变得顺滑了
![10.png](https://s2.loli.net/2022/12/03/3IGLXRdcg7NT1aF.png)

## 障碍物判断
接下来我们要加入对游戏失败的判断。
如果蛇碰到了障碍物或者自己或者另一条蛇，那么游戏就会结束。

首先，在Snake类的next_step()的最后加入下面的代码。表示检查一下这次移动所去到的目标位置是否合法，如果不合法，把蛇的状态设置为die
``` javascript
if(!this.gamemap.check_valid(this.next_cell))
{
    this.status="die";
}

```
加入之后，next_step()函数应该长这样
``` javascript
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
    if(!this.gamemap.check_valid(this.next_cell))
    {
        this.status="die";
    }
}

```
接着，在Snake的render函数中加入下面的判断，表示如果蛇此时的状态为die，那么蛇的颜色应该变为白色

``` javascript
if(this.status==="die")
{
    ctx.fillStyle="white";
}
```

加完之后，render函数应该长这样
``` javascript
render()
{
    const L=this.gamemap.L;
    const ctx=this.gamemap.ctx;
    ctx.fillStyle=this.color;
    if(this.status==="die")
    {
        ctx.fillStyle="white";
    }
    //绘制蛇的身体
    for(const cell of this.cells)
    {
        ctx.beginPath();
        ctx.arc(cell.x*L,cell.y*L,L/2*0.8,0,Math.PI*2);
        ctx.fill();
    }
    for(let i=1;i<this.cells.length;i++)
    {
            const a=this.cells[i-1],b=this.cells[i];
            if(Math.abs(a.x-b.x)<this.eps&&Math.abs(a.y-b.y)<this.eps)continue;
            if(Math.abs(a.x-b.x)<this.eps)
            {
            ctx.fillRect((a.x-0.4)*L,Math.min(a.y,b.y)*L,L*0.8,Math.abs(a.y-b.y)*L);
            }else{
            ctx.fillRect(Math.min(a.x,b.x)*L,(a.y-0.4)*L,Math.abs(a.x-b.x)*L,L*0.8);
            }
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
```

接下来，在GameMap类中加入下面这个函数，用来判断目标位置的合法性

```
check_valid(cell)//检测目标位置是否合法，没有撞到蛇的身体和墙
{
    for(const wall of this.walls)
    {
        if(wall.r===cell.r && wall.c===cell.c)return false;
    }
    for(const snake of this.snakes)
    {
        let k= snake.cells.length;
        for(let i=0;i<k;i++)
        {
            if(snake.cells[i].r === cell.r && snake.cells[i].c===cell.c)return false;
        }
    }
    return true;
}

```

当完成上面这些操作后，再用live server打开项目，操作蛇去撞墙或者撞蛇，游戏就会结束
![11.png](https://s2.loli.net/2022/12/03/f8kbULMowSny362.png)

## 蛇的长度
<p>我们发现，蛇的长度在每一个回合都会增加，能不能控制一下，让蛇的长度每三个回合增加一次呢？</p>
我们只需要记录一下回合数，然后在每个回合判断当前回合是否需要增加蛇的长度，如果不增加，那么就要将蛇尾也移动（我们之前的逻辑只会移动蛇头）

在Snake类的constructor函数中加入step变量，用来记录回合数
``` javascript
this.step=0;//回合数
```
同时，在Snake类中的next_step()函数中更新step的值

``` javascript
this.step++;
```

在Snake类中添加下面这个函数，判断蛇的长度是否增加
``` javascript
check_tail_increasing(){//检测当前回合，蛇的长度是否增加
    if(this.step%3===1) return true;
    return false;
    }
```
在Snake类中的update_move函数中，添加两个判断，用来处理蛇尾移动的情况

``` javascript

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
        //如果蛇不变长，就砍掉蛇尾
        if(!this.check_tail_increasing())
        {
            this.cells.pop();
        }
        
    }else{
        const move_distance=this.speed*this.timedelta/1000;//每两帧之间走过的距离
        this.cells[0].x+=move_distance*dx/distance;
        this.cells[0].y+=move_distance*dy/distance;
        //如果蛇不变长，就要让蛇尾像蛇头一样移动起来
        if(!this.check_tail_increasing())
        {
            const k=this.cells.length;
            const tail=this.cells[k-1],tail_target=this.cells[k-2];
            const tail_dx=tail_target.x-tail.x;
            const tail_dy=tail_target.y-tail.y;
            tail.x+=move_distance*tail_dx/distance;
            tail.y+=move_distance*tail_dy/distance;
        }
    }

}
```
在GameMap类的check_valid函数中添加跟蛇尾有关的判断，当蛇尾会移动时，不应该在判断障碍物的时候也判断蛇尾，因为蛇尾现在所在的位置在移动完之后就没有东西了，就不存在障碍物一说。

``` javascript
check_valid(cell)//检测目标位置是否合法，没有撞到蛇的身体和墙
{
    for(const wall of this.walls)
    {
        if(wall.r===cell.r && wall.c===cell.c)return false;
    }
    for(const snake of this.snakes)
    {
        let k= snake.cells.length;
        if(!snake.check_tail_increasing())//当蛇尾会前进的时候，蛇尾就不用判断
        {
            k--;
        }
        for(let i=0;i<k;i++)
        {
            if(snake.cells[i].r === cell.r && snake.cells[i].c===cell.c)return false;
        }
    }
    return true;
}
```
到这里为止，我们的简易贪吃蛇就实现完成了
![2022-12-03 13-12-54.gif](https://s2.loli.net/2022/12/03/zhi4C351jN6fwO8.gif)
