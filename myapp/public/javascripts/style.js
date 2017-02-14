$(function(){
    let logout = function(){
        $('form.logout').submit();
    }
    $('a.logout').click(logout);
})