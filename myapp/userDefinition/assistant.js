User = require('./user.js');

class Assistant extends User{

    constructor(assistant){
        super(assistant);
    }
    
}


if (typeof module == 'object')
    module.exports = Assistant;
