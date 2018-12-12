$(function () {
    var skin;
    var roomId = getQueryString("roomId");
    var font = getQueryString('font')
    $('html').css('font-size', font)
    var loadFilter = true;
    //拖动偏移量
    var holdPosition = 0;
    // var holdPosition =
    //页码
    var slideNumber = 1;
    var loadingMore = true;
    var schoolId = getQueryString("schoolId");

    //给定swiper固定高度
    $(".swiper").height($('.inner_bg').height() - $('.navBar').height());
    // $(".swiper-container").height($('.inner_bg').height() - $('.navBar').height())
    InitializePage();


    $('.swiper').on('scroll', function (e) {
        var container = document.getElementsByClassName('swiper')[0];
        console.log(container);
        var scorllTop = container.scrollTop;
        var maxScroll = container.scrollHeight - container.offsetHeight;
        console.log(scorllTop,'scrollTop');
        console.log(maxScroll,'maxScroll');
        if (scorllTop >= maxScroll) {
            // console.log('开始上拉');
            // $('.swiper-container').css({transform: 'translate(0,-100px)'});
            if (loadFilter) {
                loadFilter = false;
                $('.preloader').text('正在加载...');
                setTimeout(function () {
                    getNotifyInfo(roomId);
                }, 500)


            }

        }

    })


    // //创建swiper对象
    // var mySwiper = new Swiper('.swiper-container', {
    //     //显示数据的条数
    //     slidesPerView: 'auto',
    //     mode: 'vertical',
    //     //swipe拖动时的即时更新
    //     watchActiveIndex: true,
    //     onTouchStart: function () {
    //         holdPosition = 0;
    //     },
    //     //抵抗下拉反弹事件回调
    //     onResistanceBefore: function (s, pos) {
    //         holdPosition = '下拉刷新';
    //     },
    //     //上拉刷新事件抵抗反弹回调
    //     onResistanceAfter: function (s, pos) {
    //         if (pos > 300) {
    //             holdPosition = '上拉加载更多';
    //         } else {
    //             mySwiper.setWrapperTranslate($(".swiper").height() - $(".swiper-wrapper").height());
    //         }
    //     },
    //     //结束回调
    //     onTouchEnd: function () {
    //         // console.log(holdPosition, 'holdPosition');
    //         // console.log($(window).height(), 'height')
    //         if (holdPosition == '下拉刷新') {
    //             // console.log('下拉刷新');
    //         } else if (holdPosition == '上拉加载更多') {
    //             if (loadingMore) {
    //                 if (slideNumber == 2) {
    //                     $('.swiper-wrapper').css({ transform: 'translate3d(0px, -2150.2px, 0px)' })
    //                 }
    //                 console.log('上拉加载');
    //                 // if($(".swiper").height() - $(".swiper-wrapper").height() <= 0){
    //                 //     console.log('进入');
    //                 //100为loading高度
    //                 console.log('回弹')
    //                 //规避第二页下拉位置偏差问题
    //                 if (slideNumber == 3) {
    //                     mySwiper.setWrapperTranslate($(".swiper").height() - $(".swiper-wrapper").height() - 180);
    //                 } else {
    //                     mySwiper.setWrapperTranslate($(".swiper").height() - $(".swiper-wrapper").height() - 100);
    //                 }
    //                 // }
    //                 //禁止拖动
    //                 mySwiper.params.onlyExternal = true;
    //                 //loading显示
    //                 $('.preloader').addClass('visible');
    //                 //调用增加数据方法
    //                 setTimeout(function () {
    //                     getNotifyInfo(roomId);
    //                 }, slideNumber == 3 ? 500 : 500)
    //             }

    //         } else {
    //             console.log('进入未知空间');
    //         }
    //     }
    // });


    //监听接受消息
    window.addEventListener('message', function (e) {
        var commandInfo = JSON.parse(e.data);
        // console.log("notify",commandInfo);
        if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                skin = commandInfo.data.skinName;
                document.getElementsByName("notifyDiv")[0].id = skin;
            }
        } else if (commandInfo.command == "classBrandNotice" && commandInfo.data.classroomid == roomId) {
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
            url: "notify/historyNotify/index.html?roomId=" + roomId + "&skin=" + skin,
        };
        window.parent.postMessage(JSON.stringify(data), '*');
    });



    //初始化页面元素
    function InitializePage() {
        // $(".swiper-wrapper").empty();
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
                var rowData = result.response;

                var wrapper = $('.swiper-wrapper');
                // 数据为空
                if (rowData.length == 0 && slideNumber == 1) {
                    wrapper.append("<div class='emptyPage_content'><div class='empty_center'><div class='emptyPage_icon emptyPage_publicImg'></div><div class='emptyPage_text'>暂无数据</div></div></div>");
                }
                // return;
                

                if (result.msg == '调用成功' || result.success == true) {
                    if (rowData.length == 0 && slideNumber != 1) {
                        $('.preloader').text('无更多数据');
                        // wrapper.append("<div class='noMoreData'>无更多数据</div>", 'swiper-slide');
                        loadFilter = false;
                    }else{
                        rowData.forEach(function (v, i) {
                            var title = v.noticeTitle;
                            var content = v.noticeContent;
                            content = content.replace(/\"/g, " ");
                            wrapper.append(
                                '<div>' +
                                '                                    <li>' +
                                '                                        <span class="notify_list text_hidden"\n' +
                                '                                                onClick="getContent(\'' + title + '\',\'' + content + '\')">' + (v.type == 2 ? "[全校通知] " : '') + v.noticeTitle + '</span>' +
                                '                                        <i class="titleMore notify_titleMore"></i>' +
                                '                                    </li>' +
                                '                                </div>'
                            )
    
                        })
                        slideNumber++;
                        loadFilter = true;
                    }
                    
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