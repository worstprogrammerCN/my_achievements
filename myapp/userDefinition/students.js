User = require('./users.js'); //在_Student处被赋值

class Student extends User{
    // mission
    // group
    constructor(student){
        super(student);
        this.missions = student.missions;
        this.group = student.group;
    }
    getGroupmates(){
        return Student.collection
        .find({webClass : this.webClass, group : this.group})
        .toArray()
        .then((groupMates) => {return groupMates});
    }
}


if (typeof module == 'object')
    module.exports = Student;
