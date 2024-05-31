import Info from "./Info";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Prefab)
    heavyBandit: cc.Prefab = null;
    @property(cc.Prefab)
    heavyBanditEnemy: cc.Prefab = null;
    @property(cc.Prefab)
    kunoichiEnemy: cc.Prefab = null;
    @property(cc.Prefab)
    kunoichi: cc.Prefab = null;

    alliance_arr: cc.Node[] = [];
    enemy_arr: cc.Node[] = [];

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;

        // 看碰撞體
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     // cc.PhysicsManager.DrawBits.e_pairBit |
        //     // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        //     ;
    }
    start() {
        //
    }
    update(dt: number): void { // 清理array
        for(let i of this.alliance_arr) {
            i.getComponent(Info).injure();
        }
        for(let i of this.enemy_arr) {
            i.getComponent(Info).injure();
        }
        this.alliance_arr = this.alliance_arr.filter(alliance => alliance.getComponent(Info).dead !== true);
        this.enemy_arr = this.enemy_arr.filter(enemy => enemy.getComponent(Info).dead !== true);    
    }

    HeavyBandit() {
        let tmp = cc.instantiate(this.heavyBandit);
        tmp.setParent(cc.director.getScene());
        tmp.x = 900;
        tmp.y = 145;

        this.alliance_arr.push(tmp);
    }
    HeavyBanditEnemy() {
        let tmp = cc.instantiate(this.heavyBanditEnemy);
        tmp.setParent(cc.director.getScene());
        tmp.x = 40;
        tmp.y = 145;

        this.enemy_arr.push(tmp);
    }

    KunoichiEnemy() {
        let tmp = cc.instantiate(this.kunoichiEnemy);
        tmp.setParent(cc.director.getScene());
        tmp.x = 40;
        tmp.y = 145;

        this.enemy_arr.push(tmp);
    }

    Kunoichi() {
        let tmp = cc.instantiate(this.kunoichi);
        tmp.setParent(cc.director.getScene());
        tmp.x = 900;
        tmp.y = 145;

        this.alliance_arr.push(tmp);
    }
}
