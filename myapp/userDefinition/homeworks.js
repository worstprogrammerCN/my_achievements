class Homework{
    // name
    // description
    // link
    constructor(homework){
        this.name = homework.name;
        this.description = homework.description;
        this.link = homework.link;
    }
    isValid(homework){
        
    }
}

if (typeof module == 'object')
    module.exports = Homework;