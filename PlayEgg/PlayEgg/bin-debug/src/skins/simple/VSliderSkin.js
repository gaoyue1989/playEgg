var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var VSliderSkin = (function (_super) {
            __extends(VSliderSkin, _super);
            function VSliderSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["minHeight", "minWidth"], [13, 13]);
                this.elementsContent = [this.track_i(), this.trackHighlight_i(), this.thumb_i()];
                this.states = [
                    new egret.gui.State("normal", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            Object.defineProperty(VSliderSkin.prototype, "skinParts", {
                get: function () {
                    return VSliderSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            VSliderSkin.prototype.thumb_i = function () {
                var t = new egret.gui.Button();
                this.thumb = t;
                this.__s(t, ["height", "horizontalCenter", "skinName", "width"], [24, 0, skins.simple.VSliderThumbSkin, 24]);
                return t;
            };
            VSliderSkin.prototype.trackHighlight_i = function () {
                var t = new egret.gui.UIAsset();
                this.trackHighlight = t;
                this.__s(t, ["horizontalCenter", "source", "width"], [0, "vslider_fill_png", 10]);
                return t;
            };
            VSliderSkin.prototype.track_i = function () {
                var t = new egret.gui.UIAsset();
                this.track = t;
                this.__s(t, ["percentHeight", "horizontalCenter", "source", "width"], [100, 0, "vslider_track_png", 10]);
                return t;
            };
            VSliderSkin._skinParts = ["track", "trackHighlight", "thumb"];
            return VSliderSkin;
        })(egret.gui.Skin);
        simple.VSliderSkin = VSliderSkin;
        VSliderSkin.prototype.__class__ = "skins.simple.VSliderSkin";
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
//# sourceMappingURL=VSliderSkin.js.map