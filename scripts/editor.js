(function($){

    var youtube_input = "<input type='text' class='editor-input youtube-input' placeholder='Copy and paste any Youtube video Url' />";

    var link_div = "<div class='editor-input link-helper' ><label>Alias :</label><input placeholder='name' class='alias' type='text' /><label>Address</label><input placeholder='url' class='address' type='text' ></div>";

    var image_url = "<input type='text' class='editor-input image-url' placeholder='Url of Image' />";

    var title_field = "<input placeholder='Title' class='editor-input text-title' />";

    var para_field = "<textarea placeholder='Write something' class='editor-input text-para'></textarea>";

    var html_field = "<textarea placeholder='Write some HTML, if you know how to.' class='editor-input text-html' ></textarea>";

    var heading_field = "<input placeholder='Heading' class='editor-input text-heading' />";

    var image_field = "<input type='file' class='editor-input uploaded-pic' accept='image/*' />";

    function SuriEditor(){
        this.handleBar = createHandleBar();
        this.handleButton = createHandleButton();


        this.initialize = function(element){

//            bootStrap(element);

            window.onbeforeunload = function(){
                return "If you leave, all unsaved changes will be lost.";
            };




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
                [ 'Address', function(){ launchImageByUrl() } ]
            ]);

//            more part
            $handlebar.find('#more-part').option_list([
                [ 'Links', function(){ launchLinkInput() } ]
            ]);

//            image part
            $handlebar.find('#video-part').option_list([
                [ 'Youtube', function(){ launchYoutubeInput() } ]
            ]);


            element.find('#handle-button').on({
                'click': function(){
                    $(this).hide();
                    $('#handle-bar').show();
                }
            });

            element.on('change', '.uploaded-pic', function(){
                readUrl(this);
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

                            }else if($(element).hasClass('image-url')){

                                validateAndSubmitImageUrl($(element));

                            }


                        });

                    }

                }

            });

            element.on('keypress', '.editor-input', function(event){
                if( event.which == 13 ){
                    element.trigger('mouseup');
                }
            });

//            no 2 dynamic added be together
            element.on('mouseover', '.dynamic-edit', function(){
                if($(this).prev().hasClass('dynamic-edit')){
                    $(this).remove();
                }
            });



            element.on('mouseenter', '.dynamic-edit', function () {
                $(this).html('Add Here');
            });

            element.on('mouseout', '.dynamic-edit', function () {
                $(this).html('');
            });

            element.on('click', '.dynamic-edit', function(){
                //noinspection JSJQueryEfficiency
                $('#handle-button').before("<div class='dynamic-edit center'></div>");
                //noinspection JSJQueryEfficiency
                var $button = $('#handle-button').detach();
                //noinspection JSJQueryEfficiency
                var $bar = $('#handle-bar').detach();

                $(this).replaceWith($bar);
                //noinspection JSJQueryEfficiency
                $('#handle-bar').before($button);

                //noinspection JSJQueryEfficiency
                $('#handle-button').trigger('click');
            })

        }; // initialize ends

