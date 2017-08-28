'use strict';
/*
    js公共类库
*/
(function (w) {

    function App() {}
    App.prototype = {
        slide:function(obj){
            // obj={
            //     dom:'',//slider-dom
            //     arguments:{
            //         animation: 'fade',
            //         autoplay: true,
            //       //   arrows: true,
            //         delay: 5000
            //     },
            //     fn:function(slide){
            //     }
            // }
            $(obj.dom).each(function(i,v){
                var $t=$(this);
                var obj1={};
                $.extend(obj1,obj)
                if(obj1.arguments.selectors){
                    var ss=obj1.arguments.selectors;
                    if($t.find(ss.container).find(ss.slides).length<=1){
                        obj1.arguments.nav=false;
                        remove_arrow();
                    }
                }else if($t.children('ul:first').children('li').length<=1){
                    obj1.arguments.nav=false;
                    obj1.arguments.infinite=false;
                    remove_arrow();
                }else{
                    obj1.arguments.nav=true;
                }
                function remove_arrow(){
                    $t.parents('.slider-boxs').find('.slider-arrows').hide();
                }
                var slider = $(this).unslider(obj1.arguments);

                var slider_data = slider.data('unslider');
                if(obj1.arguments.autoplay){
                    slider.hover(function() {
                      slider_data.stop();
                    }, function() {
                      slider_data.start();
                    });
                }
                function lazy_fade(slide) {
                  slide.find('img.lazy_img').show();
                  if (obj1.arguments.animation != 'fade') {
                    return false
                  }
                  var all_s = slide.siblings();
                  if (slide.next().length > 0) {
                    slide = slide.add(slide.next());
                  } else {
                    slide = slide.add(all_s.first());

                  }
                  if (slide.index()>0) {
                    //   console.log(slide.prev())
                    slide = slide.add(slide.prev());
                  } else {
                    slide = slide.add(all_s.last());

                  };
                  all_s.not(slide).find('img.lazy_img').hide();
                  slide.find('img.lazy_img').show().addClass('ssss');
                }
                lazy_fade(slider.find('.unslider-wrap li').first());
                $(window).scroll();
                slider.on('unslider.change', function(event, index, slide) {
                  lazy_fade(slide);
                 var s=setTimeout(function(){
                      $(window).scroll();
                      clearTimeout(s);
                 },obj1.arguments.speed?obj1.arguments.speed:800)
             });
             if(obj1.fn){
                 obj1.fn(slider)
             }
            })
        }
    }

    w.Page = function (obj) {
        for (var i in obj) {
            App.prototype[i] = obj[i];
        }
        var app = new App();
        if ('onLoad' in app) {
            window.onload = function () {
                app.onLoad();
            };
        }
        if ('onReady' in app) {
            $(document).ready(function(){
                app.onReady();
            });
        }
        if('onResize' in app){
            var flag = null;
            $(window).on('resize',function(){
                if (flag) clearTimeout(flag);
                flag = setTimeout(function () {
                    app.onResize()
                }, 120)　
            })
        }
        if ('onScroll' in app) {
            $(window).on('scroll',function(){
                app.onScroll();
            });
        }
        return app;
    }
})(window);



