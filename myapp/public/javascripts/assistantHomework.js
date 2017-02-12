$(function(){
    var assistantRouterUrl = '/assistant';
    var reviseReviewUrl = `${window.location}/review/revise`;
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



    $(".review .uploadReview").click(uploadReview);
})