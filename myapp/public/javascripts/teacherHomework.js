$(function(){
    var teacherRouterUrl = '/teacher';

    var showMenu = function(){
        var $webClasses = $(this).parent('.webClass');
        $(this).toggleClass('clicked');
        $webClasses.find('.reviewees').toggle();
    }


  
    $(".webClassTitle").click(showMenu);
});