/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

 (function($, window, document, undefined) {
     var $window = $(window);
     $.fn.lazyload = function(options) {
         var elements = this;
         var $container;
         var settings = {
             threshold: 0,
             failure_limit: 0,
             event: 'scroll',
             effect: 'show',
             container: window,
             data_attribute: 'original',
             skip_invisible: true,
             appear: null,
             load: null
         };

         function update() {
             var counter = 0;
             elements.each(function() {
                 var $this = $(this);
                 if (settings.skip_invisible && !$this.is(':visible')) {
                     return;
                 }
                 if ($.abovethetop(this, settings) ||
                     $.leftofbegin(this, settings)) {

                     /* Nothing. */
                 } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                     $this.trigger('appear');
                     /* if we found an image we'll load, reset the counter */
                     counter = 0;
                 } else {
                     if (++counter > settings.failure_limit) {
                         //return false;
                     }
                 }
             });

         }

         if (options) {
             /* Maintain BC for a couple of versions. */
             if (undefined !== options.failurelimit) {
                 options.failure_limit = options.failurelimit;
                 delete options.failurelimit;
             }
             if (undefined !== options.effectspeed) {
                 options.effect_speed = options.effectspeed;
                 delete options.effectspeed;
             }

             $.extend(settings, options);
         }

         /* Cache container as jQuery as object. */
         $container = (settings.container === undefined ||
             settings.container === window) ? $window : $(settings.container);

         /* Fire one scroll event per scroll. Not one scroll event per image. */
         if (0 === settings.event.indexOf('scroll')) {
             $container.bind(settings.event, function(event) {
                 return update();
             });
         }

         this.each(function() {
             var self = this;
             var $self = $(self);

             self.loaded = false;

             /* When appear is triggered load original image. */
             $self.one('appear', function() {
                 if (!this.loaded) {
                     if (settings.appear) {
                         var elements_left = elements.length;
                         settings.appear.call(self, elements_left, settings);
                     }
                     $('<img />')
                         .bind('load', function() {
                             $self
                                 .hide()
                                 .attr('src', $self.data(settings.data_attribute))[settings.effect](settings.effect_speed);
                             self.loaded = true;

                             /* Remove image from array so it is not looped next time. */
                             var temp = $.grep(elements, function(element) {
                                 return !element.loaded;
                             });
                             elements = $(temp);

                             if (settings.load) {
                                 var elements_left = elements.length;
                                 settings.load.call(self, this.width, this.height);
                             }
                         })
                         .attr('src', $self.data(settings.data_attribute));
                 }
             });

             /* When wanted event is triggered load original image */
             /* by triggering appear.                              */
             if (0 !== settings.event.indexOf('scroll')) {
                 $self.bind(settings.event, function(event) {
                     if (!self.loaded) {
                         $self.trigger('appear');
                     }
                 });
             }
         });

         /* Check if something appears when window is resized. */
         $window.bind('resize', function(event) {
             update();
         });

         /* With IOS5 force loading images when navigating with back button. */
         /* Non optimal workaround. */
         if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
             $window.bind('pageshow', function(event) {
                 if (event.originalEvent && event.originalEvent.persisted) {
                     elements.each(function() {
                         $(this).trigger('appear');
                     });
                 }
             });
         }

         /* Force initial check if images should appear. */
         $(document).ready(function() {
             update();
         });

         return this;
     };

     /* Convenience methods in jQuery namespace.           */
     /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

     $.belowthefold = function(element, settings) {
         var fold;

         if (settings.container === undefined || settings.container === window) {
             fold = $window.height() + $window.scrollTop();
         } else {
             fold = $(settings.container).offset().top + $(settings.container).height();
         }

         return fold <= $(element).offset().top - settings.threshold;
     };

     $.rightoffold = function(element, settings) {
         var fold;

         if (settings.container === undefined || settings.container === window) {
             fold = $window.width() + $window.scrollLeft();
         } else {
             fold = $(settings.container).offset().left + $(settings.container).width();
         }

         return fold <= $(element).offset().left - settings.threshold;
     };

     $.abovethetop = function(element, settings) {
         var fold;

         if (settings.container === undefined || settings.container === window) {
             fold = $window.scrollTop();
         } else {
             fold = $(settings.container).offset().top;
         }

         return fold >= $(element).offset().top + settings.threshold + $(element).height();
     };

     $.leftofbegin = function(element, settings) {
         var fold;

         if (settings.container === undefined || settings.container === window) {
             fold = $window.scrollLeft();
         } else {
             fold = $(settings.container).offset().left;
         }

         return fold >= $(element).offset().left + settings.threshold + $(element).width();
     };

     $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

     /* Custom selectors for your convenience.   */
     /* Use as $("img:below-the-fold").something() or */
     /* $("img").filter(":below-the-fold").something() which is faster */

     $.extend($.expr[':'], {
         'below-the-fold': function(a) {
             return $.belowthefold(a, {
                 threshold: 0
             });
         },
         'above-the-top': function(a) {
             return !$.belowthefold(a, {
                 threshold: 0
             });
         },
         'right-of-screen': function(a) {
             return $.rightoffold(a, {
                 threshold: 0
             });
         },
         'left-of-screen': function(a) {
             return !$.rightoffold(a, {
                 threshold: 0
             });
         },
         'in-viewport': function(a) {
             return $.inviewport(a, {
                 threshold: 0
             });
         },
         /* Maintain BC for couple of versions. */
         'above-the-fold': function(a) {
             return !$.belowthefold(a, {
                 threshold: 0
             });
         },
         'right-of-fold': function(a) {
             return $.rightoffold(a, {
                 threshold: 0
             });
         },
         'left-of-fold': function(a) {
             return !$.rightoffold(a, {
                 threshold: 0
             });
         }
     });
 })(jQuery, window, document);



/*!
 * jQuery表单验证
 * Author：前端老徐
 * GitHub:https://github.com/waihaolaoxu
 */
