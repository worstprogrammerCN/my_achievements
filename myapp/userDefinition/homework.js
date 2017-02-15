let moment = require('moment');

class Homework{
    // name
    // description
    // link
    constructor(homework){
        this.name = homework.name;
        this.description = homework.description;
        this.link = homework.link;
        this.startTime = homework.startTime;
        this.endTime = homework.endTime;
        this.status = this.getStatus();
    }
    isValid(homework){
        
    }
    getStatus(){
        if (this.isUnstarted())
            return 'unstarted';
        else if (this.isStarted())
            return 'started';
        else if (this.isEnded())
            return 'ended';
    }
    isUnstarted(){
        let current = moment();
        return current.isBefore(this.startTime);
    }
    isStarted(){ // 判断状态是否为started
        let current = moment();
        return current.isAfter(this.startTime)
            && current.isBefore(this.endTime);
    }
    isEnded(){
        let current = moment();
        return current.isAfter(this.endTime);
    }
}

if (typeof module == 'object')
    module.exports = Homework;