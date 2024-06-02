const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    user = null;
    roomId: number = null;
    rivalId: number = null;
    player: string = null;

    start(){
        cc.game.addPersistRootNode(this.node);
    }

}
