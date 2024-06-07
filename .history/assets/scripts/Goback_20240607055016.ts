const {ccclass, property} = cc._decorator;

@ccclass
export default class Goback extends cc.Component
{


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // add win music to the scene
    // @property(cc.AudioClip)
    // win: cc.AudioClip = null;

    // // add lose music to the scene
    // @property(cc.AudioClip)
    // lose: cc.AudioClip = null;

    start () {

    }

    // update (dt) {}

    back2menu()
    {
        // stop music
        cc.audioEngine.stopMusic();
        cc.director.loadScene("Menu");
    }
}
