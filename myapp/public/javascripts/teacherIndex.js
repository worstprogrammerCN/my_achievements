$(function(){
    var teacherRouterUrl = '/teacher'
    var makeHomeworkUrl = teacherRouterUrl + '/makeHomework';
    var publishHomeworkUrl = teacherRouterUrl + '/publishHomework';

    var makeHomework = function(){
        var $form = $('#makeHomework');
        var homework = {
            name : $form.find('input[name="name"]').val(),
            description : $form.find('input[name="description"]').val(),
            link : $form.find('input[name="link"]').val(),
            startTime : $form.find('input[name="startTime"]').val(),
            endTime : $form.find('input[name="endTime"]').val(),
        };
        $.post(makeHomeworkUrl, {homework : JSON.stringify(homework)})
        .done(function(result){
            result = JSON.parse(result);
            if (result.ok)
                alert('ok');
            else
                alert('fail');
        }).fail(function(error){
            console.log(error);
        })
    }

    var publishHomework = function(){
        var $div = $('#publishHomework');
        var mission = {
            name : $div.find('#missionName').val(),
            startTime : $div.find('#missionStartTime').val(),
            deadline : $div.find('#missionDeadline').val()
        };
        var webClasses = $div.find('#webClasses li')
                             .toArray()
                             .reduce((checkedLiArray, li) => {
                                 var isChecked = $(li).find("input").is(":checked");
                                 if(isChecked)
                                    checkedLiArray.push(li);
                                 return checkedLiArray;
                             }, []).map((checkedLi) => {
                                 [grade, number] = $(checkedLi).attr('id').split('-');
                                 var webClass = {
                                     grade : parseInt(grade),
                                     number : parseInt(number)
                                 }
                                 return webClass;
                             });
        var publishSettingStr = JSON.stringify({
            mission : mission,
            webClasses : webClasses
        });
        var toSend = {
            publishSettingStr : publishSettingStr
        }

        

        $.post(publishHomeworkUrl, toSend, function(result){
            console.log(result);
            result = JSON.parse(result);
            if (result.publishSuccess)
                alert('success');
            else
                alert('fail');
        })
    }

    $('#makeHomeworkSubmit').click(makeHomework);
    $('#publishHomeworkSubmit').click(publishHomework);
});