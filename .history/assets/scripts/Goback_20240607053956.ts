const {ccclass, property} = cc._decorator;

@ccclass
export default class Goback extends cc.Component
{


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // add win music to the scene
    @property(cc.AudioClip)
    win: cc.AudioClip = null;

    // add lose music to the scene
    @property(cc.AudioClip)
    lose: cc.AudioClip = null;

    start () {
        // play win music
        cc.audioEngine.playMusic(this.win, true);
        // play lose music
        cc.audioEngine.playMusic(this.lose, true);
    }

    // update (dt) {}

    back2menu()
    {
        cc.director.loadScene("Menu");
    }
}
