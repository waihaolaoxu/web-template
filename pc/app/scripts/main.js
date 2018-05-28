
'use strict';
/*
    js公共类库
*/
(function(w) {

    function App() {}
    App.prototype = {
        init: function() {
            this.tab();
            this.input();
            $('[name=ja_uuid]').val($.cookie('ja_uuid'));//表单公共参数
            //分享
            $('.social-share').html('<div class="bdsharebuttonbox">\
                <a href="javascript:page.share(\'sina\')" class="iconfont icon-weibo"></a>\
                <a href="javascript:page.share(\'qzone\')" class="iconfont icon-qzone"></a>\
                <a href="javascript:page.share(\'qq\')" class="iconfont icon-qq"></a>\
                <a href="javascript:page.share(\'wx\')" class="iconfont icon-wechat"></a>\
            </div>');
        },
        share:function (cmd){
            var params = {
                title:document.title,
                url:location.href,
            }
            switch(cmd){
                case 'sina':
                    window.open('http://service.weibo.com/share/share.php?title='+params.title+'&url='+params.url+'&searchPic=true');
                break;
                case 'qzone':
                    window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+params.title+'&url='+params.url+'&searchPic=true');
                break;
                case 'qq':
                    window.open('http://connect.qq.com/widget/shareqq/index.html?title='+params.title+'&url='+params.url+'&searchPic=true');
                break;
                case 'wx':
                    var oDiv = $('<div>');
                    oDiv.append('<div>分享到微信朋友圈</div>');
                    oDiv.append('<div style="height:230px;"><img src="http://qr.liantu.com/api.php?text='+params.url+'" alt="'+params.url+'" style="width:100%" /></div>');
                    oDiv.append('<div>打开微信，点击底部的“发现”，<br>使用“扫一扫”即可将网页分享至朋友圈。</div>');
                    oDiv.append('<div style="position:absolute;right:10px;top:10px;font-size:16px;color:#666;cursor:pointer;font-family: unset;" onclick="$(this).parent().remove()">X</div>');
                    oDiv.css({
                        width: 230,
                        position: 'fixed',
                        zIndex:9999,
                        left: '50%',
                        top: '50%',
                        margin: '-150px 0 0 -115px',
                        background:'#fff',
                        textAlign:'center',
                        padding:10,
                        border:'solid 1px #ddd',
                        fontSize:12,
                        color:'#666'
                    });
                    $('body').append(oDiv);
                break;
            }
        },
        urlParams: function(){
            var query = window.location.search.substring(1);
            var param ={};
            if(query){
                $.each(query.split('&'),function(i,d){
                    var o = d.split('=');
                    param[o[0]] = o[1];
                });
            }
            return param;
        },
        tab: function() {
            $('.tab-tit').on('click', 'span', function() {
                var $this = $(this),
                    n = $this.index();
                $this.addClass('active').siblings().removeClass('active');
                $this.parents('.tab-tit').siblings('.tab-layer').children('div').eq(n).siblings().hide().end().show();
            });
        },
        input:function(){
            var $body = $('body');
            $body.on('focus','input[type=text]',function(){
                var $this = $(this);
                if($this.val() === $this.attr('placeholder')){
                    $(this).val('');
                }
            });
            $body.on('blur','input[type=text]',function(){
                var $this = $(this);
                if($this.val() === ''){
                    $this.val($this.attr('placeholder'));
                }
            });
        },
        scrollFire:function(obj){
            // obj={
            //     dom:'',
            //     active:'',
            //     fn:,
            // }
            var $w=$(window);
            var $doms=$(obj.dom);
            var tops=[];
            $doms.each(function(i,ob){
              tops.push($(ob).offset().top);
            });
            function action(){
              var w_top=$w.scrollTop();
              var w_h=$w.height();
              $.each(tops,function(k,v){
                var $dom=$doms.eq(k);
                if(v-obj.offset<w_top+w_h&&$dom.height()+v+obj.offset>w_top){
                  $dom.addClass(obj.active);
                  if(obj.fn){
                    obj.fn($dom)
                  }
                }
              })
            }
            action();
            $w.scroll(action);
            $w.resize(action);
        },
        getIeVersion:function(){
            var browser = navigator.appName;
            if(browser != 'Microsoft Internet Explorer'){
                return false;
            }
            var b_version = navigator.appVersion;
            var version = b_version.split(';');
            var trim_Version = version[1].replace(/[ ]/g, '');
            if (browser == 'Microsoft Internet Explorer' && trim_Version == 'MSIE6.0') {
                return 6;
            } else if (browser == 'Microsoft Internet Explorer' && trim_Version == 'MSIE7.0') {
                return 7;
            } else if (browser == 'Microsoft Internet Explorer' && trim_Version == 'MSIE8.0') {
                return 8;
            } else if (browser == 'Microsoft Internet Explorer' && trim_Version == 'MSIE9.0') {
                return 9;
            }
        },
        // iframe 弹层预约
        form:function(title,query){
            if(query){
                if(query.substring(0,1) != '&'){
                    query = '&'+query;
                }
            }else{
                query = '';
            }
            layer.open({
              type: 2,
              title: false,
              // shadeClose: true,
              // shade: false,
              area: ['380px', '300px'],
              content: '/poplayer.html?title='+title+query
            });
        },
        //只处理表单验证
        v:function(opt){
            var id = opt.id?opt.id:'bottomBar';
            var $obj = $('#'+id),_self=this;
            $obj.submit(function(e) {
                e.preventDefault();
                var b = $(this).validate({
                    isone: true,
                    error:function(e, t){
                        e.addClass('input-error');
                        e.one('focus',function(){
                            $(this).removeClass('input-error');
                        });
                        var msg = e.attr('placeholder').replace('请输入','')+t;
                        if(_self.getIeVersion() === 8){
                            alert(msg)
                        }else{
                            layer.tips(msg,e,{
                                tips:[1,'#e5493a']
                            });
                        }
                    }
                });
                if(b){
                    opt.callback && opt.callback($obj, $obj.serializeArray());
                }
            });
        }
    }

    w.Page = function(obj) {
        for (var i in obj) {
            App.prototype[i] = obj[i];
        }
        var app = new App();
        app.init();
        if ('onLoad' in app) {
            window.onload = function() {
                app.onLoad();
            };
        }
        if ('onReady' in app) {
            $(document).ready(function() {
                app.onReady();
            });
        }
        if ('onResize' in app) {
            var flag = null;
            $(window).on('resize', function() {
                if (flag)
                    clearTimeout(flag);
                flag = setTimeout(function() {
                    app.onResize()
                }, 120)
            })
        }
        if ('onScroll' in app) {
            $(window).on('scroll', function() {
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
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {

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
        $container = (settings.container === undefined || settings.container === window)
            ? $window
            : $(settings.container);

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
                    $('<img />').bind('load', function() {
                        $self.hide().attr('src', $self.data(settings.data_attribute))[settings.effect](settings.effect_speed);
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
                    }).attr('src', $self.data(settings.data_attribute));
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
            return $.belowthefold(a, {threshold: 0});
        },
        'above-the-top': function(a) {
            return !$.belowthefold(a, {threshold: 0});
        },
        'right-of-screen': function(a) {
            return $.rightoffold(a, {threshold: 0});
        },
        'left-of-screen': function(a) {
            return !$.rightoffold(a, {threshold: 0});
        },
        'in-viewport': function(a) {
            return $.inviewport(a, {threshold: 0});
        },
        /* Maintain BC for couple of versions. */
        'above-the-fold': function(a) {
            return !$.belowthefold(a, {threshold: 0});
        },
        'right-of-fold': function(a) {
            return $.rightoffold(a, {threshold: 0});
        },
        'left-of-fold': function(a) {
            return !$.rightoffold(a, {threshold: 0});
        }
    });
})(jQuery, window, document);

//懒加载
var var_lazy = {
    // effect: 'fadeIn',
    threshold: 400,
    load: function(w1, h1) {

        var load_this = $(this),
            _this_parent_width,
            _this_parent_height,
            _this_width,
            _this_height;
        if (!load_this.is('img')) {
            load_this.css('background-image', 'url(' + $(this).attr('data-original') + ')');
            load_this.removeAttr('src');
        }
        load_this.addClass('load-over').parents('.lazy').addClass('load-over');
        if (load_this.hasClass('auto')) {
            _this_parent_width = load_this.parents('.lazy').width();
            _this_parent_height = load_this.parents('.lazy').height();
            _this_width = w1;
            _this_height = h1;
            //              console.log(_this_width+"}"+_this_height)
            if (_this_parent_width / _this_parent_height < _this_width / _this_height) {
                load_this.css({width: 'auto', height: '100%'});
                _this_width = _this_parent_height * w1 / h1;
                load_this.css({
                    left: -(((_this_width - _this_parent_width) / 2) / _this_parent_width) * 100 + '%',
                    top: 0
                });
            } else {
                load_this.css({width: '100%', height: 'auto'});
                _this_height = _this_parent_width * h1 / w1;
                load_this.css({
                    top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                    left: 0
                });
            }
        } else if (load_this.hasClass('auto_height')) {
            load_this.css({height: 'auto', width: 'auto'});
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
                load_this.css({width: 'auto', height: '100%'});
                _this_width = _this_parent_height * w1 / h1;
                load_this.css({
                    left: -(((_this_width - _this_parent_width) / 2) / _this_parent_width) * 100 + '%',
                    top: 0
                });
            } else {
                load_this.css({width: '100%', height: 'auto'});
                _this_height = _this_parent_width * h1 / w1;
                load_this.css({
                    top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                    left: 0
                });
            }
        }
    }
};
setTimeout(function() {
    $('.lazy_img').lazyload(var_lazy);
    // $(window).scroll();
}, 300);



