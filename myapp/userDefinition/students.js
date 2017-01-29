User = require('./users.js');

class Student extends User{
    // missions
    // webClass
    // group
    constructor(student){
        super(student);
        this.missions = student.missions;
        this.webClass = student.webClass;
        this.group = student.group;
    }
    getGroupmates(){
        return Student.userCollection
        .find({webClass : this.webClass, group : this.group})
        .toArray();
    }
    getMissions(){
        return Student.missionCollection
        .find({recipient : this.id})
        .toArray();
    }
    getHomeworks(){
        var homeworkPromiseArray = this.missions.map((missonName) => {
            return new Promise((resolve, reject) => {
                Student.homeworkCollection
                .findOne({name : missonName})
                .then((homework) => {
                    resolve(homework);
                })
            })
        })
        return Promise.all(homeworkPromiseArray);       
    }
}


if (typeof module == 'object')
    module.exports = Student;
