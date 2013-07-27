(function($){

    function SuriEditor(){
        this.handleBar = createHandleBar();
        this.handleButton = createHandleButton();

        this.initialize = function(element){


//            this.canvasId = element.attr('id');

            element.append(this.handleButton).append(this.handleBar);

//            text part - adding options

            var $handlebar = $('#handle-bar');

            $handlebar.hide().find('#text-part').option_list([
                [ 'Title', function(){ launchTextInput('title') } ],
                [ 'Heading', function(){ launchTextInput('heading') } ],
                [ 'Paragraph', function(){ launchTextInput('paragraph') } ],
                [ 'Html', function(){ launchHtmlInput() } ]
            ]);

//            image part

            $handlebar.find('#image-part').option_list([
                [ 'Upload', function(){ launchImageUpload() } ],
                [ 'Web cam', function(){ alert('web cam') } ]
            ]);

//            more part
            $handlebar.find('#more-part').option_list([
                [ 'Links', function(){ launchLinkInput() } ]
            ]);

//            image part
            $handlebar.find('#video-part').option_list([
                [ 'Youtube', function(){ launchYoutubeInput() } ]
            ]);


            $(element).find('#handle-button').on({
                'click': function(){
                    $(this).hide();
                    $('#handle-bar').show();
                }
            });


//            click on canvas
//            current input should be validated and checked
            element.mouseup(function(e){
                var queuedInputs = $('.editor-input');

                if(!queuedInputs.is(e.target)&&queuedInputs.has(e.target).length === 0){

                    if(queuedInputs.length > 0){

                        $.each(queuedInputs, function(index, element){

                            if($(element).hasClass('text-heading')){

                                validateAndSubmitHeading($(element));

                            }else if($(element).hasClass('text-para')){

                                validateAndSubmitPara($(element));

                            }else if($(element).hasClass('text-title')){

                                validateAndSubmitTitle($(element));

                            }else if($(element).hasClass('uploaded-pic')){

                                validateAndSubmitImage($(element));

                            }else if($(element).hasClass('link-helper')){

                                validateAndSubmitLink($(element));

                            }else if($(element).hasClass('text-html')){

                                validateAndSubmitHtml($(element));

                            }else if($(element).hasClass('youtube-input')){

                                validateAndSubmitYoutubeVideo($(element));

                            }

                        });

                    }

                }

            });
        };

        function validateAndSubmitYoutubeVideo($youtube_video){
            if($youtube_video.val()&&$youtube_video.val().length>0){
                var video_field = "<div class='added-data added-youtubeVideo'><video src="+$youtube_video.val()+"></video></div>";
                $youtube_video.replaceWith(video_field);
            }else{
                $youtube_video.remove();
            }
        }

        function validateAndSubmitLink($link_helper){
            var address;
            var alias = $($link_helper.children()[1]).val();
            address = $($($link_helper).children()[3]).val();
            if( address && address.length>0 ){
                var link = null;
                if(alias && alias.length>0){
                    link = "<a href="+ address +">"+alias+"</a>";
                }else{
                    link = "<a href="+ address +">"+address+"</a>";
                }
                $link_helper.replaceWith(link);
            }else{
              $link_helper.remove();
            }
        }

        function validateAndSubmitImage($image_field){
            if($image_field.val() && $image_field.val().length > 0){

                $image_field.removeClass('editor-input').addClass('added-data').hide();

            }else{
                if( $image_field.prev().hasClass('image-preview') ){
                    $image_field.prev().remove();
                }
                $image_field.remove();
            }
        }

        function validateAndSubmitTitle($title){
            if($title.val() && $title.val().length > 0){
                $title.replaceWith("<h1 class='added-title added-data'>"+ $title.val() +"</h1>");
            }else{
                $title.remove();
            }
        }

        function validateAndSubmitHtml($html){
            if($html.val() && $html.val().length > 0){
                var data = $html.val();
                $html.replaceWith("<div class='added-html added-data'></div>");
                $('#handle-button').prev().append(data);
            }else{
                $html.remove();
            }
        }

        function validateAndSubmitHeading($header){
            if($header.val() && $header.val().length > 0){
                $header.replaceWith("<h1 class='added-heading added-data'>"+ $header.val() +"</h1>");
            }else{
                $header.remove();
            }
        }

        function validateAndSubmitPara($para){
            if ($para.val() && $para.val().length > 0) {
                $para.replaceWith("<p class='added-para added-data'>" + $para.val() + "</p>");
            } else {
                $para.remove();
            }
        }

        function launchYoutubeInput(){
            var $button = $('#handle-button');
            var youtube_input = "<input type='text' class='editor-input youtube-input' placeholder='Copy and paste any Youtube video Url' />";
            $button.before(youtube_input);
            $('.youtube-input').focus();
            revertToInputState();
        }

        function launchHtmlInput(){
            var button = $('#handle-button');
            var html_field = "<textarea placeholder='Write some HTML, if you know how to.' class='editor-input text-html' ></textarea>";
            button.before(html_field);
            $('.text-html').focus();
            revertToInputState();
        }

        function launchLinkInput(){
            var button = $('#handle-button');
            var link_div = "<div class='editor-input link-helper' ><span>Alias :</span><input placeholder='name' class='alias' type='text' /><span>Address</span><input placeholder='url' class='address' type='text' ></div>";
            button.before(link_div);
            revertToInputState();
        }

        function launchImageUpload(){
            //noinspection JSJQueryEfficiency
            var button = $('#handle-button');
            var image_field = "<input type='file' class='editor-input uploaded-pic' accept='image/*' />";
            button.before(image_field);
            //noinspection JSJQueryEfficiency
            button = $('#handle-button');
            button.prev().on({
                'change': function(){
                    readUrl(this);
                }
            });
            revertToInputState();
        }

        function readUrl(input){
            if($(input).prev().hasClass('image-preview')){
                $(input).prev().remove();
            }
            $(input).before("<img class='image-preview tmp' src='#' />");
            if(input.files && input.files[0]){
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(input).prev().attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function launchTextInput(type){
            var button = $('#handle-button');
            var text_field = null;
            if(type == 'heading'){
                text_field = "<input placeholder='Heading' class='editor-input text-heading' />";
            }else if(type == 'paragraph'){
                text_field = "<textarea placeholder='Write something' class='editor-input text-para'></textarea>";
            }else if(type == 'title'){
                text_field = "<input placeholder='Title' class='editor-input text-title' />";
            }
            button.before(text_field);
            $('.editor-input').focus();
            revertToInputState();
        }


        function createHandleBar(){
            var handle;
            var textPart;
            var imagePart;
            var videoPart;
            var morePart;
            var appsPart;
            textPart = "<a id='text-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img src='images/text.svg' /></a>";
            imagePart = "<a id='image-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img src='images/image.svg'></a>";
            videoPart = "<a id='video-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img src='images/video.svg'></a>";
            morePart = "<a id='more-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img src='images/more.svg'></a>";
            appsPart = "<a id='apps-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img src='images/apps.svg'></a>";
            handle = "<div id='handle-bar'>"+textPart+imagePart+videoPart+morePart+appsPart+"</div>";
            return handle;
        }
        function createHandleButton(){
            var but;
            but = "<a id='handle-button'><!--suppress HtmlUnknownTarget --><img src='images/add.svg'></a>";
            return but;
        }

        function revertToInputState(){
            $('#handle-bar').hide();
            $('#handle-button').show();
        }

    }

    $.fn.editor = function(){
        var e = new SuriEditor;
        e.initialize(this);
    }
}(jQuery));