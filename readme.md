# 开发环境（vscode）
如果有自己喜欢的开发环境，请跳过这一节
## 安装vscode
地址：[vscode官网](https://code.visualstudio.com/)
## 在vscode上安装插件Live Server
![屏幕截图 2022-11-30 134308.png](https://s2.loli.net/2022/11/30/j3SmN9TgqtR8Ewf.png)
完成！接下来就可以开始贪吃蛇的开发了。
# 准备工作
新建一个文件夹，起一个你喜欢的名字，标志项目的开始<br>
新建一个html文件，起名index.html<br>
将下面的代码块中的内容复制到index.html文件中
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
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
            <canvas ref="canvas" tabindex="0"></canvas>
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
canvas标签中使用的tabindex元素能够帮助我们实现元素聚焦，使得canvas能够监听键盘输入，从而控制游戏的运行。
## 游戏元素
<p>在贪吃蛇游戏中，我们需要管理很多游戏元素，比如地图，蛇，障碍物等等。我们可以创建一个统一的类GameObject来管理这些元素。</p>
新建一个文件夹js,用来存放所有用到的js文件,在该文件夹下创建一个名为GameObject.js的文件,将下列代码复制到该文件中

```
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
在代码中，我们声明了一个名为GameObject的类，我们将用这个类去管理所有游戏中的元素。
在游戏中，每一个物体都有创建，更新，以及销毁这样几个阶段，俗称生命周期。体现为start()、update()、on_destory()、destory()函数。一般start和destory相关的函数只会被调用一次，而update函数却会被调用多次。
