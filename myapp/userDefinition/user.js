

class User{
    // id
    // name
    // password
    // email
    // identity

    constructor(user){
        this.id = user.id;
        this.name = user.name;
        this.password = user.password;
        this.email = user.email;
        this.identity = user.identity;
    }
    static initializeDatabase(db){
        User.db = db;
        User.userCollection = db.collection('user');
        User.homeworkCollection = db.collection('homework');
        User.webClassCollection = db.collection('webClass');
        User.missionCollection = db.collection('mission');
    }
    static getUserWithoutPassword(tUser){
        var user = JSON.parse(JSON.stringify(tUser));
        delete user.password;
        return user;
    }
    idValid(id){

    }
    nameValid(name){

    }
    passwordValid(password){

    }
    emailValid(email){

    }
    webClassValid(webClass){

    }
    identityValid(identity){

    }

}

if (typeof module == 'object')
    module.exports = User;
