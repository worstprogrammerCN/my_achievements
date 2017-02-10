$(function(){
    var studentRouterUrl = '/student';
    var uploadUrl = window.location + '/upload';
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
    autoUpload: false
    });
    $('#trigger-upload').click(function() {
        $('#fine-uploader-manual-trigger').fineUploader('uploadStoredFiles');
    });

})