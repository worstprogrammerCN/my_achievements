$(function(){
    var studentRouterUrl = '/student';
    var uploadUrl = window.location + '/upload';
    var reviseReviewUrl = window.location + '/review/revise';
    var uploadReview = function(){
        var $review = $(this).parent(".review");

        var review = {
            revieweeId : $review.find(".revieweeId").text(),
            comment : $review.find(".reviseComment").val()
        }
        $.post(reviseReviewUrl, {review : JSON.stringify(review)})
        .done((result) => {
            result = JSON.parse(result);
            if (result.success){
                var $comment = $review.find(".comment");
                console.log($comment.text());
                console.log(review.comment);
                $comment.text(review.comment);
            }else{
                alert("fail!");
            }
        })
    };

    var downloadCode = function(){
        $review = $(this).parent(".review");
        var homeworkName = $(".homeworkName").text();
        var revieweeId = $review.find(".revieweeId").text();
        var url = studentRouterUrl + '/homework/' + homeworkName + '/download/code?revieweeId=' + revieweeId;
        console.log(url);
        $("<form>").attr("action", url).text("下载").submit();
    }

    $('#fine-uploader-manual-trigger').fineUploader({
        template: 'qq-template-manual-trigger',
        request: {
        endpoint: uploadUrl
    },
    thumbnails: {
        placeholders: {
        waitingPath: '/images/uploader/waiting-generic.png',
        notAvailablePath: '/images/uploader/not_available-generic.png'
        }
    },
    validation: {
        allowedExtensions: ['zip', 'rar'],
        itemLimit: 1
    },
    autoUpload: false
    });
    $('#img-uploader').fineUploader({
        template: 'qq-template-manual-trigger',
        request: {
        endpoint: uploadUrl
    },
    thumbnails: {
        placeholders: {
        waitingPath: '/images/uploader/waiting-generic.png',
        notAvailablePath: '/images/uploader/not_available-generic.png'
        }
    },
    validation: {
        allowedExtensions: ['jpeg', 'jpg', 'png'],
        itemLimit: 1
    },
    autoUpload: false
    });
    $('#trigger-upload').click(function() {
        $('#fine-uploader-manual-trigger').fineUploader('uploadStoredFiles');
    });
    $('#img-trigger-upload').click(function() {
        $('img-uploader').fineUploader('uploadStoredFiles');
    });
    $(".review .uploadReview").click(uploadReview);
    $(".code").click(downloadCode);
})