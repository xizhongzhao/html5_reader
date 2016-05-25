(function(){    //使用闭包封装方法防治污染全局变量
    var Util = (function(){
        var prefix = "html5_reader_"; //为特定的key值加
        //前缀防止覆盖其他用户设置的key值
        var StorageGetter = function(key){
            return localStorage.getItem(prefix + key);
        };
        var StorageSetter = function(key,val){
            return localStorage.setItem(prefix + key,val);
        };
        var getJSONP = function(url,callback){
            return $.jsonp({
                url:url,
                cache:true,
                callback:'duokan_fiction_chapter',
                sucess:function(result){
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    callback(json);
                }
            })
        }
        return {
            StorageSetter:StorageSetter,
            StorageGetter:StorageGetter,
            getJSONP:getJSONP
        }
    })();
    var Dom = {
        jtop_nav:$('.jtop_nav'),//取top_nav
        jbottom_nav:$('.jbottom_nav'), //使用类来选择增加代码可读性
        jday:$('.jday'),//取白天模式对象
        jnight:$('.jnight'),//取夜间模式对象
        jpannel_nav:$('.jpannel_nav'),//取字体改变背景改变导航块
        jfont_button:$('.jfont_button'),
        fiction_container:$('#fiction_container'),
        jicon_day_night:$('.jday_day_night'),
        jbody:$('body'),
    };
    var Win = $(window);
    var Doc = $(document);
    var initFontSize = Util.StorageGetter('font_size');
    initFontSize = parseInt(initFontSize);
    if(!initFontSize ) initFontSize = 14;
    Dom.fiction_container.css('font-size',initFontSize);
    //以上变量是缓存需要使用的变量
    function main(){
        //todo 整个项目的入口函数
        var readerModel = ReaderModel();
        readerModel.init();
        EventHandler();
    }
    function ReaderModel(){
        //todo 实现和阅读器相关的数据交互的方法
        var Chapter_id;
        var init = function(){
            getFictionInfo(function(){
                getCurChapterContent(Chapter_id,function(){
                    //todo
                })
            })
        }
       var getFictionInfo = function(callback){
            $.get('data/chapter.json',function(data){
                //todo 获取章节信息之后的回调函数
                Chapter_id = data.chapters[1].chapter_id;
                callback && callback();
            },'json');

       }
        var getCurChapterContent = function(chapter_id,data){
            $.get('data/data'+chapter_id+'.json',function(data){
                if(data.result == 0){
                    var url = data.jsonp;
                    Util.getJSONP(url,function(data){
                        callback &&callback(data);
                    });
                }
            },'json')
        }
        return {
            init:init
        }
    }
    function ReaderBaseFrame(){
        
        //todo 渲染基本的UI结构
    }
    function EventHandler(){
        //todo交互的事件绑定
        //touch事件
        //zepto扩展的事件 轻触tap事件
        //安卓4.0之前click事件会有300ms延时
        // click 事件相对于tap的优势可以让页面兼容PC端
        //也可以做浏览器的判断然后针对不同客户端的浏览器做不同的事件事件
        $('.jaction_mid').click(function(){
            if(Dom.jtop_nav.css('display')=='none'){
                Dom.jbottom_nav.show();
                Dom.jtop_nav.show();
            }else{
                Dom.jtop_nav.hide();
                Dom.jbottom_nav.hide();
                Dom.jpannel_nav.hide();
                Dom.jfont_button.removeClass('font_current');
            }
        });
        //对window对象绑定滚动事件
        Win.scroll(function(){
            Dom.jtop_nav.hide();
            Dom.jbottom_nav.hide();
            Dom.jpannel_nav.hide();
            Dom.jfont_button.removeClass('font_current');
        });
        //切换字体面板的唤出功能
            Dom.jfont_button.click(function(){
            if(Dom.jpannel_nav.css('display')==='none'){
                Dom.jpannel_nav.show();
                Dom.jfont_button.addClass('font_current');
            }else{
                Dom.jpannel_nav.hide();
                Dom.jfont_button.removeClass('font_current');
            }
        });
        //切换夜间和白天模式 同时还要触发背景切换事件
        $('.jday_night_switch').click(function(){
            if(Dom.jnight.css('display')==='none'){
                $('.jbk_container_c').hide();
                Dom.jday.hide();
                Dom.jnight.show();
                //将body背景颜色设成白色
                Dom.jbody.css('background-color',$('.jbk_blue').css("background-color"));
                $('.jbk_blue').children('div').show();
            }else{
                $('.jbk_container_c').hide(); //为了清除上一个状态的小圆圈
                Dom.jnight.hide();
                Dom.jday.show();
                Dom.jbody.css('background-color',$('.jbk_white').css("background-color"));
                $('.jbk_white').children('div').show();
            }
        });
        $('#large-font').click(function(){
            //字号变大
                if(initFontSize > 20) return;
                ++initFontSize;
                Dom.fiction_container.css('font-size',initFontSize);
                Util.StorageSetter('font_size',initFontSize);
        });
        $('#small-font').click(function(){
            //字号变小
            // initFontSize < 12;
            if(initFontSize < 12) return;
            --initFontSize;
            Dom.fiction_container.css('font-size',initFontSize);
            Util.StorageSetter('font_size',initFontSize);
        });
        var bkClickEvent = function(){
            $('.jbk_container_c').hide();
            Dom.jbody.css('background-color',$(this).css('background-color'));
            $(this).children("div").show();
        };
        $(".jbk").on("click",bkClickEvent); //为所有背景按钮绑定事件
        //为白色按钮绑定换成白天图标的时间
        $('.jbk_white').on("click",function(){
            Dom.jnight.hide();
            Dom.jday.show();
        });
        $('.jbk_blue').on("click",function(){
            Dom.jnight.show();
            Dom.jday.hide();
        });
        //点击目录图标和back图标跳转到百度
        $('.jbaidu').on('click',function(){
           window.location.href = "http://www.baidu.com" ;
        });
    }
    main();
})();