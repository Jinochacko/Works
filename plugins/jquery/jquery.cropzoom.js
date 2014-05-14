	/*
	 CropZoom v1.2
	 Release Date: April 17, 2010
	
	 Copyright (c) 2010 Gaston Robledo
	 */
	;
	(function ($) {
	
	    $.fn.cropzoom = function (options) {
	    	var elementId = $(this).attr('id');
	
	        return this
	            .each(function () {
	
	                var _self = null;
	                var tMovement = null;
	                var $selector = null;
	                var $image = null;
	
	                var defaults = {
	                    width: options.image.width,
	                    height: options.image.height,
	                    bgColor: '#000',
	                    overlayColor: '#000',
	                    selector: {
	                        x: 0,
	                        y: 0,
	                        w: options.selector.width,
	                        h: options.selector.height,
	                        aspectRatio: false,
	                        centered: false,
	                        borderColor: 'yellow',
	                        borderColorHover: 'red',
	                        bgInfoLayer: '#FFF',
	                        infoFontSize: 10,
	                        infoFontColor: 'blue',
	                        showPositionsOnDrag: true,
	                        showDimetionsOnDrag: true,
	                        maxHeight: null,
	                        maxWidth: null,
	                        startWithOverlay: false,
	                        hideOverlayOnDragAndResize: true,
	                        onSelectorDrag: null,
	                        onSelectorDragStop: null,
	                        onSelectorResize: null,
	                        onSelectorResizeStop: null
	                    },
	                    image: {
	                        source: '',
	                        rotation: 0,
	                        width: '',
	                        height: '',
	                        minZoom: 10,
	                        maxZoom: 150,
	                        startZoom: 0,
	                        x: 0,
	                        y: 0,
	                        useStartZoomAsMinZoom: false,
	                        snapToContainer: false,
	                        onZoom: null,
	                        onRotate: null,
	                        onImageDrag: null
	                    },
	                    enableRotation: true,
	                    enableZoom: true,
	                    zoomSteps: 1,
	                    rotationSteps: 5,
	                    expose: {
	                        slidersOrientation: 'vertical',
	                        zoomElement: '',
	                        rotationElement: '',
	                        elementMovement: '',
	                        movementSteps: 5
	                    }
	                };
	
	                var $options = $.extend(true, defaults, options);
	
	
	                // Check for the plugins needed
	                if (!$.isFunction($.fn.draggable)
	                    || !$.isFunction($.fn.resizable)
	                    || !$.isFunction($.fn.slider)) {
	                    alert("You must include ui.draggable, ui.resizable and ui.slider to use cropZoom");
	                    //return;
	                }
	                _self = $(this);
	                //Preserve options
	                setData('options', $options);
	                _self.empty();
	                _self.css({
	                    'width': $options.width,
	                    'height': $options.height,
	                    'background-color': $options.bgColor,
	                    'overflow': 'hidden',
	                    'position': 'relative',
	                    'border': '2px solid #333',
	                    'cursor': 'move'
	                });
	             
	                setData('image', {
	                    h: $options.image.height,
	                    w: $options.image.width,
	                    posY: $options.image.y,
	                    posX: $options.image.x,
	                    scaleX: 0,
	                    scaleY: 0,
	                    rotation: $options.image.rotation,
	                    source: $options.image.source,
	                    bounds: [ 0, 0, 0, 0 ],
	                    id: 'image_to_crop_' + _self[0].id
	                });
	
	                calculateFactor();
	                getCorrectSizes();

	                setData(
	                    'selector',
	                    {
	                        x: $options.selector.x,
	                        y: $options.selector.y,
	                        w: ($options.selector.maxWidth != null ? ($options.selector.w > $options.selector.maxWidth ? $options.selector.maxWidth
	                            : $options.selector.w)
	                            : $options.selector.w),
	                        h: ($options.selector.maxHeight != null ? ($options.selector.h > $options.selector.maxHeight ? $options.selector.maxHeight
	                            : $options.selector.h)
	                            : $options.selector.h)
	                    });
	
	
	                $container = $("<div />").attr("id", "k").css({
	                    'width': $options.width,
	                    'height': $options.height,
	                    'position': 'absolute'
	                });
	
	      	$image = $('<img id="'+elementId+'_popup_img" />');
		    $image.attr('src',  $('#'+elementId+'_popup_img'));
	                $($image).css({
	                    'position': 'absolute',
	                    'left': getData('image').posX,
	                    'top': getData('image').posY,
	                    'width': getData('image').w,
	                    'height': getData('image').h
	                });
	
	                var ext = getExtensionSource();
	                if (ext == 'png' || ext == 'gif')
	                    $image.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
	                        + $options.image.source
	                        + "',sizingMethod='scale');";
	
	                $container.append($image);
	                _self.append($container);
	
	                calculateTranslationAndRotation();
	          
	                // adding draggable to the image
	                $($image).draggable({
	                    refreshPositions: true,
	                    drag: function (event, ui) {
				var topStripHeight=($options.image.cropAreaHeight-$options.selector.height)/2;
				var sideStripWidth=($options.image.cropAreaWidth-$options.selector.width)/2;
				var yLimit=-1*(parseFloat($image.css('height'))-options.selector.height-topStripHeight);
				var xLimit=-1*(parseFloat($image.css('width'))-options.selector.width-sideStripWidth);
	                        if (ui.position.top > topStripHeight) { 
	                             getData('image').posY = getSnapTop();
	                         } 
				else if (ui.position.top < yLimit) { 
	                             getData('image').posY = getSnapTop();
	                         } 
				else
				{
				     getData('image').posY = ui.position.top;
				}

	                         if (ui.position.left > sideStripWidth) { 
	                             getData('image').posX = getSnapLeft();
	                         } 
				else if (ui.position.left < xLimit) { 
	                             getData('image').posX =getSnapLeft();
	                         } 
				else
				{
					 getData('image').posX = ui.position.left;
				}

				console.log("top:"+ui.position.top+" left:"+ui.position.left)
				console.log("xlimit:"+xLimit+" ylimit:"+yLimit)
                              	
	                    },
	                    stop: function (event, ui) {
	 
	                      var topStripHeight=($options.image.cropAreaHeight-$options.selector.height)/2;
				var sideStripWidth=($options.image.cropAreaWidth-$options.selector.width)/2;
				var yLimit=-1*(parseFloat($image.css('height'))-options.selector.height-topStripHeight);
				var xLimit=-1*(parseFloat($image.css('width'))-options.selector.width-sideStripWidth);
  			
	            if (ui.position.top <=topStripHeight&&ui.position.top>=yLimit&&ui.position.left<=sideStripWidth&&ui.position.left>=xLimit) { 
	                            
	            } 
				else{
				if ($options.image.snapToContainer)
	                             limitBounds(ui);

	                         $('#'+elementId+'_popup_img').css({
	                            'transform': rotation,
	                             '-webkit-transform': rotation,
	                             '-ms-transform': rotation,
	                             'msTransform': rotation,
	                             'top': getData('image').posY,
	                             'left': getData('image').posX
	                         });
				}
				createSelector();
	                    }
	                });
	
	                // Create the selector
	                createSelector();
	                // Add solid color to the selector
	                _self.find('.ui-icon-gripsmall-diagonal-se').css({
	                    'background': '#FFF',
	                    'border': '1px solid #000',
	                    'width': 8,
	                    'height': 8
	                });
	                // Create the dark overlay
	                createOverlay();
	
	                if ($options.selector.startWithOverlay) {
	                    /* Make Overlays at Start */
	                    var ui_object = {
	                        position: {
	                            top: $selector.position().top,
	                            left: $selector.position().left
	                        }
	                    };
	                    makeOverlayPositions(ui_object);
	                }
	                /* End Make Overlay at start */
	
	                // Create zoom control
	                if ($options.enableZoom) {
	                    $('#' + elementId + '_zoomContainer').remove();
	                    createZoomSlider();
	                }
	                // Create rotation control
	                if ($options.enableRotation)
	                    createRotationSlider();
	                if ($options.expose.elementMovement != '')
	                    createMovementControls();
	
	                function limitBounds(ui) {
	                    if (ui.position.top > 0)
	                        getData('image').posY = 0;
	                    if (ui.position.left > 0)
	                        getData('image').posX = 0;
	
	                    var bottom = -(getData('image').h - ui.helper.parent()
	                        .parent().height()), right = -(getData('image').w - ui.helper
	                        .parent().parent().width());
	                    if (ui.position.top < bottom)
	                        getData('image').posY = bottom;
	                    if (ui.position.left < right)
	                        getData('image').posX = right;
	                    calculateTranslationAndRotation();
	                }
	
	                function getExtensionSource() {
	                    var parts = $options.image.source.split('.');
	                    return parts[parts.length - 1];
	                }
	                ;

			 function getSnapTop() {
	                    	if(parseFloat($image.css('height'))<$options.image.cropAreaHeight)
				{
					var topStripHeight=($options.image.cropAreaHeight-$options.selector.height)/2;
					return topStripHeight;
				}
				else
				{
					return 0;
				}
	                }
	                ;

			function getSnapLeft() {
	                    	if(parseFloat($image.css('width'))<$options.image.cropAreaWidth)
				{
					var sideStripWidth=($options.image.cropAreaWidth-$options.selector.width)/2;
					return sideStripWidth;
				}
				else
				{
					return 0;
				}
	                }
	                ;
	
	                function calculateFactor() {
	                    getData('image').scaleX = ($options.width / getData('image').w);
	                    getData('image').scaleY = ($options.height / getData('image').h);
	                }
	                ;
	
	                function getCorrectSizes() {
	                    if ($options.image.startZoom != 0) {
	                        var zoomInPx_width = (($options.image.width * Math
	                            .abs($options.image.startZoom)) / 100);
	                        var zoomInPx_height = (($options.image.height * Math
	                            .abs($options.image.startZoom)) / 100);
	                        getData('image').h = zoomInPx_height;
	                        getData('image').w = zoomInPx_width;
	                        //Checking if the position was set before
	                        if (getData('image').posY != 0
	                            && getData('image').posX != 0) {
	                            if (getData('image').h > $options.height)
	                                getData('image').posY = Math
	                                    .abs(($options.height / 2)
	                                        - (getData('image').h / 2));
	                            else
	                                getData('image').posY = (($options.height / 2) - (getData('image').h / 2));
	                            if (getData('image').w > $options.width)
	                                getData('image').posX = Math
	                                    .abs(($options.width / 2)
	                                        - (getData('image').w / 2));
	                            else
	                                getData('image').posX = (($options.width / 2) - (getData('image').w / 2));
	                        }
	                    } else {
	                        var scaleX = getData('image').scaleX;
	                        var scaleY = getData('image').scaleY;
	                        if (scaleY < scaleX) {
	                            getData('image').h = $options.height;
	                            getData('image').w = Math
	                                .round(getData('image').w * scaleY);
	                        } else {
	                            getData('image').h = Math
	                                .round(getData('image').h * scaleX);
	                            getData('image').w = $options.width;
	                        }
	                    }
	
	                    // Disable snap to container if is little
	                    if (getData('image').w < $options.width
	                        && getData('image').h < $options.height) {
	                        $options.image.snapToContainer = false;
	                    }
	                    calculateTranslationAndRotation();
	
	                }
	                ;
	
	                function calculateTranslationAndRotation() {
	                   
	                    $(function () {
	                        adjustingSizesInRotation();
	                        rotation = "rotate(" + getData('image').rotation + "deg)";
	                        if(getData('image').posY > 0)
	                            getData('image').posY = 0;
	                        if(getData('image').posX > 0)
	                            getData('image').posX = 0;
                               
				var sideStripWidth=(options.image.cropAreaWidth-options.selector.width)/2;
				//set initial image positions here
	                        $($image).css({
	                            'transform': rotation,
	                            '-webkit-transform': rotation,
	                            '-ms-transform': rotation,
	                            'msTransform': rotation,
	                            'left': sideStripWidth
	                        });
	                    });
	                }
	                ;
	
	               
	
	                function createZoomSlider() {
	                    var zoomContainerSlider = $("<div />").attr('id',
	                            elementId + '_zoomContainer').mouseover(function () {
	                            $(this).css('opacity', 1);
	                        }).mouseout(function () {
	                            $(this).css('opacity', 0.6);
	                        });
	
	                    var zoomMin = $('<div />').attr('id', elementId + '_zoomMin').html(
	                        "<b>Min</b>");
	                    var zoomMax = $('<div />').attr('id', elementId + '_zoomMax').html(
	                        "<b>Max</b>");
	
	                    var $slider = $("<div />").attr('id', elementId + '_zoomSlider');
	
	                    // Apply Slider
	                    $slider
	                        .slider({
	                            orientation: ($options.expose.zoomElement != '' ? $options.expose.slidersOrientation
	                                : 'horizontal'),
	                            value: ($options.image.startZoom != 0 ? $options.image.startZoom
	                                : getPercentOfZoom(getData('image'))),
	                            min: ($options.image.useStartZoomAsMinZoom ? $options.image.startZoom
	                                : $options.image.minZoom),
	                            max: $options.image.maxZoom,
	                            step: (($options.zoomSteps > $options.image.maxZoom || $options.zoomSteps < 0) ? 1
	                                : $options.zoomSteps),
	                            slide: function (event, ui) { 
	                                var value = ($options.expose.slidersOrientation == 'horizontal' ? ($options.image.maxZoom - ui.value)
	                                    : ui.value);
					
	                                var zoomInPx_width = ($options.image.width * (Math.abs(value) / 40));
	                                var zoomInPx_height = ($options.image.height * (Math.abs(value) / 40));

	                                $($image).css({
	                                    'width': zoomInPx_width + "px",
	                                    'height': zoomInPx_height + "px"
	                                });
	                                createSelector();
	     
	                                var difX = (getData('image').w / 2) - (zoomInPx_width / 2);
	                                var difY = (getData('image').h / 2) - (zoomInPx_height / 2);
	                                if(value==(40+$options.zoomSteps)){
		                         		var img_top=parseInt($('#'+elementId+'_popup_img').css('top').replace('px',''));
		                         		var img_left=parseInt($('#'+elementId+'_popup_img').css('left').replace('px',''));
		                         		getData('image').posX = img_left;
		                                getData('image').posY = img_top;
	                                	}
	                                var newX = (difX > 0 ? getData('image').posX
	                                    + Math.abs(difX)
	                                    : getData('image').posX
	                                    - Math.abs(difX));
	                                var newY = (difY > 0 ? getData('image').posY
	                                    + Math.abs(difY)
	                                    : getData('image').posY
	                                    - Math.abs(difY));
	                                getData('image').posX = newX;
	                                getData('image').posY = newY;
					
 					 $($image).css({
	                                    'top': newY + "px",
	                                    'left': newX + "px"
	                                });
				console.log('newX:'+newX+" newY:"+newY);
	                                getData('image').w = zoomInPx_width;
	                                getData('image').h = zoomInPx_height;
	                                calculateFactor();
	                                //calculateTranslationAndRotation();
	                                if ($options.image.onZoom != null) {
	                                    $options.image.onZoom($image,
	                                        getData('image'));
	                                }

	                            }
	                        });
	
	                    if ($options.slidersOrientation == 'vertical') {
	                        zoomContainerSlider.append(zoomMax);
	                        zoomContainerSlider.append($slider);
	                        zoomContainerSlider.append(zoomMin);
	                    } else {
	                        zoomContainerSlider.append(zoomMin);
	                        zoomContainerSlider.append($slider);
	                        zoomContainerSlider.append(zoomMax);
	                    }
	
	                    if ($options.expose.zoomElement != '') {
	                        zoomMin
	                            .addClass($options.expose.slidersOrientation);
	                        zoomMax
	                            .addClass($options.expose.slidersOrientation);
	                        $slider
	                            .addClass($options.expose.slidersOrientation);
	                        zoomContainerSlider
	                            .addClass($options.expose.slidersOrientation);
	                        $($options.expose.zoomElement).empty().append(
	                            zoomContainerSlider);
	                    } else {
	                        zoomMin.addClass('horizontal');
	                        zoomMax.addClass('horizontal');
	                        $slider.addClass('horizontal');
	                        zoomContainerSlider.addClass('horizontal');
	                        zoomContainerSlider.css({
	                            'position': 'absolute',
	                            'top': 327,
	                            'right': 63,
	                            'opacity': 0.6
	                        });
	                        if($('.pop').hasClass('pop_thumb') && elementId.indexOf('thumb') != -1){
	                        	$('.pop_thumb').append(zoomContainerSlider);
	                        } else {
	                        	$('.pop:first').append(zoomContainerSlider);
	                    	}
	                    }
	                }
	                ;
	
	                function getPercentOfZoom() {
	                    var percent = 0;
	                    if (getData('image').w > getData('image').h) {
	                        percent = $options.image.maxZoom
	                            - ((getData('image').w * 100) / $options.image.width);
	                    } else {
	                        percent = $options.image.maxZoom
	                            - ((getData('image').h * 100) / $options.image.height);
	                    }
	                    return percent;
	                }
	                ;
	
	                function createSelector() { 
	                    if ($options.selector.centered) {
				var y_image=(parseFloat($image.css('top')) < 0) ? parseFloat($image.css('top')) * -1 : parseFloat($image.css('top')); 
				var x_image= (parseFloat($image.css('left')) < 0) ? parseFloat($image.css('left')) * -1 :parseFloat($image.css('left')); 
	                        getData('selector').y = y_image+(($options.image.height-$options.selector.height)/2);
	                        getData('selector').x = x_image;

	                    }
	
	                    $selector = $('<div/>')
	                        .attr('id', _self[0].id + '_selector')
	                        .css(
	                        {
	                            'width': getData('selector').w,
	                            'height': getData('selector').h,
	                            'top': getData('selector').y
	                                + 'px',
	                            'left': getData('selector').x
	                                + 'px',
	                            'border': '1px dashed '
	                                + $options.selector.borderColor,
	                            'position': 'absolute',
	                        })
	                        .mouseover(
	                        function () {
	                            $(this)
	                                .css(
	                                {
	                                    'border': '1px dashed '
	                                        + $options.selector.borderColorHover
	                                });
	                        })
	                        .mouseout(
	                        function () {
	                            $(this)
	                                .css(
	                                {
	                                    'border': '1px dashed '
	                                        + $options.selector.borderColor
	                                });
	                        });
	                    // Add draggable to the selector
	                    $selector
	                        .resizable({
	                            aspectRatio: $options.selector.aspectRatio,
	                            maxHeight: $options.selector.maxHeight,
	                            maxWidth: $options.selector.maxWidth,
	                            minHeight: $options.selector.h,
	                            minWidth: $options.selector.w,
	                            containment: 'parent',
	                            resize: function (event, ui) {
	                                // update ovelay position
	                                getData('selector').w = $selector
	                                    .width();
	                                getData('selector').h = $selector
	                                    .height();
	                                makeOverlayPositions(ui);
	                                showInfo();
	                                if ($options.selector.onSelectorResize != null)
	                                    $options.selector.onSelectorResize(
	                                        $selector,
	                                        getData('selector'));
	                            },
	                            stop: function (event, ui) {
	                                if ($options.selector.hideOverlayOnDragAndResize)
	                                    //hideOverlay();
	                                if ($options.selector.onSelectorResizeStop != null)
	                                    $options.selector
	                                        .onSelectorResizeStop(
	                                            $selector,
	                                            getData('selector'));
	                            }
	                        });
	
	                    showInfo($selector);
	                    // add selector to the main container
	                    _self.append($selector);
	                }
	                ;
	
	                function showInfo() {
	
	                    var _infoView = null;
	                    var alreadyAdded = false;
	                    if ($selector.find("#infoSelector").length > 0) {
	                        _infoView = $selector.find("#infoSelector");
	                    } else {
	                        _infoView = $('<div />')
	                            .attr('id', 'infoSelector')
	                            .css(
	                            {
	                                'position': 'absolute',
	                                'top': 0,
	                                'left': 0,
	                                'background': $options.selector.bgInfoLayer,
	                                'opacity': 0,
	                                'font-size': $options.selector.infoFontSize
	                                    + 'px',
	                                'font-family': 'Arial',
	                                'color': $options.selector.infoFontColor,
	                                'width': '100%'
	                            });
	                    }
	                    if ($options.selector.showPositionsOnDrag) {
	                        _infoView.html("X:" + Math.round(getData('selector').x)
	                            + "px - Y:" + Math.round(getData('selector').y) + "px");
	                        alreadyAdded = true;
	                    }
	                    if ($options.selector.showDimetionsOnDrag) {
	                        if (alreadyAdded) {
	                            _infoView.html(_infoView.html() + " | W:"
	                                + getData('selector').w + "px - H:"
	                                + getData('selector').h + "px");
	                        } else {
	                            _infoView.html("W:" + getData('selector').w
	                                + "px - H:" + getData('selector').h
	                                + "px");
	                        }
	                    }
	                    $selector.append(_infoView);
	                }
	                ;
	
	                function createOverlay() {
	                    var arr = [ 't', 'b', 'l', 'r' ];
	                    $.each(arr, function () {
	                        var divO = $("<div />").attr("id", this).css({
	                            'overflow': 'hidden',
	                            'background': $options.overlayColor,
	                            'opacity': 0.6,
	                            'position': 'absolute',
	                            'z-index': 2,
	                            'visibility': 'visible'
	                        });
	                        _self.append(divO);
	                    });
	                }
	                ;
	
	                function makeOverlayPositions(ui) {
				var topStripHeight=($options.image.cropAreaHeight-$options.selector.height)/2;
				var sideStripWidth=($options.image.cropAreaWidth-$options.selector.width)/2;
                                console.log('topStripHeight:'+topStripHeight+',sideStripWidth:'+sideStripWidth);
 				console.log('bottomstriptop:'+(ui.position.top + $options.selector.height+topStripHeight)+',sideStripleft:'+(sideStripWidth+$options.selector.width));
	                    _self.find("#t").css({
	                        "display": "block",
	                        "width": $options.image.cropAreaWidth,
	                        'height': topStripHeight,
	                        'left': 0,
	                        'top': 0
	                    });
	                    _self.find("#b").css(
	                        {
	                            "display": "block",
	                            "width": $options.image.cropAreaWidth,
	                            'height': topStripHeight,
	                            'top': ($options.selector.height+topStripHeight)
	                                + "px",
	                            'left': 0
	                        });
	                    _self.find("#l").css({
	                        "display": "block",
	                        'left': 0,
	                        'top': topStripHeight,
	                        'width': sideStripWidth,
	                        'height': $options.selector.height
	                    });
	                    console.log("topStripHeight-"+topStripHeight);
			    console.log("sideStripWidth-"+sideStripWidth);
			console.log("right left-"+(sideStripWidth+$options.selector.width));
			console.log("bottom width-"+$options.image.cropAreaWidth);
	                    _self.find("#r").css(
	                        {
	                            "display": "block",
	                            'top': topStripHeight,
	                            'left': sideStripWidth+$options.selector.width,
	                            'width': sideStripWidth,
	                            'height': $options.selector.height
	                        });
	                }
	                ;
	
	                _self.makeOverlayPositions = makeOverlayPositions;
	
	                function hideOverlay() {
	                    //_self.find("#t").hide();
	                    //_self.find("#b").hide();
	                    //_self.find("#l").hide();
	                    //_self.find("#r").hide();
	                }
	
	                function setData(key, data) {
	                    _self.data(key, data);
	                }
	                ;
	
	                function getData(key) {
	                    return _self.data(key);
	                }
	                ;
	
	                function adjustingSizesInRotation() {
	                    var angle = getData('image').rotation * Math.PI / 180;
	                    var sin = Math.sin(angle);
	                    var cos = Math.cos(angle);
	
	                    // (0,0) stays as (0, 0)
	
	                    // (w,0) rotation
	                    var x1 = cos * getData('image').w;
	                    var y1 = sin * getData('image').w;
	
	                    // (0,h) rotation
	                    var x2 = -sin * getData('image').h;
	                    var y2 = cos * getData('image').h;
	
	                    // (w,h) rotation
	                    var x3 = cos * getData('image').w - sin * getData('image').h;
	                    var y3 = sin * getData('image').w + cos * getData('image').h;
	
	                    var minX = Math.min(0, x1, x2, x3);
	                    var maxX = Math.max(0, x1, x2, x3);
	                    var minY = Math.min(0, y1, y2, y3);
	                    var maxY = Math.max(0, y1, y2, y3);
	
	                    getData('image').rotW = maxX - minX;
	                    getData('image').rotH = maxY - minY;
	                    getData('image').rotY = minY;
	                    getData('image').rotX = minX;
	                };
	
	                function createMovementControls() {
	                    var table = $('<table>\
	                                    <tr>\
	                                    <td></td>\
	                                    <td></td>\
	                                    <td></td>\
	                                    </tr>\
	                                    <tr>\
	                                    <td></td>\
	                                    <td></td>\
	                                    <td></td>\
	                                    </tr>\
	                                    <tr>\
	                                    <td></td>\
	                                    <td></td>\
	                                    <td></td>\
	                                    </tr>\
	                                    </table>');
	                    var btns = [];
	                    btns.push($('<div />').addClass('mvn_no mvn'));
	                    btns.push($('<div />').addClass('mvn_n mvn'));
	                    btns.push($('<div />').addClass('mvn_ne mvn'));
	                    btns.push($('<div />').addClass('mvn_o mvn'));
	                    btns.push($('<div />').addClass('mvn_c'));
	                    btns.push($('<div />').addClass('mvn_e mvn'));
	                    btns.push($('<div />').addClass('mvn_so mvn'));
	                    btns.push($('<div />').addClass('mvn_s mvn'));
	                    btns.push($('<div />').addClass('mvn_se mvn'));
	                    
	                    for (var i = 0; i < btns.length; i++) {
	                        // for each buttons that were created above,
	                        // attach action listeners
	                        btns[i].mousedown(function () {
	                            moveImage(this);
	                        }).mouseup(function () {
	                            clearTimeout(tMovement);
	                        }).mouseout(function () {
	                            clearTimeout(tMovement);
	                        });
	                        // find the correct position in the placeholder table and add them
	                        table.find('td:eq(' + i + ')').append(btns[i]);
	                    }
	                    
	                    // find the container in the view, empty it up and append the table
	                    $($options.expose.elementMovement).empty().append(table);
	                }
	                ;
	
	                function moveImage(obj) {
	
	                    if ($(obj).hasClass('mvn_no')) {
	                        getData('image').posX = (getData('image').posX - $options.expose.movementSteps);
	                        getData('image').posY = (getData('image').posY - $options.expose.movementSteps);
	                    } else if ($(obj).hasClass('mvn_n')) {
	                        getData('image').posY = (getData('image').posY - $options.expose.movementSteps);
	                    } else if ($(obj).hasClass('mvn_ne')) {
	                        getData('image').posX = (getData('image').posX + $options.expose.movementSteps);
	                        getData('image').posY = (getData('image').posY - $options.expose.movementSteps);
	                    } else if ($(obj).hasClass('mvn_o')) {
	                        getData('image').posX = (getData('image').posX - $options.expose.movementSteps);
	                    } else if ($(obj).hasClass('mvn_c')) {
	                        getData('image').posX = ($options.width / 2)
	                            - (getData('image').w / 2);
	                        getData('image').posY = ($options.height / 2)
	                            - (getData('image').h / 2);
	                    } else if ($(obj).hasClass('mvn_e')) {
	                        getData('image').posX = (getData('image').posX + $options.expose.movementSteps);
	                    } else if ($(obj).hasClass('mvn_so')) {
	                        getData('image').posX = (getData('image').posX - $options.expose.movementSteps);
	                        getData('image').posY = (getData('image').posY + $options.expose.movementSteps);
	                    } else if ($(obj).hasClass('mvn_s')) {
	                        getData('image').posY = (getData('image').posY + $options.expose.movementSteps);
	                    } else if ($(obj).hasClass('mvn_se')) {
	                        getData('image').posX = (getData('image').posX + $options.expose.movementSteps);
	                        getData('image').posY = (getData('image').posY + $options.expose.movementSteps);
	                    }
	                    if ($options.image.snapToContainer) {
	                        if (getData('image').posY > 0) {
	                            getData('image').posY = 0;
	                        }
	                        if (getData('image').posX > 0) {
	                            getData('image').posX = 0;
	                        }
	
	                        var bottom = -(getData('image').h - _self.height());
	                        var right = -(getData('image').w - _self.width());
	                        if (getData('image').posY < bottom) {
	                            getData('image').posY = bottom;
	                        }
	                        if (getData('image').posX < right) {
	                            getData('image').posX = right;
	                        }
	                    }
	                    calculateTranslationAndRotation();
	                    tMovement = setTimeout(function () {
	                        moveImage(obj);
	                    }, 100);
	                };
	
	                $.fn.cropzoom.updateOverlayPosition = function(ui){
	                    _self.makeOverlayPositions(ui);
	                };
	
	                $.fn.cropzoom.getParameters = function (_self, custom) {
	                    var image = _self.data('image');
	                    var selector = _self.data('selector');
	
	                    var fixed_data = {
	                        'viewPortW': _self.width(),
	                        'viewPortH': _self.height(),
	                        'imageX': image.posX,
	                        'imageY': image.posY,
	                        'imageRotate': image.rotation,
	                        'imageW': image.w,
	                        'imageH': image.h,
	                        'imageSource': image.source,
	                        'selectorX': selector.x,
	                        'selectorY': selector.y,
	                        'selectorW': selector.w,
	                        'selectorH': selector.h
	                    };
	
	                    return $.extend(fixed_data, custom);
	                };
	
	                $.fn.cropzoom.getSelf = function () {
	                    return _self;
	                };
	               
	                return this;
	            });
	
	    };

	    $.fn.extend({

	        setSelector: function (x, y, w, h, animate) {
	
	            var _self = $(this);
	            _self.data('selector', {
	                x: x,
	                y: y,
	                w: w,
	                h: h
	            });
	            var ui_object = {
	                position : {
	                    top : y,
	                    left : x
	                }
	            };
	            if (animate != undefined && animate == true) {
	                _self.find('#' + _self[0].id + '_selector').animate({
	                    'top': y,
	                    'left': x,
	                    'width': w,
	                    'height': h
	                }, 'slow', function(){
	                    if (_self.data('options').selector.startWithOverlay) {
	                        _self.cropzoom.updateOverlayPosition(ui_object);
	                    }
	                } );
	            } else {
	                _self.find('#' + _self[0].id + '_selector').css({
	                    'top': y,
	                    'left': x,
	                    'width': w,
	                    'height': h
	                });
	                if ($(this).data('options').selector.startWithOverlay) {
	                   _self.cropzoom.updateOverlayPosition(ui_object);
	                }
	            }
	        },
	        resizeImage: function (w, h){
	            var obj = $(this);
	            var elementId = obj.attr('id');
	            var $options = obj.data('options');
	                $options.width = $options.selector.width;
	                $options.height = $options.selector.height;

	                var orgImgWidth = w;
	                var orgImgHeight = h;
	                obj.data('image').source = $('#'+elementId+'_popup_img').attr('src');

	                if($options.scaleMethod=='width'){
	                   var newImgWidth = $options.width;
	                   var newImgHeight = $options.width * (orgImgHeight / orgImgWidth);
	                   obj.data('image').w = newImgWidth;  
	                   obj.data('image').h = newImgHeight;
	                   $('#'+elementId+'_popup_img').width(newImgWidth);
	                   $('#'+elementId+'_popup_img').height(newImgHeight);
	                }
	                else {
	                   var newImgWidth = $options.height * (orgImgWidth / orgImgHeight);
	                   var newImgHeight = $options.height;
	                   obj.data('image').w = newImgWidth;
	                   obj.data('image').h = newImgHeight;
	                   $('#'+elementId+'_popup_img').width(newImgWidth);
	                   $('#'+elementId+'_popup_img').height(newImgHeight);
	                }
	                $options.image.width = newImgWidth;
	                $options.image.height = newImgHeight;

			var topStripHeight=($options.image.cropAreaHeight-$options.selector.height)/2;
			var imageTop=(-1)*(newImgHeight/2-($options.selector.height/2+topStripHeight));
			var sideStripWidth=($options.image.cropAreaWidth-$options.selector.width)/2;
  			var imageLeft=(-1)*(newImgWidth/2-($options.selector.width/2+sideStripWidth))
			if($options.scaleMethod=='width') {
  				$('#'+elementId+'_popup_img').css({
	                            'transform': rotation,
	                            '-webkit-transform': rotation,
	                            '-ms-transform': rotation,
	                            'msTransform': rotation,
	                            'top': imageTop,
	                            'left': sideStripWidth
	                        });
			}
			else {
				$('#'+elementId+'_popup_img').css({
	                            'transform': rotation,
	                            '-webkit-transform': rotation,
	                            '-ms-transform': rotation,
	                            'msTransform': rotation,
	                            'top': topStripHeight,
	                            'left': imageLeft
	                        });
			}

	        },
	        // Restore the Plugin
	        restore: function () {
	            var obj = $(this);
	            var $options = obj.data('options');
	            obj.empty();
	            obj.data('image', {});
	            obj.data('selector', {});
	            if ($options.expose.zoomElement != "") {
	                $($options.expose.zoomElement).empty();
	            }
	            if ($options.expose.rotationElement != "") {
	                $($options.expose.rotationElement).empty();
	            }
	            if ($options.expose.elementMovement != "") {
	                $($options.expose.elementMovement).empty();
	            }
	            obj.cropzoom($options);
	
	        },
	        // Send the Data to the Server
	        send: function (url, type, custom, onSuccess) {
	        	var _self = $(this);
	        	var elementId = _self.attr('id');
      			var $options = _self.data('options');
      			var topStripHeight=($options.image.cropAreaHeight-$options.selector.height)/2;
      			var sideStripWidth=($options.image.cropAreaWidth-$options.selector.width)/2;
				var img_top=parseInt($('#'+elementId+'_popup_img').css('top').replace('px',''));
				var img_left=parseInt($('#'+elementId+'_popup_img').css('left').replace('px',''));
				var selX=0;
				var selY=0;
				if(img_top<0)
				{
					selY=topStripHeight+((-1)*(img_top));	
				}
				else{
					selY=(topStripHeight-img_top);
				}

				if(img_left<0)
				{
					selX=sideStripWidth+((-1)*(img_left));	
				}
				else{
					selX=(sideStripWidth-img_left);
				}
				
				_self.data('selector').x=selX;
				_self.data('selector').y=selY;

			
	           
	            $.ajax({
	                url: url,
	                type: type,
	                data: (_self.cropzoom.getParameters(_self, custom)),
	                success: function (r) {
	                    _self.data('imageResult', r);
	                    if (onSuccess !== undefined && onSuccess != null)
	                        onSuccess(r);
	                }
	            });
	        }
	    });
	
	})(jQuery);
	
	(function($) {
	    $.support.touch = 'ontouchend' in document;
	    if (!$.support.touch) {
	        return;
	    }
	    var mouseProto = $.ui.mouse.prototype,
	        _mouseInit = mouseProto._mouseInit,
	        touchHandled;
	    function simulateMouseEvent(event, simulatedType) {
	        if (event.originalEvent.touches.length > 1) {
	            return;
	        }
	
	        event.preventDefault();
	
	        var touch = event.originalEvent.changedTouches[0],
	            simulatedEvent = document.createEvent('MouseEvents');
	        simulatedEvent.initMouseEvent(
	            simulatedType, // type
	            true, // bubbles
	            true, // cancelable
	            window, // view
	            1, // detail
	            touch.screenX, // screenX
	            touch.screenY, // screenY
	            touch.clientX, // clientX
	            touch.clientY, // clientY
	            false, // ctrlKey
	            false, // altKey
	            false, // shiftKey
	            false, // metaKey
	            0, // button
	            null // relatedTarget
	        );
	        event.target.dispatchEvent(simulatedEvent);
	    }
	    mouseProto._touchStart = function(event) {
	
	        var self = this;
	        if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
	            return;
	        }
	        touchHandled = true;
	        self._touchMoved = false;
	        simulateMouseEvent(event, 'mouseover');
	        simulateMouseEvent(event, 'mousemove');
	        simulateMouseEvent(event, 'mousedown');
	    };
	    mouseProto._touchMove = function(event) {
	        if (!touchHandled) {
	            return;
	        }
	        this._touchMoved = true;
	        simulateMouseEvent(event, 'mousemove');
	    };
	    mouseProto._touchEnd = function(event) {
	        if (!touchHandled) {
	            return;
	        }
	
	        simulateMouseEvent(event, 'mouseup');
	        simulateMouseEvent(event, 'mouseout');
	        if (!this._touchMoved) {
	            simulateMouseEvent(event, 'click');
	        }
	
	        touchHandled = false;
	    };
	    mouseProto._mouseInit = function() {
	
	        var self = this;
	        self.element.bind('touchstart', $.proxy(self, '_touchStart'))
	            .bind('touchmove', $.proxy(self, '_touchMove'))
	            .bind('touchend', $.proxy(self, '_touchEnd'));
	
	        _mouseInit.call(self);
	    };
	
	})(jQuery); 