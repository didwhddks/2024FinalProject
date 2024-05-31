const {ccclass, property} = cc._decorator;

@ccclass
export default class Info extends cc.Component {

    @property(cc.SpriteFrame)
    dieFrame: cc.SpriteFrame = null;

    life: number = 100
    dead: boolean = false;

    getDamage: number= 0;

    die() {
        this.getComponent(cc.Animation).stop();
        this.getComponent(cc.PhysicsBoxCollider).enabled = false;
        this.getComponent(cc.RigidBody).gravityScale = 0;
        if(this.dieFrame){ // 無死亡動畫
            this.getComponent(cc.Sprite).spriteFrame = this.dieFrame;
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.5);
        }
        else { // 有死亡動畫
            this.getComponent(cc.Animation).play('dead');
        }
    }

    injure() {
        if(this.dead) return;

        this.life -= this.getDamage;
        this.getDamage = 0;
        this.node.children[0].getComponent(cc.Label).string = this.life.toString();
        if(this.life <= 0){
            this.dead = true;
            this.scheduleOnce(() => {
                this.die();
            }, 0);
        }
    }
}