const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
    // add bgm to the scene
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }

    // update (dt) {}
}
