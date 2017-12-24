$(function(){
    let administorRouterUrl = '/administor';
    let addUserUrl = administorRouterUrl + '/addUser';
    let addwebClassUrl = administorRouterUrl + '/addWebClass';
    let divideGroupUrl = administorRouterUrl + '/divideGroup';
    let distributeSettingUrl = administorRouterUrl + '/distributeReview';
<<<<<<< HEAD
<<<<<<< HEAD
    function logout(){
        $('form.logout').submit();
    }
=======
>>>>>>> parent of 7c0176b... 修复database 修复分组bug 进一步美化
    function addUser(){
=======
    function checkUser(){
>>>>>>> c4bbf5006d05c2d568ef4be17a13670c16d10f19
        let $form = $('#addUser');
        var user = {
            id : $form.find('input[name = "id"]').val(),
            name : $form.find('input[name = "name"]').val(),
            password : $form.find('input[name = "password"]').val(),
            email : $form.find('input[name = "email"]').val(),
            webClass : {
                grade : parseInt($form.find('input[name = "grade"]').val()),
                number : parseInt($form.find('input[name = "number"]').val()),
            },
            identity : $form.find('input[name = "identity"]').val()
        }
        if (!userValidator.userValid(user))
            console.log(userValidator.errors);
        else{
            $.post({
                type: "POST",
                url: addUserUrl,
                data: {user : JSON.stringify(user)},
                dataType: 'text'
            }).done((result) => {
                console.log(result);
                result = JSON.parse(result);
                if (result.ok)
                    alert('ok');
                else
                    alert('fail');
            }).fail((error) => {
                alert('connect fail')
            })
        }      
    }
    function checkWebClass(){
        let $form = $('#addWebClass');
        let webClass = {
            grade : parseInt($form.find('input[name = "grade"]').val()),
            number : parseInt($form.find('input[name = "number"]').val())
        }
        $.post({
            type: "POST",
            url: addwebClassUrl,
            data: {webClass : JSON.stringify(webClass)},
            dataType: 'text'
        }).done((result) => {
            result = JSON.parse(result);
            if (result.ok)
                alert('ok');
            else
                alert('fail');
        }).fail((error) => {
            alert('connect fail')
        })   
    }
    function divideGroup(){
        let $form = $('#divideGroup');
        let divideSetting = {
            webClass : {
                grade : parseInt($form.find('input[name = "grade"]').val()),
                number : parseInt($form.find('input[name = "number"]').val()),
            },
            maxNumber : parseInt($form.find('input[name = "maxNumber"]').val())
        }
        $.post({
            type: "POST",
            url: divideGroupUrl,
            data: {divideSetting : JSON.stringify(divideSetting)},
            dataType: 'text'
        }).done((result) => {
            result = JSON.parse(result);
            if (result.ok)
                alert('ok');
            else
                alert('fail');
        }).fail((error) => {
            alert('connect fail')
        })   
    }

    function checkDistributeSetting(){
        $form = $('#distributeReview');
        var distributeSetting = {
            webClass : {
                number : parseInt($form.find('input[name = "number"]').val()),
                grade : parseInt($form.find('input[name = "grade"]').val())
            },
            homeworkName : $form.find('input[name = "homeworkName"]').val()
        }
        $.post({
            type: "POST",
            url: distributeSettingUrl,
            data: {distributeSetting : JSON.stringify(distributeSetting)},
            dataType: 'text'
        }).done((result) => {
            result = JSON.parse(result);
            if (result.ok)
                alert('ok');
            else
                alert('fail');
        }).fail((error) => {
            alert('connect fail')
        })   
    }
<<<<<<< HEAD
<<<<<<< HEAD
    $('form.logout a').click(logout);
=======

>>>>>>> parent of 7c0176b... 修复database 修复分组bug 进一步美化
    $('#addUser .submitButton').click(addUser);
    $('#addWebClass .submitButton').click(addWebClass);
=======

    $('#addUser .submitButton').click(checkUser);
    $('#addWebClass .submitButton').click(checkWebClass);
>>>>>>> c4bbf5006d05c2d568ef4be17a13670c16d10f19
    $('#divideGroup .submitButton').click(divideGroup);
    $('#distributeReview .submitButton').click(checkDistributeSetting);
})