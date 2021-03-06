$(function () {
    var skin = "skin_default";
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var villageId = WebServiceUtil.GetQueryString("villageId");
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
                    getNotifyInfo(villageId);
                }, 500)


            }

        }

    })

    //监听接受消息
    window.addEventListener('message', function (e) {
        var commandInfo = JSON.parse(e.data);
        // console.log("notify",commandInfo);
        if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                skin = commandInfo.data.skinName;
                document.getElementsByName("notifyDiv")[0].id = skin;
            }
        } else if (commandInfo.command == "classBrandNotice" && commandInfo.data.classroomid == roomId || commandInfo.data.classroomid == 0 ) {
            slideNumber = 1;
            $(".swiper-wrapper").empty();
            InitializePage();
        }
    })

    $('#notifySeeMore').on('click', function () {
        var data = {
            method: 'openNewPage',
            url: "notify/historyNotify/index.html?roomId=" + roomId + "&skin=" + skin +"&font=" +font,
        };
        window.parent.postMessage(JSON.stringify(data), '*');
    });

    //初始化页面元素
    function InitializePage() {
        // $(".swiper-wrapper").empty();
        // setTimeout(function(){
        getNotifyInfo(villageId);

        // },1000)
    }


    function getNotifyInfo(villageId) {
        var param = {
            "method": 'getArticleInfoListByVillageId',
            "villageId": villageId,
            "pageNo": slideNumber
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result,"re")
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
                            // var title = v.articleTitle;
                            // var content = v.articleContent;
                            var notiObj = JSON.stringify(v).replace(/\"/g, "'");//row的是一个对象
                            // content = content.replace(/\"/g, " ");
                            wrapper.append(
                                '<div>' +
                                '                                    <li>' +
                                '                                        <span class="notify_list text_hidden"\n' +
                                '                                                onClick="getContent(' + notiObj + ')">' + ('') + v.articleTitle + '</span>' +
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

})