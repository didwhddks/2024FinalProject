const {ccclass, property} = cc._decorator;

@ccclass
export default class Goback extends cc.Component
{


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // add win mus

    start () {

    }

    // update (dt) {}

    back2menu()
    {
        cc.director.loadScene("Menu");
    }
}
