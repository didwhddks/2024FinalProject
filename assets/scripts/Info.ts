declare const firebase: any;

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Info extends cc.Component {

    @property(cc.SpriteFrame)
    dieFrame: cc.SpriteFrame = null;

    @property(GameManager)
    gameManager: GameManager = null;

    life: number = 100
    dead: boolean = false;

    getDamage: number= 0;

    index: number = 0;

    start () {
        this.gameManager = cc.find('GameManager').getComponent(GameManager);
    }

    die() {
        this.dead = true;
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

    async injure() {
        if(this.dead) return;

        this.life -= this.getDamage;
        this.getDamage = 0;
        this.node.children[0].getComponent(cc.Label).string = this.life.toString();
        if(this.life <= 0){
            this.dead = true;
            if(!this.gameManager.invincible){
                await firebase.database().ref('Rooms/' + this.gameManager.roomId + '/' + this.gameManager.user.uid).push({
                    minion: 1,
                    timeStamp: Date.now(),
                    index: this.index,
                    mode: 'die'
                });
            }
            // this.scheduleOnce(() => {
            //     this.die();
            // }, 0);
        }
    }
}