/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */




class Main extends egret.DisplayObjectContainer
{

    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;

    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event)
    {
        //inject the custom material parser
        //注入自定义的素材解析器
        egret.Injector.mapClass("egret.gui.IAssetAdapter", AssetAdapter);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        egret.gui.Theme.load("resource/theme.thm");
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * Loading of configuration file is complete, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void
    {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void
    {
        if (event.groupName == "preload")
        {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createScene();
        }
    }
    /**
    * 资源组加载出错
     * Resource group loading failed
    */
    private onResourceLoadError(event: RES.ResourceEvent): void
    {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void
    {
        if (event.groupName == "preload")
        {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private gameLayer: egret.DisplayObjectContainer;

    private guiLayer: egret.gui.UIStage;
    /**
     * 创建场景界面
     * Create scene interface
     */
    private createScene(): void
    {

        //游戏场景层，游戏场景相关内容可以放在这里面。
        //Game scene layer, the game content related to the scene can be placed inside this layer.
        this.gameLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameLayer);
        var bitmap: egret.Bitmap = new egret.Bitmap();
        bitmap.texture = RES.getRes("bgImage");
        this.gameLayer.addChild(bitmap);

        //GUI的组件必须都在这个容器内部,UIStage会始终自动保持跟舞台一样大小。
        //GUI components must be within the container, UIStage will always remain the same as stage size automatically.
        this.guiLayer = new egret.gui.UIStage();
        this.addChild(this.guiLayer);

        var button: egret.gui.Button = new egret.gui.Button();
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        button.label = "开始游戏";
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        //在GUI范围内一律使用addElement等方法替代addChild等方法。
        //Within GUI scope, addChild methods should be replaced by addElement methods.
        this.guiLayer.addElement(button);



    }

    private factor: number = 50;

    private ball: EggSprite;




    private onButtonClick(event: egret.TouchEvent): void
    {
        //游戏开始事件
        var btn: egret.gui.Button = event.target;
        btn.visible = false;

        // 测试使用物理引擎 P2
        //创建world

        egret.Profiler.getInstance().run();

        //var world: p2.World = new p2.World();
        //world.sleepMode = p2.World.BODY_SLEEPING;


        ////////创建plane
        //var planeShape: p2.Plane = new p2.Plane();
        //var planeBody: p2.Body = new p2.Body();
        //planeBody.addShape(planeShape);
        //planeBody.displays = [];
        //world.addBody(planeBody);

        this.ball = new EggSprite();
        this.addChild(this.ball);

        //  鸡蛋的动画已经实现了，每次到达目的地后重新计算下一次目的地
        var tm: egret.Timer = new egret.Timer(900);
        tm.addEventListener(egret.TimerEvent.TIMER, (e) =>
        {
            var x: number = Math.random() * 700+ 50;
            var y: number = Math.random() * 400 + 30;
            this.ball.tagetPoint = { x: x, y: y };
            this.ball.eggTween(this.ball);
        }, this);
        tm.start();
    }




//    egret.Ticker.getInstance().register((dt) =>
    //    {
    //        if (dt < 5000)
    //        {
    //            return;
    //        }
    //        if (dt > 10000)
    //        {
    //            return;
    //        }
    //        //world.step(dt / 1000);
    //    }, this);

    //    //this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,(e) =>
    //    //{
    //    //    this.addOneBox(world, e);
    //    //}, this);

    //    // 注册 物体监听事件

    //    this.stage.addEventListener(egret.Event.ENTER_FRAME, (e) =>
    //    {
    //        this.eggTweenHander(e);
    //    }, this);
    //}






    private eggTweenHander(evt: egret.Event):void
    {
        var x: number = Math.random() * 200 + 100;
        var y: number = Math.random() * 300 + 50;
        this.ball.tagetPoint = { x: x, y: y };
        this.ball.eggTween(this.ball);
    }




    private addOneBox(world: p2.World, e: egret.TouchEvent): void
    {
        var self = this;
        var display: egret.DisplayObject;
        var boxBody: p2.Body;
        var boxShape: p2.Circle;
        var positionX: number = Math.floor(e.stageX / this.factor);
        var positionY: number = Math.floor((egret.MainContext.instance.stage.stageHeight - e.stageY) / this.factor);
       
        
            //添加圆形刚体
            boxShape= new p2.Circle(1);
            boxBody= new p2.Body({ mass: 1, position: [positionX, positionY] });
            boxBody.addShape(boxShape);
            world.addBody(boxBody);
            display= self.createBitmapByName("circle");
            display.width = (<p2.Circle>boxShape).radius * 2 * this.factor;
            display.height = (<p2.Circle>boxShape).radius * 2 * this.factor;
      


        display.anchorX = display.anchorY = .5;
        boxBody.displays = [display];
        self.addChild(display);

    }




    //public get factor(): number {
    //    return 0;
    //}

    /////二次贝塞尔曲线
    //public set factor(value: number) {
    //    this.ball.x = (1 - value) * (1 - value) * this.p1.x + 2 * value * (1 - value) * this.p2.x + value * value * this.p3.x;
    //    this.ball.y = (1 - value) * (1 - value) * this.p1.y + 2 * value * (1 - value) * this.p2.y + value * value * this.p3.y;
    //}
    /////三次贝塞尔曲线
    //public set factor1(value: number) {
    //    this.ball.x = (1 - value) * (1 - value) * (1 - value) * this.p1.x + 3 * value * (1 - value) * (1 - value) * this.p2.x + 2 * value * value * (1 - value) * this.p3.x + value * value * value * this.p4.x;
    //    this.ball.y = (1 - value) * (1 - value) * (1 - value) * this.p1.y + 3 * value * (1 - value) * (1 - value) * this.p2.y + 2 * value * value * (1 - value) * this.p3.y + value * value * value * this.p4.y;
    //}


    /**
* debug模式，使用图形绘制
*/
    private debug(world: p2.World): void
    {
        var factor: number = 50;
        var canvas: HTMLCanvasElement = document.createElement("canvas");
        var stage: egret.Stage = egret.MainContext.instance.stage;
        var stageWidth: number = stage.stageWidth;
        var stageHeight: number = stage.stageHeight;
        canvas.width = stageWidth;
        canvas.height = stageHeight;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(" + 255 + "," + 255 + "," + 0 + "," + 1 + ")";
        ctx.strokeStyle = "rgba(" + 255 + "," + 0 + "," + 0 + "," + 1 + ")";
        ctx.lineWidth = 1;
        var rendererContext = egret.MainContext.instance.rendererContext;
        var f = rendererContext.onRenderFinish;
        rendererContext.onRenderFinish = function ()
        {
            ctx.clearRect(0, 0, stageWidth, stageHeight);
            var l: number = world.bodies.length;
            for (var i: number = 0; i < l; i++)
            {
                var boxBody: p2.Body = world.bodies[i];
                if (boxBody.sleepState == p2.Body.SLEEPING)
                {
                    ctx.globalAlpha = 0.5;
                }
                else
                {
                    ctx.globalAlpha = 1;
                }
                for (var j: number = 0; j < boxBody.shapes.length; j++)
                {
                    var boxShape: p2.Shape = boxBody.shapes[j];
                    if (boxShape instanceof p2.Rectangle)
                    {
                        var x: number = (boxBody.position[0] + +boxBody.shapeOffsets[j][0]) * factor;
                        var y: number = stageHeight - (boxBody.position[1] + +boxBody.shapeOffsets[j][1]) * factor;
                        var w: number = (<p2.Rectangle>boxShape).width * factor;
                        var h: number = (<p2.Rectangle>boxShape).height * factor;
                        var matrix: egret.Matrix = egret.Matrix.identity.identity();
                        matrix.prependTransform(x, y, 1, 1, 360 - boxBody.angle * 180 / Math.PI, 0, 0, 0, 0);
                        ctx.save();
                        ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                        ctx.beginPath();
                        ctx.rect(-(<p2.Rectangle>boxShape).width / 2 * factor, -(<p2.Rectangle>boxShape).height / 2 * factor, w, h);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                    else if (boxShape instanceof p2.Plane)
                    {
                        ctx.save();
                        ctx.setTransform(1, 0, 0, 1, 0, stageHeight - (boxBody.position[1] + boxBody.shapeOffsets[j][1]) * factor);
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(stageWidth, 0);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.restore();
                    }
                    else if (boxShape instanceof p2.Circle)
                    {
                        var x: number = (boxBody.position[0] + boxBody.shapeOffsets[j][0]) * factor;
                        var y: number = stageHeight - (boxBody.position[1] + boxBody.shapeOffsets[j][1]) * factor;
                        var matrix: egret.Matrix = egret.Matrix.identity.identity();
                        matrix.prependTransform(x, y, 1, 1, 360 - boxBody.angle * 180 / Math.PI, 0, 0, 0, 0);
                        ctx.save();
                        ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                        ctx.beginPath();
                        ctx.arc(0, 0,(<p2.Circle>boxShape).radius * factor, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                }
            }
            rendererContext["_cacheCanvasContext"].drawImage(canvas, 0, 0, stageWidth, stageHeight, 0, 0, stageWidth, stageHeight);
            f.call(rendererContext);
        };
    }
    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    */
    private createBitmapByName(name: string): egret.Bitmap
    {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }


}





