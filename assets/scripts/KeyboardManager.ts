const {ccclass, property} = cc._decorator;

@ccclass
export default class KeyboardManager extends cc.Component {

    @property(cc.Node)
    camera: cc.Node = null;

    x_vel = 0;

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
            if(event.keyCode === cc.macro.KEY.d || event.keyCode === cc.macro.KEY.right){
                // this.input = 'd';
                this.x_vel = 30;
            }
            else if(event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.left){
                // this.input = 'd';
                this.x_vel = -30;
            }
        })

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (event) => {
            if(event.keyCode === cc.macro.KEY.d || event.keyCode === cc.macro.KEY.right){
                // this.input = null;
                this.x_vel = 0;
            }
            else if(event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.left){
                // this.input = 'd';
                this.x_vel = 0;
            }
        })
    }

    update (dt) {
        this.camera.x += this.x_vel;
        if(this.camera.x >= 760) this.camera.x = 760;
        if(this.camera.x <= -750) this.camera.x = -750;
    }
}
