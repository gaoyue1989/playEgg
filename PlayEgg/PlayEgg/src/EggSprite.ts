

/**
* Egg 实体类
*/
class EggSprite extends egret.Sprite
{
    constructor()
    {
        super();
        this.addChild(this.createEgg());
    }

    /// 水平方向速度
    public speedX: number = 0;
    /// 垂直方向速度
    public speedY: number = 0;

    /// 目标位置
    public tagetPoint:Point;

    public updateEggState(egg: EggSprite): void
    {
        this.speedX = egg.speedX;
        this.speedY = egg.speedY;
        this.tagetPoint = egg.tagetPoint;
    }

    ///创建鸡蛋
    public createEgg(x: number = 50, y: number = 30, r: number = 15, color: number = 0xfffddd)
    {
        var spr: egret.Sprite = new egret.Sprite();
        spr.graphics.beginFill(color);
        spr.graphics.drawCircle(x, y, r);
        spr.graphics.endFill();
        return spr;
    }

    /// 鸡蛋动画
    public eggTween(tempEgg: EggSprite)
    {
        var tw: egret.Tween = egret.Tween.get(tempEgg);
        tw.to({
            x:tempEgg.tagetPoint.x,y:tempEgg.tagetPoint.y },5000);
    }
}




class Point
{
    public x: number = 0;
    public y: number = 0;

}