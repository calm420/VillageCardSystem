$(function () {
    var skin = "skin_default";
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var font = WebServiceUtil.GetQueryString('font')
    $('html').css('font-size', font)
    var loadFilter = true;
    //拖动偏移量
    var holdPosition = 0;
    // var holdPosition =
    //页码
    var slideNumber = 1;
    var loadingMore = true;
    var schoolId = WebServiceUtil.GetQueryString("schoolId");

    //给定swiper固定高度
    $(".swiper").height($('.inner_bg').height() - $('.navBar').height());
    // $(".swiper-container").height($('.inner_bg').height() - $('.navBar').height())
    InitializePage();


    $('.swiper').on('scroll', function (e) {
        var container = document.getElementsByClassName('swiper')[0];
        console.log(container);
        var scorllTop = container.scrollTop;
        var maxScroll = container.scrollHeight - container.offsetHeight;
        // console.log(scorllTop,'scrollTop');
        // console.log(maxScroll,'maxScroll');
        if (scorllTop >= maxScroll) {
            // console.log('开始上拉');
            // $('.swiper-container').css({transform: 'translate(0,-100px)'});
            if (loadFilter) {
                loadFilter = false;
                $(".preloader").show();
                $('.preloader').text('正在加载...');
                setTimeout(function () {
                    getNotifyInfo(roomId);
                }, 500)


            }

        }

    })

    //监听接受消息
    window.addEventListener('message', function (e) {
        var commandInfo = JSON.parse(e.data);

        console.log(commandInfo, '是的撒多所');

        // console.log("notify",commandInfo);
        if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                skin = commandInfo.data.skinName;
                document.getElementsByName("notifyDiv")[0].id = skin;
            }
        } else if (commandInfo.command == "classBrandNotice" && commandInfo.data.classroomid == roomId) {
            slideNumber = 1;
            $(".swiper-wrapper").empty();
            InitializePage();
        } else if(commandInfo.command == "classDemeanor" && commandInfo.data.cid == roomId) {

        }
    })

    // $('#notifySeeMore').on('click', function () {
    //     var data = {
    //         method: 'openNewPage',
    //         url: "notify/historyNotify/index.html?roomId=" + roomId + "&skin=" + skin +"&font=" +font,
    //     };
    //     window.parent.postMessage(JSON.stringify(data), '*');
    // });

    //初始化页面元素
    function InitializePage() {
        // $(".swiper-wrapper").empty();
        // setTimeout(function(){
        getNotifyInfo(roomId);
        getSchoolById(schoolId);
        getAllTeacherStyleList(schoolId);

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
                console.log(result, "re")
                var rowData = result.response;

                var wrapper = $('.swiper-wrapper');
                // 数据为空
                if (rowData.length == 0 && slideNumber == 1) {
                    wrapper.append("<div class='empty_center'><div class='empty_icon empty_notify'></div><div class='empty_text'>暂无数据</div></div>");
                }
                // return;


                if (result.msg == '调用成功' || result.success == true) {
                    if (rowData.length == 0 && slideNumber != 1) {
                        $(".preloader").show();
                        $('.preloader').text('无更多数据');
                        // wrapper.append("<div class='noMoreData'>无更多数据</div>", 'swiper-slide');
                        loadFilter = false;
                    } else {
                        rowData.forEach(function (v, i) {
                            var title = v.noticeTitle;
                            var content = v.noticeContent;
                            var notiObj = JSON.stringify(v).replace(/\"/g, "'");//row的是一个对象
                            content = content.replace(/\"/g, " ");
                            wrapper.append(
                                '<div>' +
                                '                                    <li>' +
                                '                                        <span class="notify_list text_hidden"\n' +
                                '                                                onClick="getContent(' + notiObj + ')">' + (v.type == 2 ? "[全校通知] " : '') + v.noticeTitle + '</span>' +
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

    function getSchoolById(schoolId) {
        var param = {
            "method": 'getSchoolById',
            "id": schoolId,
            "actionName": "sharedClassAction",
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.response.synopsis) {
                    $(".schoolInfo").html(result.response.synopsis)
                } else {
                    $(".schoolInfo").html("")
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    function getAllTeacherStyleList(schoolId) {
        var param = {
            "method": 'getAllTeacherStyleList',
            "schoolId": schoolId,
            "pageNo": -1,
            "actionName": "sharedClassAction",
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "uio")
                result.response.forEach(function (v, i) {
                    console.log(v, "V")
                    $(".listCont").append(
                        '<div class="item">' +
                        '<img src=' + v.avatar + ' alt="">' +
                        '<div class="text">' +
                        '<span class="text_hidden teacherName">' + v.teacherName + '</span>' +
                        '<div class="info">' + v.content + '</div>' +
                        '</div>' +
                        '</div>'
                    )
                })
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

})
