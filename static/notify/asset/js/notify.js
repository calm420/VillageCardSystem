$(function () {
    var  skin;
    var roomId = getQueryString("roomId");
    var font = getQueryString('font')
    $('html').css('font-size', font)
    //拖动偏移量
    var holdPosition = 0;
    // var holdPosition =
    //页码
    var slideNumber = 1;
    var loadingMore = true;
    var schoolId =getQueryString("schoolId");

    //给定swiper固定高度
    $(".swiper").height($('.inner_bg').height() - $('.navBar').height());

//创建swiper对象
    var mySwiper = new Swiper('.swiper-container', {
        //显示数据的条数
        slidesPerView: 'auto',
        mode: 'vertical',
        //swipe拖动时的即时更新
        watchActiveIndex: true,
        onTouchStart: function () {
            holdPosition = 0;
        },
        //抵抗下拉反弹事件回调
        onResistanceBefore: function (s, pos) {
            holdPosition = '下拉刷新';
        },
        //上拉刷新事件抵抗反弹回调
        onResistanceAfter: function (s, pos) {
            if (pos > 300) {
                holdPosition = '上拉加载更多';
            } else {
                mySwiper.setWrapperTranslate($(".swiper").height() - $(".swiper-wrapper").height());
            }
        },
        //结束回调
        onTouchEnd: function () {
            console.log(holdPosition, 'holdPosition');
            console.log($(window).height(), 'height')
            if (holdPosition == '下拉刷新') {
                console.log('下拉刷新');
            } else if (holdPosition == '上拉加载更多') {
                if (loadingMore) {
                    if (slideNumber == 2) {
                        $('.swiper-wrapper').css({ transform: 'translate3d(0px, -2150.2px, 0px)' })
                    }
                    console.log('上拉加载');
                    // if($(".swiper").height() - $(".swiper-wrapper").height() <= 0){
                    //     console.log('进入');
                    //100为loading高度
                    console.log('回弹')
                    //规避第二页下拉位置偏差问题
                    if (slideNumber == 3) {
                        mySwiper.setWrapperTranslate($(".swiper").height() - $(".swiper-wrapper").height() - 180);
                    } else {
                        mySwiper.setWrapperTranslate($(".swiper").height() - $(".swiper-wrapper").height() - 100);
                    }
                    // }
                    //禁止拖动
                    mySwiper.params.onlyExternal = true;
                    //loading显示
                    $('.preloader').addClass('visible');
                    //调用增加数据方法
                    setTimeout(function () {
                        getNotifyInfo(roomId);
                    }, slideNumber == 3 ? 500 : 500)
                }

            } else {
                console.log('进入未知空间');
            }
        }
    });


    InitializePage();
    //监听接受消息
    window.addEventListener('message', function(e){
        var commandInfo = JSON.parse(e.data);
        console.log("notify",commandInfo);
        if(commandInfo.command == "setSkin"){
            if (schoolId == commandInfo.data.schoolId) {
              skin = commandInfo.data.skinName;
                document.getElementsByName("notifyDiv")[0].id=skin;
            }
        }else if (commandInfo.command == "classBrandNotice" && commandInfo.data.classroomid == roomId) {
            slideNumber = 1;
            InitializePage();
        }
    })



    //历史通知
    // notifySeeMore = function () {
    //     parent.location.href = "http://192.168.50.72:7091/notify/historyNotify/index.html?roomId=1&skin="+skin;
    // }
    $('#notifySeeMore').on('click', function () {
        var data = {
            method: 'openNewPage',
            url: "notify/historyNotify/index.html?roomId=" + roomId+"&skin="+skin,
        };
        Bridge.callHandler(data, null, function (error) {
            window.parent.postMessage(JSON.stringify(data), '*');
        });
    });



    //初始化页面元素
    function InitializePage() {
        // $(".swiper-wrapper").empty();
        mySwiper.removeAllSlides();
        // setTimeout(function(){
            getNotifyInfo(roomId);

        // },1000)
    }
    function getNotifyInfo(roomId) {
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "classroomId": roomId,
            "pageNo": slideNumber
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var rowData = result.response;
                    //数据为空
                    if (rowData.length == 0 && slideNumber == 1) {
                        mySwiper.appendSlide("<div class='empty_center'><div class='empty_icon empty_notify'></div><div class='empty_text'>暂无通知</div></div>", 'swiper-slide');
                    }
                    if (rowData.length == 0 && slideNumber != 1) {
                        mySwiper.appendSlide("<div class='noMoreData'>无更多数据</div>", 'swiper-slide');
                        loadingMore = false;
                    }

                    rowData.forEach(function(v, i){
                            mySwiper.appendSlide(
                                `
                                <div>
                                    <li>
                                        <span class="notify_list text_hidden"
                                                onClick="getContent('${v.noticeTitle}','${v.noticeContent}')">${v.noticeTitle}</span>
                                        <i class="titleMore notify_titleMore"></i>
                                    </li>
                                </div>
                                `
                                , 'swiper-slide swiper-slide-visible')

                    })

                    if ($(".swiper").height() - $(".swiper-wrapper").height() <= 0) {
                    }
                    //释放拖动
                    mySwiper.params.onlyExternal = false;
                    mySwiper.updateActiveSlide(0);
                    $('.preloader').removeClass('visible');
                    //一个小bug 暂未查出原因。
                    $('.swiper-wrapper').css({ height: $('.swiper-wrapper').height() - 1 });
                    slideNumber++;
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
    * 获取地址栏参数
    * @param name
    * @returns {null}
    * @constructor
    */
    function getQueryString(parameterName) {
        var reg = new RegExp("(^|&)" + parameterName + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

})