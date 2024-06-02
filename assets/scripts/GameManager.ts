declare const firebase: any;

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

    user = null;
    roomId = null;
    rivalId = null;
    rivalName = null;

    gameStart: boolean = false;
    alliance_arr: cc.Node[] = [];
    enemy_arr: cc.Node[] = [];

    onLoad () {
        this.user = firebase.auth().currentUser;
        cc.director.getPhysicsManager().enabled = true;

        // 看碰撞體
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     // cc.PhysicsManager.DrawBits.e_pairBit |
        //     // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        //     ;
    }
    listen1() {
        console.debug("RoomID: ", this.roomId, ' rivalID: ', this.rivalId, 'rivalName: ', this.rivalName)
        firebase.database().ref('Rooms/' + this.roomId + '/' + this.rivalId).on('child_added', snapshot => {
            if(!this.gameStart) return;
            let message = snapshot.val();
            let type = Object.keys(message)[0];
            let id = Object.values(message)[0];
            let time: number = Object.values(message)[1] as number;
            console.log('Enemy: ', type, ' time: ', time);
            if(type === 'minion'){
                if(id === 1){
                    this.scheduleOnce(() => {
                        this.HeavyBanditEnemy();
                    }, ((time+500)-Date.now())/1000);
                }
            }
            
            
        })

        firebase.database().ref('Rooms/' + this.roomId + '/' + this.user.uid).on('child_added', snapshot => {
            if(!this.gameStart) return;
            let message = snapshot.val();
            let type = Object.keys(message)[0];
            let id = Object.values(message)[0];
            let time: number = Object.values(message)[1] as number;
            console.log('Enemy: ', type, ' time: ', time);
            if(type === 'minion'){
                if(id === 1){
                    this.scheduleOnce(() => {
                        this.HeavyBandit();
                    }, ((time+500)-Date.now())/1000);
                }
            }
            
            
        })

        if(!this.gameStart){
            this.gameStart = true;
            cc.find('ColorBlack').active = false;
            cc.find('btn1').active = true;
            cc.find('btn4').active = true;
        }
    }
    listen2() {
        console.debug("RoomID: ", this.roomId, ' rivalID: ', this.rivalId, 'rivalName: ', this.rivalName)
        firebase.database().ref('Rooms/' + this.roomId + '/' + this.rivalId).on('child_added', snapshot => {
            if(!this.gameStart) return;
            let message = snapshot.val();
            let type = Object.keys(message)[0];
            let id = Object.values(message)[0];
            let time: number = Object.values(message)[1] as number;
            console.log('Enemy: ', type, ' time: ', time);
            if(type === 'minion'){
                if(id === 1){
                    this.scheduleOnce(() => {
                        this.HeavyBanditEnemy();
                    }, ((time+500)-Date.now())/1000);
                }
            }
            
            
        })

        firebase.database().ref('Rooms/' + this.roomId + '/' + this.user.uid).on('child_added', snapshot => {
            if(!this.gameStart) return;
            let message = snapshot.val();
            let type = Object.keys(message)[0];
            let id = Object.values(message)[0];
            let time: number = Object.values(message)[1] as number;
            console.log('Enemy: ', type, ' time: ', time);
            if(type === 'minion'){
                if(id === 1){
                    this.scheduleOnce(() => {
                        this.HeavyBandit();
                    }, ((time+500)-Date.now())/1000);
                }
            }
            
            
        })
        const gameStartListener = firebase.database().ref('Rooms/' + this.roomId + '/' + this.rivalId).on('child_changed', snapshot => {
            let message = snapshot.val();
            console.log('change: ', message)
            if(message === 'enter'){
               this.gameStart = true;
               cc.find('ColorBlack').active = false;
               cc.find('btn1').active = true;
               cc.find('btn4').active = true;
               firebase.database().ref('Rooms/' + this.roomId + '/' + this.rivalId).on('child_changed', gameStartListener)
            }        
            
        })

        // if(!this.gameStart){
            // cc.find('ColorBlack').active = false;
            // cc.find('btn1').active = true;
            // cc.find('btn4').active = true;
        // }
    }
    start() {
        firebase.database().ref('WaitingPlayer/').once('value').then(async(snapshot) => {
            if(snapshot){ 
                let waitingPlayer = snapshot.val();
                let userID = this.user.uid;
                let userName = this.user.displayName;
                if(waitingPlayer){ // 成功匹配
                    this.rivalId = Object.keys(waitingPlayer)[0];
                    this.rivalName = Object.values(Object.values(waitingPlayer)[0])[0];
                    // console.debug(this.rivalId, this.rivalName)
                    
                    let updates = {}; // 建立對戰房間
                    updates[this.rivalId] = {rivalName: this.rivalName, status: 'waiting'};
                    updates[userID] = {userName: userName};

                    this.roomId = (this.rivalId + this.user.uid);

                    // cc.find('Persist').getComponent('Persist').player = 'A';
                    // cc.find('Persist').getComponent('Persist').roomId = roomId;
                    // cc.find('Persist').getComponent('Persist').rivalId = rivalId;

                    await firebase.database().ref('Rooms/' + this.roomId).set(updates);
                    this.listen2();
                    await firebase.database().ref('WaitingPlayer/' + this.rivalId).remove(); // 從等待列表移除

                }
                else{ // 沒人在等
                    firebase.database().ref('WaitingPlayer/' + userID).set({
                        userName: userName
                    });
                    cc.find('Persist').getComponent('Persist').player = 'A';
                    console.debug("Waiting...");

                    //TODO: 監聽Rooms, 若讀到自己的userID, change the status to 'enter'
                    const matchingListener = firebase.database().ref('Rooms').on('value', async snapshot => {
                        // firebase.database().ref('Rooms/').once('value').then(async(snapshot) => {
                        const roomData = snapshot.val();
                        if(roomData){
                            for(let [key, value] of Object.entries(roomData)){
                                console.debug(Object.keys(value)[0], Object.keys(value)[1]);
                                if(Object.keys(value)[0] === userID){
                                    this.roomId = key;
                                    this.rivalId = Object.keys(value)[1];
                                    this.rivalName = Object.values(Object.values(value)[0])[0];
                                    await firebase.database().ref('Rooms').off('value', matchingListener);
                                    this.scheduleOnce(async () => {
                                        await firebase.database().ref('Rooms/' + key + '/' + userID).update({
                                            status: 'enter'
                                        });    
                                        this.listen1();
                                    }, 1);
                                    break;
                                }
                                else if(Object.keys(value)[1] === userID){
                                    this.roomId = key;
                                    this.rivalId = Object.keys(value)[0];
                                    this.rivalName = Object.values(Object.values(value)[0])[0];
                                    await firebase.database().ref('Rooms').off('value', matchingListener);
                                    this.scheduleOnce(async () => {
                                        await firebase.database().ref('Rooms/' + key + '/' + userID).update({
                                            status: 'enter'
                                        });    
                                        this.listen1();
                                    }, 1);
                                    break;
                                }
                            }
                        }
                    })
                }   
            }
        }).catch((error) => {
            console.error("Error reading database:", error);
        })
    }
    update(dt: number): void { // 清理array
        if(!this.gameStart){
            return;
        }
        else{

            for(let i of this.alliance_arr) {
                i.getComponent(Info).injure();
            }
            for(let i of this.enemy_arr) {
                i.getComponent(Info).injure();
            }
            this.alliance_arr = this.alliance_arr.filter(alliance => alliance.getComponent(Info).dead !== true);
            this.enemy_arr = this.enemy_arr.filter(enemy => enemy.getComponent(Info).dead !== true);    
        }
    }

    async cancelBtn(){
        await firebase.database().ref('WaitingPlayer/' + this.user.uid).remove();
        cc.director.loadScene('Menu');
    }

    async HeavyBanditBtn(){
        await firebase.database().ref('Rooms/' + this.roomId + '/' + this.user.uid).push({
            minion: 1,
            timeStamp: Date.now()
        });
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
