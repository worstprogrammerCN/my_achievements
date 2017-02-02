$(function(){
    var makeHomeworkUrl = '/teachers/addHomework';
    var publishHomeworkUrl = '/teachers/publishHomework';

    var makeHomework = function(){
        var name = $('#makeHomework input[name="name"]').val();
        var description = $('#makeHomework input[name="description"]').val();
        var link = $('#makeHomework input[name="link"]').val();
        var homework = {
            name : name,
            description : description,
            link : link
        }
        $.post(makeHomeworkUrl, homework, function(result){
            result = JSON.parse(result);
            if (result.insertSuccess)
                alert('success');
            else
                alert('fail');
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