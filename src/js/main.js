var CURRENT_URL = "";

$(document).ready(function () {
    CURRENT_URL = document.location.href;
    ScriptHelper.InitForm();
});

var SearchButtonClicked = function (btn) {
    if ($(btn).parents("form").length > 0) {
        var formObj = $($(btn).parents("form")[0]);
        formObj.attr("action", ScriptHelper.ReplaceParamVal(formObj.attr("action"), "CurrentPageIndex", "1"));
    }
};


$(function () {
   
    $(window).scroll(function () {
        "use strict";
        var scroll = $(window).scrollTop();
        if (scroll > 60) {
            $(".header").addClass("sticky");

        } else {
            $(".header").removeClass("sticky");
        }
    });

    if ('ontouchstart' in window) {
        $("#switch").bind("touchstart", toggle);
    } else {
        $("#switch").bind("click", toggle);
    }
    
    function toggle() {
        if ($('#menu').hasClass('menu-show')) {
            $('#menu').removeClass('menu-show slideInDown animated');
            $('#switch').removeClass('switch-show');
        } else {
            $('#menu').addClass('menu-show slideInDown animated');
            $('#switch').addClass('switch-show');
        }
    }
    
    $(window).resize(function () {
        if ($(window).width() < 768) {
            $("#menu").removeClass('menu-show fadeInDown animated');
        }
    });

    
    //高度不够 固定底部位置
    function fixedfooter() {
        var h = 0;
        $("body").children().each(function () {
            if (!$(this).is(":hidden") && !$(this).hasClass("header")) {
                h = h + $(this).height();
            }
        });
        if ($(window).height() - h > 0) {
            $(".footer").attr("style", "position:fixed;bottom:0;");
        } else {
            $(".footer").removeAttr("style");
        }
    }

    $(".side").resize(function () {
        fixedfooter();
    });

    $(window).resize(function () {
        fixedfooter();
    });

    fixedfooter();


    //小屏幕下用户中心菜单不展开
    if ($(window).width() < 768) {
        $("#side-menu-toggle .side-menu-toggle-sub").removeClass("side-menu-toggle-sub-show");
    }
    $(window).resize(function () {
        if ($(window).width() < 768) {
            $("#side-menu-toggle .side-menu-toggle-sub").removeClass("side-menu-toggle-sub-show");
        }
    });


    
    //wow animations ie8不支持
    var wow = new WOW(
            {
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 100, // distance to the element when triggering the animation (default is 0)
                mobile: false        // trigger animations on mobile devices (true is default)
            }
    );

    if (navigator.appName == "Microsoft Internet Explorer") {
        var version = navigator.appVersion.match(/MSIE \d.0/i)
        if (version == 'MSIE 8.0' || version == 'MSIE 7.0') {
            $(".header").before("<div class=\"ie\" onclick=\"window.location.href='http://windows.microsoft.com/zh-cn/internet-explorer/download-ie'\">为了更好的体验，建议您升级IE9.0以上版本！</div>");
            $(".header").css("top", "30px")
        }
        else {
            wow.init();
        }
    }
    else {
        wow.init();
    }
   
    

    $("html").click(function (event) {
        //toggle
        var target = $(event.target);
        var toggle = target.attr('toggle');
        if (typeof (toggle) == 'undefined') {
            $('.togglebox').hide();
        } else {
            $('.togglebox').each(function (index, element) {
                if (toggle != '#' + $(this).attr('id')) {
                    $(this).hide();
                }
            });
            $(toggle).toggle();
        }
    });

    $(function () {
        if ($(window).width() <= 768) {
            $('html,body').animate({ scrollTop: ($(".subbanner-small").height() - 45).toString() + 'px' }, 800);
        }
    });
    

});



//监听某个div或其它标签的大小改变来执行相应的处理
(function ($, h, c) { var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow"; e[b] = 250; e[f] = true; $.event.special[j] = { setup: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.add(l); $.data(this, d, { w: l.width(), h: l.height() }); if (a.length === 1) { g() } }, teardown: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.not(l); l.removeData(d); if (!a.length) { clearTimeout(i) } }, add: function (l) { if (!e[f] && this[k]) { return false } var n; function m(s, o, p) { var q = $(this), r = $.data(this, d); r.w = o !== c ? o : q.width(); r.h = p !== c ? p : q.height(); n.apply(this, arguments) } if ($.isFunction(l)) { n = l; return m } else { n = l.handler; l.handler = m } } }; function g() { i = h[k](function () { a.each(function () { var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d); if (m !== o.w || l !== o.h) { n.trigger(j, [o.w = m, o.h = l]) } }); g() }, e[b]) } })(jQuery, this);