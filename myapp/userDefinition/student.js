User = require('./user.js');

class Student extends User{
    // missions
    // webClass
    // group
    constructor(student){
        super(student);
        this.webClass = student.webClass;
        this.group = student.group;
    }
    getGroupmates(){
        return Student.userCollection
        .find({webClass : this.webClass, group : this.group})
        .toArray();
    }
    getHomeworks(){
        return Student.homeworkCollection.find().toArray();       
    }
    updateCode(homeworkName, fileName){
        return Student.missionCollection.update({
          recipient : this.id,
          homeworkName : homeworkName
        }, {$set : {
          code : fileName
        }})
    }
    updateImg(homeworkName, fileName){
        return Student.missionCollection.update({
          recipient : this.id,
          homeworkName : homeworkName
        }, {$set : {
          image : fileName
        }})
    }
    getMission(homeworkName){
        return Student.missionCollection.findOne({
            'recipient' : this.id,
            'homeworkName' : homeworkName
        })
    }
    getDownload(homeworkName){
        
    }
    getRevieweesReview(homeworkName){

    }
    getReviewersReview(homeworkName){

    }
}


if (typeof module == 'object')
    module.exports = Student;
