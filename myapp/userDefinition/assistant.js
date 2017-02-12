User = require('./user.js');

class Assistant extends User{

    constructor(assistant){
        super(assistant);
        this.webClass = assistant.webClass
    }
    
}


if (typeof module == 'object')
    module.exports = Assistant;
