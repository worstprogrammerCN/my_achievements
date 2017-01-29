User = require('./users.js');

class Teacher extends User{

    constructor(teacher){
        super(teacher);
    }
    addMissions(missions){
        
    }

    addHomework(homework){

    }
    deleteHomework(homework){

    }
    
}


if (typeof module == 'object')
    module.exports = Teacher;
