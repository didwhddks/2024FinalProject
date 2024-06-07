const {ccclass, property} = cc._decorator;

@ccclass
export default class Goback extends cc.Component
{


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // add win music to the scene
    @property(cc.AudioClip)
    win: cc.AudioClip = null;

    // add lose 

    start () {

    }

    // update (dt) {}

    back2menu()
    {
        cc.director.loadScene("Menu");
    }
}
