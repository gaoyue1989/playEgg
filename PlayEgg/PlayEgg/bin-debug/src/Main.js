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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.p1 = { x: 100, y: 300 };
        this.p2 = { x: 300, y: 0 };
        this.p3 = { x: 300, y: 300 };
        this.p4 = { x: 500, y: 600 };
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    Main.prototype.onAddToStage = function (event) {
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
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * Loading of configuration file is complete, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createScene();
        }
    };
    /**
    * 资源组加载出错
     * Resource group loading failed
    */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.createScene = function () {
        //游戏场景层，游戏场景相关内容可以放在这里面。
        //Game scene layer, the game content related to the scene can be placed inside this layer.
        this.gameLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameLayer);
        var bitmap = new egret.Bitmap();
        bitmap.texture = RES.getRes("bgImage");
        this.gameLayer.addChild(bitmap);
        //GUI的组件必须都在这个容器内部,UIStage会始终自动保持跟舞台一样大小。
        //GUI components must be within the container, UIStage will always remain the same as stage size automatically.
        this.guiLayer = new egret.gui.UIStage();
        this.addChild(this.guiLayer);
        var button = new egret.gui.Button();
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        button.label = "开始游戏";
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        //在GUI范围内一律使用addElement等方法替代addChild等方法。
        //Within GUI scope, addChild methods should be replaced by addElement methods.
        this.guiLayer.addElement(button);
    };
    Main.prototype.onButtonClick = function (event) {
        //游戏开始事件
        var btn = event.target;
        btn.visible = false;
        var egg = new EggSprite();
        this.addChild(egg);
        this.ball = egg;
        egg.tagetPoint = { x: 100, y: 100 };
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
    };
    Object.defineProperty(Main.prototype, "factor", {
        get: function () {
            return 0;
        },
        ///二次贝塞尔曲线
        set: function (value) {
            this.ball.x = (1 - value) * (1 - value) * this.p1.x + 2 * value * (1 - value) * this.p2.x + value * value * this.p3.x;
            this.ball.y = (1 - value) * (1 - value) * this.p1.y + 2 * value * (1 - value) * this.p2.y + value * value * this.p3.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "factor1", {
        ///三次贝塞尔曲线
        set: function (value) {
            this.ball.x = (1 - value) * (1 - value) * (1 - value) * this.p1.x + 3 * value * (1 - value) * (1 - value) * this.p2.x + 2 * value * value * (1 - value) * this.p3.x + value * value * value * this.p4.x;
            this.ball.y = (1 - value) * (1 - value) * (1 - value) * this.p1.y + 3 * value * (1 - value) * (1 - value) * this.p2.y + 2 * value * value * (1 - value) * this.p3.y + value * value * value * this.p4.y;
        },
        enumerable: true,
        configurable: true
    });
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
//# sourceMappingURL=Main.js.map