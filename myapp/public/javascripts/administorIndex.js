$(function(){
    function checkUser(){
        let $form = $('#addUser');
        var user = {
            id : $form.find('input[name = "id"]').val(),
            name : $form.find('input[name = "name"]').val(),
            password : $form.find('input[name = "password"]').val(),
            email : $form.find('input[name = "email"]').val(),
            webClass : {
                grade : $form.find('input[name = "grade"]').val(),
                number : $form.find('input[name = "number"]').val(),
            },
            identity : $form.find('input[name = "identity"]').val()
        }
        console.log(user);
        if (userValidator.userValid(user)){
            alert('ok');
        }
        else 
            console.log(userValidator.errors);
    }
    $('#addUser .submitButton').click(checkUser);
    
})