;(function($){
    $.fn.validate=function(options){
        //是否批量验证
        var isone=options.isone?true:false;
        //提交按钮状态
        var submitBtn={
            flag:false,
            id:$(this).find('input[type=\'submit\']'),
            txt:'提交中...'
        }
        //验证规则
        var validate={
                required:function(e){
                    if(e.val()==''||e.val()==e.attr('placeholder')){
                        _error(e,'required');
                        return false
                    }
                },
                email:function(e){
                    var reg=/^\w+@([0-9a-zA-Z]+[.])+[a-z]{2,4}$/,val=e.val();
                    if(val&&!reg.test(val)){
                        _error(e,'email');
                        return false
                    }
                },
                phone:function(e){
                    var reg=/^1[3|5|8|7]\d{9}$/,val=e.val();
                    if(val&&!reg.test(val)){
                        _error(e,'phone');
                        return false
                    }
                },
                number:function(e){
                    var val=e.val()
                    if(val&&isNaN(e.val())){
                        _error(e,'number');
                        return false
                    }
                },
                url:function(e){
                    var reg=/^http:\/\/.+\./,val=e.val();
                    if(val&&!reg.test(val)){
                        _error(e,'url');
                        return false
                    }
                },
                idcard:function(e){
                    var reg=/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/,val=e.val();
                    if(val&&!reg.test(val)){
                        _error(e,'idcard');
                        return false
                    }
                }
        }
        //提示信息
        var messages = {
            required: '不能为空',
            email: '格式不正确',
            phone:'格式不正确',
            url: '格式不正确',
            number: '请输入数字',
            idcard:'格式不正确'
        }
        //合并对象
        if(options){
            if(options.messages){
                messages=$.extend(messages,options.messages)
            }
            if(options.validate){
                validate=$.extend(validate,options.validate)
            }
            if(options.submitBtn){
                submitBtn=$.extend(submitBtn,options.submitBtn)
            }
        }
        //错误提示
        var _error=function(obj,error){
            if(options&&options.error){
                options.error(obj,messages[error]);
                return
            }
            alert(messages[error])
        }
        //校验
        function check(){
            var rule=$(this).attr('validate').split('|'),len=rule.length;
            for(var i=0;i<len;i++){
                if(validate.hasOwnProperty(rule[i])){
                    if(validate[rule[i]]($(this))==false){
                        return false;
                        break;
                    }
                }
            }
        }
        function yanzheng(){
            var success=true;
            if(typeof options.ids=='object'){
                $.each(options.ids,function(i,e){
                    if(check.call(e)==false){
                        success=false
                        if(isone){
                            return false //单条验证 默认为批量验证
                        }
                    }
                })
            }else{
                $(this).find('[validate]').each(function(i, e) {
                    if(check.call(e)==false){
                        success=false
                        if(isone){
                            return false //单条验证 默认为批量验证
                        }
                    }
                    });
            }
            if(success){
                if(submitBtn.flag){
                    submitBtn.id.val(submitBtn.txt)
                }
            }
            return success
        }
        return yanzheng.call(this)
    }
})(jQuery);



//懒加载
var var_lazy={
    effect: 'fadeIn',
    threshold: 200,
    load: function (w1, h1) {
        var load_this = $(this),
            _this_parent_width, _this_parent_height, _this_width, _this_height;
        if (load_this.hasClass('auto')) {
            _this_parent_width = load_this.parents('.lazy').width();
            _this_parent_height = load_this.parents('.lazy').height();
            _this_width = w1;
            _this_height = h1;
            //              console.log(_this_width+"}"+_this_height)
            if (_this_parent_width / _this_parent_height < _this_width / _this_height) {
                load_this.css({
                    width: 'auto',
                    height: '100%'
                });
                _this_width = _this_parent_height * w1 / h1;
                load_this.css({
                    left: -(((_this_width - _this_parent_width) / 2) / _this_parent_width) * 100 + '%',
                    top: 0
                });
            } else {
                load_this.css({
                    width: '100%',
                    height: 'auto'
                });
                _this_height = _this_parent_width * h1 / w1;
                load_this.css({
                    top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                    left: 0
                });
            }
        } else if (load_this.hasClass('auto_height')) {
            load_this.css({
                height: 'auto',
                width: 'auto'
            });
        } else if (load_this.hasClass('height_middle')) {
            _this_parent_height = load_this.parents('.lazy').height();
            _this_parent_width = load_this.parents('.lazy').width();
            _this_height = _this_parent_width * h1 / w1;
            load_this.css({
                top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                left: 0
            });
        } else if (load_this.hasClass('auto_inner')) {
            _this_parent_width = load_this.parents('.lazy').width();
            _this_parent_height = load_this.parents('.lazy').height();
            _this_width = w1;
            _this_height = h1;
            //              console.log(_this_width+"}"+_this_height)
            if (_this_parent_width / _this_parent_height > _this_width / _this_height) {
                load_this.css({
                    width: 'auto',
                    height: '100%'
                });
                _this_width = _this_parent_height * w1 / h1;
                load_this.css({
                    left: -(((_this_width - _this_parent_width) / 2) / _this_parent_width) * 100 + '%',
                    top: 0
                });
            } else {
                load_this.css({
                    width: '100%',
                    height: 'auto'
                });
                _this_height = _this_parent_width * h1 / w1;
                load_this.css({
                    top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                    left: 0
                });
            }
        }
    }
};
setTimeout(function(){
    $('.lazy_img').lazyload(var_lazy);
},300)
