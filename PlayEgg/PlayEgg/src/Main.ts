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


    private p1: Point = { x: 100, y: 300};
    private p2: Point = { x: 300, y: 0 };
    private p3: Point = { x: 300, y: 300 };
    private p4: Point = { x: 500, y: 600 };
    private ball: EggSprite;
    private onButtonClick(event: egret.TouchEvent): void
    {
        //游戏开始事件
        var btn: egret.gui.Button = event.target;
        btn.visible = false;

        var egg: EggSprite = new EggSprite();
        this.addChild(egg);
        this.ball = egg;
        egg.tagetPoint = {x: 
        100, y:
        100
        };
        //this.p1.x = 100
        //this.p1.y = 100
        //this.p2.x = 300
        //this.p2.y = 600
        //this.p3.x = 500
        //this.p3.y = 100
        //this.p4.x = 700
        //this.p4.y = 600
        egret.Tween.get(this).to({ factor: 1 }, 7000);
        // egg.eggTween(egg);
    }
    public get factor(): number {
        return 0;
    }

    ///二次贝塞尔曲线
    public set factor(value: number) {
        this.ball.x = (1 - value) * (1 - value) * this.p1.x + 2 * value * (1 - value) * this.p2.x + value * value * this.p3.x;
        this.ball.y = (1 - value) * (1 - value) * this.p1.y + 2 * value * (1 - value) * this.p2.y + value * value * this.p3.y;
    }
    ///三次贝塞尔曲线
    public set factor1(value: number) {
        this.ball.x = (1 - value) * (1 - value) * (1 - value) * this.p1.x + 3 * value * (1 - value) * (1 - value) * this.p2.x + 2 * value * value * (1 - value) * this.p3.x + value * value * value * this.p4.x;
        this.ball.y = (1 - value) * (1 - value) * (1 - value) * this.p1.y + 3 * value * (1 - value) * (1 - value) * this.p2.y + 2 * value * value * (1 - value) * this.p3.y + value * value * value * this.p4.y;
    }


}


