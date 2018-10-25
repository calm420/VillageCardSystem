$(function(){
    //拖动偏移量
    var holdPosition = 0;
// var holdPosition =
//页码
    var slideNumber = 1;
    var loadingMore = true;

    getHomeworkData();

    var mySwiper = new Swiper('.swiper-container',{
        //显示数据的条数
        slidesPerView:'auto',
        mode:'vertical',
        //swipe拖动时的即时更新
        watchActiveIndex: true,
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
        },
        //结束回调
        onTouchEnd: function(){
            console.log(holdPosition,'holdPosition')
            if (holdPosition == '下拉刷新') {
                console.log('下拉刷新');
            }else if(holdPosition == '上拉加载更多'){
                if(loadingMore){
                    console.log('上拉加载');
                    if($(".swiper").height() - $(".swiper-wrapper").height() <= 0){
                        console.log('进入');
                        //100为loading高度
                        mySwiper.setWrapperTranslate(0,$(".swiper").height() - $(".swiper-wrapper").height() - 100,0)
                    }
                    //禁止拖动
                    mySwiper.params.onlyExternal=true;
                    //loading显示
                    $('.preloader').addClass('visible');
                    //调用增加数据方法
                    setTimeout(function(){
                        getHomeworkData();

                    },1000000)
                }

            }else{
                console.log('进入未知空间');
            }
        }
    });




    function getHomeworkData(){
        console.log(slideNumber,'slideNumber');
        var param = {
            "method": 'getTopicsByClazzId',
            "clazzIds": 819,
            "pageNo": slideNumber
        };
        WebServiceUtil.requestLittleAntApi(true,JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    let rowData = result.response;
                    //数据为空
                    if(rowData.length == 0 && slideNumber == 1){
                        mySwiper.appendSlide("<div class='noMoreData'>数据为空</div>", 'swiper-slide');
                    }
                    if(rowData.length == 0 && slideNumber != 1){
                        mySwiper.appendSlide("<div class='noMoreData'>无更多数据</div>", 'swiper-slide');
                        loadingMore = false;
                    }
                    //循环渲染
                    for(var k in rowData){
                        console.log(rowData[k].attachMents.address,'rowData[k].attachMents.address');
                        let attachMents = rowData[k].attachMents.length == 0?'':rowData[k].attachMents[0].address;
                        console.log(attachMents,'attachMents');
                        mySwiper.appendSlide("<div class=\"homeworkInfo\">\n" +
                            "         <div class=\"homeworkL\">\n" +
                            "            <div class=\"imgInfo\">\n" +
                            "                 <img src='"+rowData[k].fromUser.avatar+"'/>\n" +
                            "                                 <span class=\"textOver\">"+rowData[k].fromUser.userName+"</span>\n" +
                            "                                               </div>\n" +
                            "                           </div>\n" +
                            "                             <div class=\"homeworkM\">\n" +
                            "                   <h3>"+rowData[k].title+"</h3>\n" +
                            "                   <p>"+rowData[k].content+"</p>\n" +
                            "                    </div>\n" +
                            "                   <div class=\"homeworkR\">\n" +
                            "                  <p>"+WebServiceUtil.formatYMD(rowData[k].createTime)+"</p>\n" +
                            "                   <img src='"+attachMents+"'/>\n" +
                            "             </div>\n" +
                            "      </div>", 'swiper-slide');
                    }
                    // if($(".swiper").height() - $(".swiper-wrapper").height() <= 0){
                    //     mySwiper.setWrapperTranslate(0,$(".swiper").height() - $(".swiper-wrapper").height(),0)
                    // }
                    //释放拖动
                    mySwiper.params.onlyExternal=false;
                    mySwiper.updateActiveSlide(0);
                    $('.preloader').removeClass('visible');
                    //一个小bug 暂未查出原因。
                    $('.swiper-wrapper').css({height:$('.swiper-wrapper').height() - 1});
                    slideNumber++;
                }

            },
            onError: function (error) {
                $('body').html("查询出错:"+JSON.stringify(responseStr))
            }
        });
    }
})
