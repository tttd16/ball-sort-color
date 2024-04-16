// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        balls: {
            default: [],
            type: cc.SpriteFrame
        },
        type: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart() {
        // cc.tween(this.node).to(1, {position: cc.v2(-100, 100)}).start();
    },

    start () {
        this.node.getComponent(cc.Sprite).spriteFrame = this.balls[this.type];
        this.node.getComponent(cc.Sprite).node.setContentSize(cc.size(100, 100));
    },

    // update (dt) {},
});


