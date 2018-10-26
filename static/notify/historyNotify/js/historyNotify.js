$(function () {
    //拖动偏移量
    var holdPosition = 0;
    // var holdPosition =
    //页码
    var slideNumber = 1;
    var loadingMore = true;
    var skin = getQueryString("skin");
    document.getElementsByName("historyNotify")[0].id=skin;

    //给定swiper固定高度
    $(".swiper").height($('.inner_bg').height() - $('.navBar').height());
    InitializePage();
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


    /**
   * li元素的点击事件
   */
    onClick = function(index){
        if ($('li').eq(index).find(".noticeContent").css("display") == "none") {
            $("li").find(".noticeContent").css({
                display: 'none'
            })
            $('li').eq(index).find(".noticeContent").css({
                display: 'block'
            })
          
        } else {
            $('li').eq(index).find(".noticeContent").css({
                display: 'none'
            })
            $("li").eq(index + 1).find(".noticeContent").css({
                display: 'block'
            })
        }


    }

     /**
     * getTimeFormat时间戳转换格式
     */
    getTimeFormat=function(t) {
        var _time = new Date(t);
        // var   year=_time.getFullYear();//年
        var month = (_time.getMonth() + 1) < 10 ? ("0" + (_time.getMonth() + 1)) : (_time.getMonth() + 1);//月
        var date = _time.getDate() < 10 ? "0" + _time.getDate() : _time.getDate();//日
        var hour = _time.getHours() < 10 ? "0" + _time.getHours() : _time.getHours();//时
        var minute = _time.getMinutes() < 10 ? "0" + _time.getMinutes() : _time.getMinutes();//分
        // var   second=_time.getSeconds();//秒
        return month + "/" + date + " " + hour + ":" + minute;
    }


    //初始化页面元素
    function InitializePage() {
        var roomId = getQueryString("roomId");
        getNotifyInfo(roomId);
    }
    function getNotifyInfo(roomId) {
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "classroomId": roomId,
            "pageNo": slideNumber
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                var newArr = []
                result.response.forEach(function(v,i){
                    v.createTime = getTimeFormat(v.createTime);
                    newArr.push(v);
                })
                let rowData = newArr;
                //数据为空
                if (rowData.length == 0 && slideNumber == 1) {
                    mySwiper.appendSlide("<div class='emptyPage_content'><div class='empty_center'><div class='emptyPage_icon emptyPage_publicImg'></div><div class='emptyPage_text'>暂无数据</div></div></div>", 'swiper-slide');
                }
                if (rowData.length == 0 && slideNumber != 1) {
                    mySwiper.appendSlide("<div class='noMoreData'>无更多数据</div>", 'swiper-slide');
                    loadingMore = false;
                }
                if (result.msg == '调用成功' || result.success == true) {
                    rowData.forEach(function(v, i){
                        if (i == 0) {
                            mySwiper.appendSlide(
                                `
                                        <li onClick="onClick(${i})">
                                            <p class="title">${v.noticeTitle}<span
                                            class="time">${v.createTime}</span></p>
                                            <div class="noticeContent" style="display:block">
                                                ${v.noticeContent}
                                            </div>
                                        </li>
                                    `
                                , 'swiper-slide swiper-slide-visible')
                        } else {
                            mySwiper.appendSlide(
                                `
                                        <li onClick="onClick(${i})">
                                            <p class="title">${v.noticeTitle}<span
                                            class="time">${v.createTime}</span></p>
                                            <div class="noticeContent" style="display:none">
                                                ${v.noticeContent}
                                            </div>
                                        </li>
                                    `
                                , 'swiper-slide swiper-slide-visible')
                        }

                    })

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
                $('body').html("查询出错:" + JSON.stringify(responseStr))
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


    $('#historyGoBack').on('click', function () {
        console.log('返回首页');
        var data = {
            method: 'finish',
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = 'http://localhost:7091/home';
        });

    })

})