//        function bootStrap($div){
//
//            var data = "<input placeholder='Add Title' class='editor-input text-title'>\
//            <textarea placeholder='Write something' class='editor-input text-para'></textarea>\
//            <textarea placeholder='This is a awesome editor' class='editor-input text-para'></textarea>";
//
//            $div.append(data);
//
//
//        }

        function addMouseenterPopup(){
            var added = $('.added-data');
            $.each(
                added,
                function(index, element){
                    if( !$(element).hasClass('added-popup') ){
                        if($(element).hasClass('image-preview')){
                            $(element).mouseenterOptionList([
                                [ "<img src='images/trash.png'/>", function(){ removeAddedData(element) } ]
                            ]).addClass('added-popup');
                        }else{
                            $(element).mouseenterOptionList([
                                [ "<img src='images/trash.png'/>", function(){ removeAddedData(element) } ],
                                [ "<img src='images/pencil.png'/>", function(){ editAddedData(element) } ]
                            ]).addClass('added-popup');
                        }
                    }
                }
            );
        }

        function editAddedData(target){
            var $t = $(target);
            if( $t.hasClass('added-youtubeVideo') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith(youtube_input);

            }else if( $t.hasClass('added-link') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith($(link_div));

            }else if( $t.hasClass('added-image-url') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith($(image_url).val($t.attr('src')));

            }else if( $t.hasClass('added-title') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith($(title_field).val($t.html()));

            }else if( $t.hasClass('added-para') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith($(para_field).val($t.html()));

            }else if( $t.hasClass('added-html') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith($(html_field).val($t.html()));

            }else if( $t.hasClass('added-heading') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith($(heading_field).val($t.html()));

            }else if( $t.hasClass('added-image') ){

                $t.prev('.dynamic-edit').remove();
                $t.replaceWith(image_field);

            }
        }

        function removeAddedData(target){
            $(target).prev('.dynamic-edit').remove();
            $(target).remove();
        }


        function addDynamicEdit(e){
            var edit = "<div class='dynamic-edit center'></div>";
            $(e).before(edit);
        }

        function validateAndSubmitYoutubeVideo($youtube_video){
            if($youtube_video.val()&&$youtube_video.val().length>0){
                var video_id = $youtube_video.val().split('v=')[1];

                var video_field = "<iframe  class='added-data added-youtubeVideo' width='640' height='360' src='http://www.youtube.com/embed/"+ video_id +"?wmode=opaque&feature=oembed'></iframe>";
                addDynamicEdit($youtube_video);
                $youtube_video.replaceWith(video_field);

                addMouseenterPopup();
            }else{
                $youtube_video.remove();
            }
        }

        function validateAndSubmitLink($link_helper){
            var address;
            var alias = $($link_helper.children()[1]).val();
            //noinspection JSCheckFunctionSignatures
            address = $($($link_helper).children()[3]).val();
            if( address && address.length>0 ){
                var link = null;
                if(alias && alias.length>0){
                    link = "<a class='added-data added-link' href="+ address +">"+alias+"</a>";
                }else{
                    link = "<a class='added-data added-link' href="+ address +">"+address+"</a>";
                }
                addDynamicEdit($link_helper);
                $link_helper.replaceWith(link);

                addMouseenterPopup();
            }else{
              $link_helper.remove();
            }
        }

        function validateAndSubmitImageUrl($image){
            if($image.val()&&$image.val().length>0){
                var image_field = "<img src='"+ $image.val() +"'class='added-data added-image-url'/>";
                addDynamicEdit($image);
                $image.replaceWith(image_field);

                addMouseenterPopup();
            }else{
                $image.remove();
            }
        }

        function validateAndSubmitImage($image_field){
            if($image_field.val() && $image_field.val().length > 0){

                $image_field.removeClass('editor-input').addClass('added-data').hide().remove();

                addMouseenterPopup();

            }else{
                if( $image_field.prev().hasClass('image-preview') ){
                    $image_field.prev().remove();
                }
                $image_field.remove();
            }
        }

        function validateAndSubmitTitle($title){
            if($title.val() && $title.val().length > 0){
                addDynamicEdit($title);

                $title.replaceWith("<h1 class='added-title added-data'>"+ $title.val() +"</h1>");

                addMouseenterPopup();
            }else{
                $title.remove();
            }
        }

        function validateAndSubmitHtml($html){
            if($html.val() && $html.val().length > 0){
                var data = $html.val();

                addDynamicEdit($html);

                $html.replaceWith("<div class='added-html added-data'></div>");
                $('#handle-button').prev().append(data);

                addMouseenterPopup();
            }else{
                $html.remove();
            }
        }

        function validateAndSubmitHeading($header){
            if($header.val() && $header.val().length > 0){

                addDynamicEdit($header);

                $header.replaceWith("<h1 class='added-heading added-data'>"+ $header.val() +"</h1>");

                addMouseenterPopup();
            }else{
                $header.remove();
            }
        }

        function validateAndSubmitPara($para){
            if ($para.val() && $para.val().length > 0) {

                addDynamicEdit($para);

                $para.replaceWith("<p class='added-para added-data'>" + $para.val() + "</p>");

                addMouseenterPopup();
            } else {
                $para.remove();
            }
        }

        function launchImageByUrl(){
            var $button = $('#handle-button');

            $button.before(image_url);
            $('.image-url').focus();
            revertToInputState();
        }

        function launchYoutubeInput(){
            var $button = $('#handle-button');

            $button.before(youtube_input);
            $('.youtube-input').focus();
            revertToInputState();
        }

        function launchHtmlInput(){
            var button = $('#handle-button');

            button.before(html_field);
            $('.text-html').focus();
            revertToInputState();
        }

        function launchLinkInput(){
            var button = $('#handle-button');

            button.before(link_div);
            revertToInputState();
            $('.alias').focus();
        }

        function launchImageUpload(){
            //noinspection JSJQueryEfficiency
            var button = $('#handle-button');

            button.before(image_field);
            //noinspection JSJQueryEfficiency
//            button = $('#handle-button');
//            button.prev().on({
//                'change': function(){
//                    readUrl(this);
//                }
//            });
            revertToInputState();
        }

        function readUrl(input){
//            if($(input).prev().hasClass('image-preview')){
//                $(input).prev().remove();
//            }
            $(input).before("<img class='image-preview added-data tmp added-image' alt='Added Image' src='#' />");
            addDynamicEdit($(input).prev());
            if(input.files && input.files[0]){
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(input).prev().attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
            $(input).hide();
        }

        function launchTextInput(type){
            var button = $('#handle-button');
            var text_field = null;
            if(type == 'heading'){
                text_field = heading_field;
            }else if(type == 'paragraph'){
                text_field = para_field;
            }else if(type == 'title'){
                text_field = title_field;
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
            textPart = "<a id='text-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img class='rounded-corner' src='images/text.svg' /></a>";
            imagePart = "<a id='image-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img class='rounded-corner' src='images/image.svg'></a>";
            videoPart = "<a id='video-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img class='rounded-corner' src='images/video.svg'></a>";
            morePart = "<a id='more-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img class='rounded-corner' src='images/more.svg'></a>";
            appsPart = "<a id='apps-part' class='pointer' ><!--suppress HtmlUnknownTarget --><img class='rounded-corner' src='images/apps.svg'></a>";
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
        new SuriEditor().initialize(this);
    }
}(jQuery));

/*
 TOD add validateAndSubmit<Data> on Enter
 TODO add saveAndGenerateHtml for user to save the page finally
 TOD add confirm window closing on window.close()
 TODO allow user to edit and delete the input dynamically
 */
