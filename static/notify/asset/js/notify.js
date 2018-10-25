$(function () {
    //拖动偏移量
    var holdPosition = 0;
    // var holdPosition =
    //页码
    var slideNumber = 1;
    var loadingMore = true;

    //给定swiper固定高度
    $(".swiper").height($('.inner_bg').height() - $('.navBar').height());
    InitializePage();
    var schoolId =getQueryString("schoolId");
    console.log("schoolId",schoolId);

    //监听接受消息
    window.addEventListener('message', (e) => {
        var commandInfo = JSON.parse(e.data);
        if(commandInfo.command == "setSkin"){
            if (schoolId == commandInfo.data.schoolId) {
                var skin = commandInfo.data.skinName;
                document.getElementsByName("notifyDiv")[0].id=skin;
            }
        }
    })

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
            console.log(pos, 'pospospospospospos');
            // console.log($('.swiper-wrapper').height(),'swiper-wrapper')
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
                        getHomeworkData();
                    }, slideNumber == 3 ? 500 : 500)
                }

            } else {
                console.log('进入未知空间');
            }
        }
    });



    notifySeeMore = function () {
        parent.location.href = "http://localhost:7091/notify/historyNotify/index.html?roomId=1";
    }
    $('#notifySeeMore').on('click', function () {
        var data = {
            method: 'openNewPage',
            url: "notify/historyNotify/index.html?roomId=" + 1,
        };
        Bridge.callHandler(data, null, function (error) {
            window.parent.postMessage(JSON.stringify(data), '*');
        });
    });


    getIndex = function (index) {
        $(".modal").hide();
        $(".modal").eq(index).show();
        console.log(index, "index")
    }
    closeModal = function (index) {
        $(".modal").hide();
        $(".modal").eq(index).hide();
        console.log(index, "index")
    }

    //初始化页面元素
    function InitializePage() {
        var roomId = getQueryString("roomId");
        console.log(roomId, "roomId")
        getNotifyInfo(1);
        // getNotifyInfo(roomId);
    }
    function getNotifyInfo(roomId) {
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "classroomId": roomId,
            "pageNo": slideNumber
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "2345678");
                if (result.msg == '调用成功' || result.success == true) {
                    // result.response = [{
                    //     classroomId: 1,
                    //     createTime: "2018-05-31",
                    //     id: 141,
                    //     noticeContent: "今日",
                    //     noticeTitle: "扫除",
                    //     type: 1,
                    //     uid: 0
                    // }, {
                    //     classroomId: 1,
                    //     createTime: "2018-05-31",
                    //     id: 141,
                    //     noticeContent: "今日2",
                    //     noticeTitle: "扫除扫除扫除",
                    //     type: 1,
                    //     uid: 0
                    // }]
                    let rowData = result.response;
                    //数据为空
                    if (rowData.length == 0 && slideNumber == 1) {
                        mySwiper.appendSlide("<div class='noMoreData'>数据为空</div>", 'swiper-slide');
                    }
                    if (rowData.length == 0 && slideNumber != 1) {
                        mySwiper.appendSlide("<div class='noMoreData'>无更多数据</div>", 'swiper-slide');
                        loadingMore = false;
                    }

                    rowData.forEach((v, i) => {
                            mySwiper.appendSlide(
                                `
                                <div>
                                    <li>
                                        <span class="notify_list text_hidden"
                                                onClick="getIndex(${i})">${v.noticeTitle}</span>
                                        <i class="titleMore notify_titleMore"></i>
                                    </li>
                                    <div class="modal" style="display:none">
                                        <span onClick="closeModal(${i})">关闭</span>
                                        <div>扫除</div>
                                        ${v.noticeContent}
                                    </div>
                                </div>
                                `
                                , 'swiper-slide swiper-slide-visible')

                    })

                    // }

                    if ($(".swiper").height() - $(".swiper-wrapper").height() <= 0) {
                        // console.log('触发二次')
                        // mySwiper.setWrapperTranslate(0,$(".swiper").height() - $(".swiper-wrapper").height(),0)
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