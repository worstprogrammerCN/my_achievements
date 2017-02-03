$(function(){
    userRouterUrl = '/user'

    function checkLogin(){
        $.post(userRouterUrl + '/login', $( "#loginPanel" ).serialize())
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