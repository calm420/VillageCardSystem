//拖动flag
var holdPosition = 0;
//页码
var slideNumber = 0;

var mySwiper = new Swiper('.swiper-container',{
    //显示数据的条数
    slidesPerView:'auto',
    mode:'vertical',
    //swipe拖动时的即时更新
    watchActiveIndex: false,
    onTouchStart: function() {
        holdPosition = 0;
    },
    //抵抗下拉反弹事件回调
    onResistanceBefore: function(s, pos){
        holdPosition = '下拉刷新';
    },
    //上拉刷新事件抵抗反弹回调
    onResistanceAfter: function(s,pos){
        holdPosition = '上拉加载更多';
        console.log(pos,'pos')
        // mySwiper.setWrapperTranslate(0,pos,0)
    },
    //结束回调
    onTouchEnd: function(){
        console.log(holdPosition);
        return;
        if (holdPosition == '下拉刷新') {
            console.log('下拉刷新')

        }else if(holdPosition == '上拉加载更多'){
            console.log('上拉加载');
            if($('.swiper').height() - $(".swiper-wrapper").height() <= 0){
                //100为loading高度
                mySwiper.setWrapperTranslate(0,$('.swiper').height() - $(".swiper-wrapper").height() - 100,0);
            }
            //禁止拖动
            mySwiper.params.onlyExternal=true;
            //loading显示
            $('.preloader').addClass('visible');
            //调用增加数据方法
            loadNewSlides();
        }else{
            console.error('进入未知空间');
        }
    }
});
function loadNewSlides(){

    setTimeout(function(){
        //添加元素
        for(var i=0;i<=10;i++){
            mySwiper.appendSlide("<div>\n" +
                "                                                 <div class=\"homeworkInfo\">\n" +
                "                                                     <div class=\"homeworkL\">\n" +
                "                                                         <div class=\"imgInfo\">\n" +
                "                                                             <img src='../asset/images/empty_course.png'/>\n" +
                "                                                             <span class=\"textOver\">用户姓名</span>\n" +
                "                                                         </div>\n" +
                "                                                     </div>\n" +
                "                                                     <div class=\"homeworkM\">\n" +
                "                                                         <h3>标题</h3>\n" +
                "                                                         <p>内容</p>\n" +
                "                                                     </div>\n" +
                "                                                     <div class=\"homeworkR\">\n" +
                "                                                         <p>时间</p>\n" +
                "                                                          <img src='../asset/images/empty_course.png'/>\n" +
                "                                                     </div>\n" +
                "                                                 </div>\n" +
                "                              </div>", 'swiper-slide blue-slide swiper-slide-visible');
        }
        console.log($('.swiper').height() - $(".swiper-wrapper").height(),'差值');
        //判断是否满屏
        if($('.swiper').height() - $(".swiper-wrapper").height() <= 0){
            mySwiper.setWrapperTranslate(0,$('.swiper').height() - $(".swiper-wrapper").height(),0)
        }
        //释放拖动
        mySwiper.params.onlyExternal=false;
        mySwiper.updateActiveSlide(0);
        //loading隐藏
        $('.preloader').removeClass('visible');
        //一个小bug 暂未查出原因。
        $('.swiper-wrapper').css({height:$('.swiper-wrapper').height() - 1})
    },1000)
    slideNumber++;
}
