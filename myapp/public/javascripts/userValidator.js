var userValidator = {
    errors : [],
    id : {
        re : /^\d+$/,
        error : 'id应全为数字组成'
    },
    name : {
        re : /[\u4e00-\u9fa5]+/u,
        error : "名字应为汉字"
    },
    password : {
        re : /^[a-zA-Z0-9!@#$%]{6,16}$/,
        error : "只能包含大小写字母、数字、以及符号!@#$%"
    },
    email : {
        re : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
        error : "邮箱应符合常规"
    },
    grade : {
        re : /^[0-9]{1,3}$/,
    },
    number : {
        re : /^[0-9]{1,2}$/,
    },
    webClass : {
        error : "年级仅限三位数以内， 班级仅限两位数以内"
    },
    identity : {
        error : "身份只允许teacher、assistant和student"
    },
    idValid : function(id){
        return this.id.re.test(id);
    },
    nameValid : function(name){
        return this.name.re.test(name);
    },
    passwordValid : function(password){
        return this.password.re.test(password);
    },
    emailValid : function(email){
        return this.email.re.test(email);
    },
    gradeValid : function(grade){
        return this.grade.re.test(grade);
    },
    numberValid : function(number){
        return this.number.re.test(number);
    },
    webClassValid : function(webClass){
        return webClass.grade
            && webClass.number
            && this.gradeValid(webClass.grade)
            && this.numberValid(webClass.number);
    },
    identityValid : function(identity){
        return identity == 'teacher'
            || identity == 'assistant'
            || identity == 'student'
    },
    propertiesValid : function(user){
        let result = true;
        for(property in user){
            let propertyValid = property + 'Valid';
            if (!this[propertyValid]){ // 无此属性对应的validator时
                result = false;
                continue;
            }
            else if (!this[propertyValid](user[property])){
                result = false;
                this.errors.push(this[property].error);
            }
        }
        return result;
    },
    userValid : function(user){
        this.errors = [];
        if (this.identityValid(user.identity)){
            return this[user.identity + 'Valid'](user);
        }
        else{
            this.errors.push(this.identity.error);
            return false;
        }
    },
    teacherValid : function(teacher){
        let result = true;
        teacher = Object.assign({
            id         : '',
            name       : '',
            password   : '',
            email      : '',
        }, teacher);
        return this.propertiesValid(teacher);
    },
    assistantValid : function(assistant){
        assistant = Object.assign({
            id         : '',
            name       : '',
            password   : '',
            email      : '',
            webClass   : {
                grade  : '',
                number : ''
            },
        }, assistant);
        return this.propertiesValid(assistant);
    },
    studentValid : function(student){
        student = Object.assign({
            id         : '',
            name       : '',
            password   : '',
            email      : '',
            webClass   : {
                grade  : '',
                number : ''
            },
        }, student);
        return this.propertiesValid(student);
    }
}

if (typeof module == 'object')
    module.export = userValidator;