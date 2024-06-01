declare const firebase: any;

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    user = null;
    start () {
        this.user = firebase.auth().currentUser;
    }

    // update (dt) {}

    async StartMatching() {
        firebase.database().ref('WaitingPlayer/').once('value').then(async(snapshot) => {
            if(snapshot){ 
                let waitingPlayer = snapshot.val();
                let userID = this.user.uid;
                let userName = this.user.displayName;
                if(waitingPlayer){ // 成功匹配
                    let rivalId = Object.keys(waitingPlayer)[0];
                    let rivalName = Object.values(Object.values(waitingPlayer)[0])[0];
                    console.debug(rivalId, rivalName)
                    
                    let updates = {}; // 建立對戰房間
                    updates[rivalId] = {rivalName: rivalName, status: 'waiting'};
                    updates[userID] = {userName: userName, status: 'enter'};

                    let roomId = (rivalId + this.user.uid).toString();
                    await firebase.database().ref('Rooms/' + roomId).set(updates);

                    await firebase.database().ref('WaitingPlayer/' + rivalId).remove(); // 從等待列表移除

                }
                else{ // 沒人在等
                    firebase.database().ref('WaitingPlayer/' + userID).set({
                        userName: userName
                    });
                    console.debug("Waiting...");

                    //TODO: 監聽Rooms, 若讀到自己的userID, change the status to 'enter'
                }   
            }
        }).catch((error) => {
            console.error("Error reading database:", error);
        })
    }
}
