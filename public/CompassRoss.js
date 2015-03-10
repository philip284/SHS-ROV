/*  
 * CompassRoss.js
 */

;(function($, window, undefined) {
    $.fn.extend({
        CompassRose: function(settings){   
            //Settings
            var sett = $.extend({
                pos: 0
                ,size: 162
                ,arrow: 'arrow.png'
                ,compass: 'rose.png'
            }, settings);
            
            var img1 = '<img id="#arrow" class="imgB1" src="'+sett.arrow+'"/>';            
            var input = '<input class="inputCompass" type="text" id="location" name="location" value="" />';
            var map = '<map name="locations"></map>';            
            var container = $(this).attr('id');
                
            var img = new Image();
            img.onload = function() {    
                var maxWidth = sett.size,
                    maxHeight = sett.size,
                    imageWidth = img.width,
                    imageHeight = img.height;

                if (imageWidth > imageHeight) {
                    if (imageWidth > maxWidth) {
                        imageHeight *= maxWidth / imageWidth;
                        imageWidth = maxWidth;
                    }
                }else {
                    if (imageHeight > maxHeight) {
                        imageWidth *= maxHeight / imageHeight;
                        imageHeight = maxHeight;
                    }
                }

                $(img).attr('class','imgA1');
                $(img).attr('usemap','#locations');
                $(img).attr('width',imageWidth);
                $(img).attr('height',imageHeight);


                $('[name="locations"]').html(
                    '<area shape="rect" coords="'+parseInt(imageWidth*0.41)+','+parseInt(imageHeight*0.15)+','+(parseInt(imageWidth*0.41)+31)+','+(parseInt(imageHeight*0.15)+16)+'" href="#'+container+'" alt="North" id="l1"/>\n\
                     <area shape="rect" coords="'+parseInt(imageWidth*0.16)+','+parseInt(imageHeight*0.2)+','+(parseInt(imageWidth*0.16)+31)+','+(parseInt(imageHeight*0.2)+26)+'" href="#'+container+'" alt="NorthWest" id="l2"/> \n\
                     <area shape="rect" coords="'+parseInt(imageWidth*0.07)+','+parseInt(imageHeight*0.44)+','+(parseInt(imageWidth*0.07)+31)+','+(parseInt(imageHeight*0.44)+16)+'" href="#'+container+'" alt="West" id="l3"/>\n\
                     <area shape="rect" coords="'+parseInt(imageWidth*0.15)+','+parseInt(imageHeight*0.69)+','+(parseInt(imageWidth*0.15)+31)+','+(parseInt(imageHeight*0.69)+16)+'" href="#'+container+'" alt="SouthWest" id="l4"/>\n\
                     <area shape="rect" coords="'+parseInt(imageWidth*0.41)+','+parseInt(imageHeight*0.79)+','+(parseInt(imageWidth*0.41)+31)+','+(parseInt(imageHeight*0.79)+16)+'" href="#'+container+'" alt="South" id="l5"/>\n\
                     <area shape="rect" coords="'+parseInt(imageWidth*0.65)+','+parseInt(imageHeight*0.64)+','+(parseInt(imageWidth*0.65)+31)+','+(parseInt(imageHeight*0.64)+16)+'" href="#'+container+'" alt="SouthEast" id="l6"/>\n\
                     <area shape="rect" coords="'+parseInt(imageWidth*0.82)+','+parseInt(imageHeight*0.49)+','+(parseInt(imageWidth*0.82)+31)+','+(parseInt(imageHeight*0.49)+16)+'" href="#'+container+'" alt="East" id="l7"/>\n\
                     <area shape="rect" coords="'+parseInt(imageWidth*0.64)+','+parseInt(imageHeight*0.25)+','+(parseInt(imageWidth*0.64)+31)+','+(parseInt(imageHeight*0.25)+16)+'" href="#'+container+'" alt="NorthEast" id="l8"/>'
                );
            
                $('[name="locations"]').find('area').each(function(i){
                    $('#'+$(this).attr('id')).bind("click", function(){
                        var pos = - 45*i + 180;
                        $('.'+$(img1).attr('class')).rotate({ angle:0,animateTo:pos,easing: $.easing.easeInOutExpo });                    
                        $('#'+$(input).attr('id')).val( pos );
                    })
                });
                
                $(".imgB1").css('height',parseInt(imageHeight*0.5));                
                $(".imgB1").css('top',parseInt(imageHeight*0.26));
                $(".imgB1").css('left',parseInt(imageWidth*0.46));
                //Initial potition
                $('.imgB1').rotate({ angle:0,animateTo:sett.pos,easing: $.easing.easeInOutExpo });                    
            }
            img.src = sett.compass;            
           
            $(this).append(img);            
            $(this).append(map);
            $(this).append(img1);
            $(this).append(input);
            $(this).parent().attr('width',sett.size);
            $(this).parent().attr('height',sett.size);
            
            return true;
        }
     });
})(jQuery, window)
