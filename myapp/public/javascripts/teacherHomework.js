$(function(){
    var teacherRouterUrl = '/teacher';
    var markScoreUrl = window.location + '/reviseScore';

    var showMenu = function(){
        var $webClasses = $(this).parent('.webClass');
        $(this).toggleClass('clicked');
        $webClasses.find('.reviewees').toggle();
    }

    var markScore = function(){
        console.log('a');
        var $reviewee = $(this).parent('.reviewee');
        var mark = {
            revieweeId : $reviewee.find('span.id').text(),
            score : parseInt($reviewee.find('.reviseScore').val())
        };
        $.post(markScoreUrl, mark)
        .done(function(result){
            result = JSON.parse(result);
            if (result.success)
                $reviewee.find('span.score').text(mark.score);
            else
                alert('服务器出错或输入有误!');
        })
    }


  
    $(".webClassTitle").click(showMenu);
    $('li.reviewee .submitScore').click(markScore);
});