
    modelViewCounter = 1;
    function ModelView(){
        this.width = null;
        this.counter = ++modelViewCounter;
        this.data = null;
        this.container = "<div style='text-align: left; box-shadow: 0 4px 23px 5px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0,0,0,0.15);border-radius: 6px; z-index: 15; display:inline-block;margin: 7% 4px 4px 4px' id='model-view-container-"+ this.counter +"'><span style='margin-right: 4px; margin-top: 2px; font-size: 15px; float: right;cursor: pointer;color: lightgray;font-family: sans-serif' onclick='$(this).parent().parent().hide()' class='close-model-view' >X</span></div>";
        this.overwiew = "<div style='background-color: white; opacity: 0.96; z-index: 10;top: 0px; display: none; text-align: center;position: absolute;' id='model-view-overview-"+ this.counter +"' ></div>";

        this.ready = function(){
            if( container(this.counter).length>0 ){



            }else{

                $('body').append(this.overwiew);
                overview(this.counter).append(this.container);
                container(this.counter).append(this.data);


            }

        };

        this.launch = function(){
            if( container(this.counter).length<1 ){
                throw 'Model view not ready, use #model.ready()';
            }
            showModel(this.counter);
        };

        this.$addedContainer = function(){
            return $('#model-view-container-'+this.counter);
        };

        this.setWidth = function(width){
            this.width = width;
            this.container = $(this.container).css('width', this.width);
        };

        this.hide = function(){
            overview(this.counter).hide();
        };

        this.setData = function(data){
            var tmp = $("<div style='margin: 20px' ></div>");

            this.data = tmp.append(data);
        };

        function showModel(counter){
            overview(counter).height($(document).height()).width($(document).width()).show();
        }

        function container(counter){
            return $('#model-view-container-'+counter);
        }

        function overview(counter){
            return $('#model-view-overview-'+counter);
        }
    }

    $(document).ready(function(){
        $('body').on('mouseenter', '.close-model-view', function(){
            $(this).css('color', 'red');
        });

        $('body').on('mouseout', '.close-model-view', function(){
            $(this).css('color', 'lightgray');
        });
    });

