$(function(){
    var reviseReviewUrl = window.location + '/review/revise';
    let toggleStatus = function(){
        var $uploadButton = $(this);
        var $dom = $uploadButton.parent('.review');
        var $textarea = $dom.find('textarea.comment');

        if ($dom.data('status') != 'revise'){
            $dom.data('status', 'revise');
            $textarea.removeAttr('readonly');
            $uploadButton
                .removeClass('btn-warning')
                .addClass('btn-danger')
                .val('完成')
            
        }else{
            $dom.data('status', 'readonly');
            $textarea.attr('readonly', 'readonly');
            var review = {
                revieweeId : $dom.find(".revieweeId").text(),
                comment : $dom.find(".comment").val()
            }
            $.post(reviseReviewUrl, {review : JSON.stringify(review)})
            .done((result) => {
                result = JSON.parse(result);
                if (result.success){
                    var $comment = $review.find(".comment");
                    $comment.text(review.comment);
                }else{
                    alert("fail!");
                }
            });
            $uploadButton
                .removeClass('btn-danger')
                .addClass('btn-warning')
                .val('修改')
        }
    }
    $('#reviewees .review .uploadReview').click(toggleStatus);
})