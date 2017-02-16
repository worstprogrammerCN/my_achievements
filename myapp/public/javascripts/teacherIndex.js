$(function(){
    let teacherRouterUrl = '/teacher'
    let addwebClassUrl = `${teacherRouterUrl}/addWebClass`;
    let divideGroupUrl = `${teacherRouterUrl}/divideGroup`;
    let makeHomeworkUrl = `${teacherRouterUrl}/makeHomework`;
    let distributeSettingUrl = `${teacherRouterUrl}/distributeReview`;

    function addWebClass(){
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
                console.log('ok');
            else
                console.log('fail');
        }).fail((error) => {
            alert('connect fail')
        })   
    }


    var makeHomework = function(){
        var $form = $('#makeHomework');
        var homework = {
            name : $form.find('input[name="name"]').val(),
            description : $form.find('textarea[name="description"]').val(),
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

    function distributeReview(){
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

    $('#addWebClass .submitButton').click(addWebClass)
    $('#divideGroup .submitButton').click(divideGroup);
    $('#makeHomeworkSubmit').click(makeHomework);
    $('#distributeReview .submitButton').click(distributeReview);
});