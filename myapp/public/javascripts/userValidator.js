var validator = {
    errors : [],
    id : {
        re : /^\d+$/,
        error : 'id应全为数字组成'
    },
    name : {
        re : /[x{4e00}-x{9fa5}]+/u,
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
        error : "年级仅限三位数以内"
    },
    number : {
        re : /^[0-9]{1,2}$/,
        error : "班级仅限两位数以内"
    },
    identity : {
        error : "身份只允许teacher、assistant和student"
    },
    idValid : (id) => {
        return this.id.re.test(id);
    },
    nameValid : (name) => {
        return this.name.re.test(name);
    },
    passwordValid : (password) => {
        return this.password.re.test(password);
    },
    emailValid : (email) => {
        return this.email.re.test(email);
    },
    gradeValid : (grade) => {
        return this.grade.re.test(grade);
    },
    numberValid : (number) => {
        return this.number.re.test(number);
    },
    webClassValid : (webClass) => {
        return this.gradeValid(webClass.grade)
            && this.numberValid(webClass.number);
    },
    identityValid : (identity) => {
        return identity == 'teacher'
            || identity == 'assistant'
            || identity == 'student'
    },
    userValid : (user) => {
        this.errors = [];
        if (this.identityValid(user.identity)){
            let relatedValidator = this[user.identity + 'Valid'];
            return relatedValidator(user);
        }
        else{
            this.errors.push(this.identity.error);
            return false;
        }  
    },
    teacherValid : (teacher) => {
        let result = true;
        Object.assign({
            id         : '',
            name       : '',
            password   : '',
            email      : '',
        }, teacher);
        for(property in teacher){
            let propertyValidator = this[property + 'Validator'];
            if (!propertyValidator){ // 无此属性对应的validator时
                result = false;
                continue;
            }
            else if (!propertyValidator(teacher.property)){
                result = false;
                this.errors.push(this.property.error);
            }
        }
        return result;
    },
    assistantValid : (assistant) => {
        Object.assign({
            id         : '',
            name       : '',
            password   : '',
            email      : '',
            webClass   : {
                grade  : '',
                number : ''
            },
        }, assistant);
    },
    studentValid : (student) => {
        Object.assign({
            id         : '',
            name       : '',
            password   : '',
            email      : '',
            webClass   : {
                grade  : '',
                number : ''
            },
        }, student);
    }


}