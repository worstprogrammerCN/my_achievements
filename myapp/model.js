var user = {
    id : "15331132",
    name : "jzl",
    password : "asdfdsa",
    email : "aa@aa.aa",
    webClass : '151',
    group : 17,
    identity : "assistant",
    missions : ["recipe"]
}

var mission = {
    recipient : "15331132",
    name : "maze",
    reviewerList : ["15331133", "100"],
    score : 99,
    startTime : "2017-01-14",
    deadline : "2017-02-23",
    image : ["asdffdsa.png", "asdfffe.png"],
    code : "fasefes.zip",
    github : "http://asfdfasd.afsd.com"
}

var result = {
    name : "maze",
    isFinished : true,
    webClass : {
        grade : 15,
        number : 1
    },
    rank : [{
        id : "15331132",
        name : "xxx",
        group : 17,
        score : 99
    },{
        id : "15331133",
        name : "xxx",
        group : 17,
        score : 98
    }],
}

var homework = {
    name : "recipe", 
    description : "description of recipe",
    link : "http://www.baidu.com",
}

var review = {
    homework : "recipe",
    reviewerId : "15331133",
    reviewer : "zxy",
    reviewerIdentity : "assistant",
    revieweeId : "15331132",
    reviewee : "jzl",
    comment : "ok",
    score : 97,
}

var webClass = {
    index : '151',
    grade : 15, //15级
    number : 1, //1班
    assistantList : ["14331130", "14331131", "14331132"],
    groups : ["151", "152"]
}

var group  = {
    "number" : 151,
    "members" : ["15331132", "15331133"]
}
