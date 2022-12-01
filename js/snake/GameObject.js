const GAME_OBJECTS = [];
export class GameObject {
    constructor()
    {
        GAME_OBJECTS.push(this);//将元素放入数组
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
        for (let i in GAME_OBJECTS)//将元素从数组中移除
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
let last_timestamp;//上一个时间戳
const step = timestamp =>{
    //timestamp为当前时间戳
    for(let obj of GAME_OBJECTS)
    {
        if(!obj.has_called_start)//如果该元素还没有执行start函数
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