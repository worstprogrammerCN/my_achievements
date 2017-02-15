$(function(){
    userRouterUrl = '/user'

    function checkLogin(){
        console.log('a');
        var $form = $('.footer');
        var user = {
            id : $form.find('input[name="id"]').val(),
            password : $form.find('input[name="password"]').val()
        }
        $.post(userRouterUrl + '/login', user)
        .done((result) => {
            result = JSON.parse(result);
            if (result.loginSuccess){
                var indexUrl =  `/${result.identity}/index`;
                window.location = indexUrl;
            }
            else{
                alert('错误密码或用户名!');
            }
        })
        .fail((error) => {
            alert('error');
        })
    }

    $('#login').click(checkLogin);
    
})