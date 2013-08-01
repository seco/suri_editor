//    initialize global identifier for recording calls
Identifier = 1;

(function($){




    $.fn.option_list = function (options) {

        Identifier++;

        var container = "<div class='popup_ option_list" + Identifier + "'><ul class='options_"+ Identifier +"' style='list-style-type: none;padding: 0px 0px 0px 0px;margin: 0px 0px 0px 0px'>";

        $.each(options, function(index, value){
            container = container + "<li>"+ value[0] +"</li>";
        });

        container = container + "</ul></div>";
        this.parents('body').append(container);

        $('.option_list'+Identifier).css('position', 'absolute').hide();

        var tmp = Identifier;

        $.each($('.options_'+tmp).children(), function(index, element){
            if(options[index][1]){

                element.onclick = options[index][1];

//                hide when any option is clicked

                $(element).mouseup(function(){
                    $('.popup_').hide();
                });
            }
        });
//
//        show options menu when element is clicked

        this.on({
            'click': function(){
                var position = $(this).offset();

                position.top += $(this).height();

                $('.option_list'+tmp).css(position).show();
            }
        });

//        return this for chaining
        return this;
    }; // plugin ends

//    ----------------------------------------------------

    $.fn.mouseenterOptionList = function(options){
        Identifier++;

        var container = "<div class='popup_ option_list" + Identifier + "'><ul class='block-ul options_"+ Identifier +"' style='list-style-type: none;padding: 0px 0px 0px 0px;margin: 0px 0px 0px 0px'>";

        $.each(options, function(index, value){
            container = container + "<li class='block-li' >"+ value[0] +"</li>";
        });

        container = container + "</ul></div>";
        this.parents('body').append(container);

        $('.option_list'+Identifier).css('position', 'absolute').hide();

        var tmp = Identifier;

        $.each($('.options_'+tmp).children(), function(index, element){
            if(options[index][1]){

                element.onclick = options[index][1];

//                hide when any option is clicked

                $(element).mouseup(function(){
                    $('.popup_').hide();
                });

//                when cursor goes out of option list, it hides
//                $(element).mouseout(function(){
//                    $(this).parents('.option_list'+tmp).hide();
//                });
            }
        });

//        $('.option_list'+tmp).mouseout(function(){
//            $(this).hide();
//        });
//
//        show options menu when element is clicked

        this.on({
            'mouseenter': function(){
                var position = $(this).offset();

                position.top += $(this).height();

                $('.option_list'+tmp).css(position).show();
            },

            'mouseout': function(){
                var flag = true;
                var target = $('.option_list'+tmp);
                target.mouseenter(function(){
                    flag = false;
                });
                setTimeout(
                    function(){
                        if(flag){
                            target.hide();
                        }
                    },
                    100
                );
            }
        });

//        return this for chaining
        return this;
    };




        $(document).mouseup(function (e)
        {
            var container = $(".popup_");
            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0)
            {
                container.hide();
            }
        });
//    }
}(jQuery));