// jquery分页器
(function($, window, document, undefined) {
    //定义分页类
    function Paging(element, options) {
        this.element = element;
        //传入形参
        this.options = {
            pageNo: options.pageNo||1,
            totalPage: options.totalPage,
            totalSize:options.totalSize,
            callback:options.callback
        };
        //根据形参初始化分页html和css代码
        this.init();
    }
    //对Paging的实例对象添加公共的属性和方法
    Paging.prototype = {
        constructor: Paging,
        init: function() {
            this.creatHtml();
            this.bindEvent();
        },
        creatHtml: function() {
            var me = this;
            var content = '';
            var current = me.options.pageNo;
            var total = me.options.totalPage;
            var totalNum = me.options.totalSize;
            //总页数大于6时候
            if(total > 6) {
                //当前页数小于5时显示省略号
                if(current < 5) {
                    for(var i = 1; i < 6; i++) {
                        if(current == i) {
                            content += '<a class=\'current\'>' + i + '</a>';
                        } else {
                            content += '<a>' + i + '</a>';
                        }
                    }
                    content += '. . .';
                    content += '<a>'+total+'</a>';
                } else {
                     //判断页码在末尾的时候
                    if(current < total - 3) {
                        for(var i = current - 2; i < current + 3; i++) {
                            if(current == i) {
                                content += '<a class=\'current\'>' + i + '</a>';
                            } else {
                                content += '<a>' + i + '</a>';
                            }
                        }
                        content += '. . .';
                        content += '<a>'+total+'</a>';
                    //页码在中间部分时候
                    } else {
                        content += '<a>1</a>';
                        content += '. . .';
                        for(var i = total - 4; i < total + 1; i++) {
                            if(current == i) {
                                content += '<a class=\'current\'>' + i + '</a>';
                            } else {
                                content += '<a>' + i + '</a>';
                            }
                        }
                    }
                }
                //页面总数小于6的时候
            } else {
                for(var i = 1; i < total + 1; i++) {
                    if(current == i) {
                        content += '<a class=\'current\'>' + i + '</a>';
                    } else {
                        content += '<a>' + i + '</a>';
                    }
                }
            }
            content += '<a id="firstPage">首页</a><span class=\'preNext\'><a id=\'prePage\'>&lt;</a>';
            content += '<a id=\'nextPage\'>&gt;</a></span>';
            content += '<a id="lastPage">尾页</a>';
            // content += "<span class='totalPages'> 共<span>"+total+"</span>页 </span>";
            // content += "<span class='totalSize'> 共<span>"+totalNum+"</span>条记录 </span>";
            me.element.html(content);
        },
        //添加页面操作事件
        bindEvent: function() {
            var me = this;
            me.element.off('click', 'a');
            me.element.on('click', 'a', function() {
                var num = $(this).html();
                var id=$(this).attr('id');
                if(id == 'prePage') {
                    if(me.options.pageNo == 1) {
                        me.options.pageNo = 1;
                    } else {
                        me.options.pageNo = +me.options.pageNo - 1;
                    }
                } else if(id == 'nextPage') {
                    if(me.options.pageNo == me.options.totalPage) {
                        me.options.pageNo = me.options.totalPage
                    } else {
                        me.options.pageNo = +me.options.pageNo + 1;
                    }

                } else if(id =='firstPage') {
                    me.options.pageNo = 1;
                } else if(id =='lastPage') {
                    me.options.pageNo = me.options.totalPage;
                }else{
                    me.options.pageNo = +num;
                }
                me.creatHtml();
                if(me.options.callback) {
                    me.options.callback(me.options.pageNo);
                }
            });
        }
    };
    //通过jQuery对象初始化分页对象
    $.fn.paging = function(options) {
        return new Paging($(this), options);
    }
})(jQuery, window, document);
