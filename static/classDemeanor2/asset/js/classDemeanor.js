$(document).ready(function () {

    // var startIndex = 0;
    //班级风采
    var DemeanorData = [];
    //班级风采计时器
    var DemeanorTimer = null;
    //当前轮播第一张图片的下标
    var currentIndex = -1;
    //班级荣誉
    var RewardData = [];
    //班级风采计时器
    var RewardTimer = null;
    //当前轮播第一张图片的下标
    var currentIndex_Reward = -1;
    //班级荣誉一张图偏移量
    var offsetDemeanor = 0;
    //按钮节流阀
    var btnFilter = true;
    //
    var DemeanorFilter = false;
    var RewardFilter = false;

    InitializePage();

    //监听接受消息
    window.addEventListener('message', function (e) {
        var clazzId = localStorage.getItem("clazzId");
        var schoolId = localStorage.getItem("schoolId");
        var commandInfo = JSON.parse(e.data);
        if (commandInfo.command == 'classDemeanor') {
            if (clazzId == commandInfo.data.cid) {
                DemeanorFilter = false;
                RewardFilter = false;
                clearInterval(DemeanorTimer);
                clearInterval(RewardTimer);
                getClassDemeanorInfo(clazzId);
                getClassRewardInfo(clazzId);

            }
        } else if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                var skin = commandInfo.data.skinName;
                document.getElementsByName("classDemeanorDiv")[0].id = skin;
            }
        }
    })

    //初始化页面元素
    function InitializePage() {
        var clazzId = WebServiceUtil.GetQueryString("clazzId");
        var schoolId = WebServiceUtil.GetQueryString("schoolId");
        var font = WebServiceUtil.GetQueryString('font')
        var visitType = WebServiceUtil.GetQueryString('visitType')
        if (!!visitType && visitType == 0) {
            $('.classReward').hide();
        }
        $('html').css('font-size', font)
        localStorage.setItem("clazzId", clazzId);
        localStorage.setItem("schoolId", schoolId);
        getClassDemeanorInfo(clazzId);
        getClassRewardInfo(clazzId);
    }

    function getClassDemeanorInfo(clazzId) {
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": clazzId,
            "type": 1
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    $("#classDemeanor")[0].innerHTML = "";
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            var emptyDiv = '<div class=\'empty_center\'><div class=\'empty_icon empty_honor\'></div><div class=\'empty_text\'></div></div>';
                            $("#classDemeanor")[0].innerHTML = emptyDiv;
                        } else {
                            currentIndex = -1;
                            DemeanorData.splice(0);
                            clearInterval(DemeanorTimer);
                            DemeanorData = result.response;
                            // if (DemeanorData.length > 3) {  //班级风采大于三张
                                $('#DemeanorBack').show();
                                $('#DemeanorGo').show();
                                $('#classDemeanor').css({transition: ''});
                                createDemeanor(DemeanorData, DemeanorData.length);
                                DemeanorFilter = true;
                                DemeanorTimer = setInterval(function () {
                                    //加一层判断，后续考虑计时器是否未清
                                    // if (DemeanorData.length > 3) {
                                        doDemeanorTranslageGo(true);
                                    // } else {
                                    //     clearInterval(DemeanorTimer);
                                    // }

                                }, 5000);
                            // } else { //小于三张
                            //     clearInterval(DemeanorTimer);
                            //     currentIndex = 0;
                            //     $('#DemeanorBack').hide();
                            //     $('#DemeanorGo').hide();
                            //     DemeanorFilter = true;
                            //     createDemeanor(DemeanorData, DemeanorData.length);
                            // }
                        }
                    }
                }
            },
            onError: function (error) {

            }
        });
    }


    $('#DemeanorGo').on('click', function () {
        if (btnFilter) {
            isBackOrGoClicked = true;
            if (clearBackOrGoTime) {
                clearTimeout(clearBackOrGoTime);
            }
            doDemeanorTranslageGo(false);
        } else {
            console.log('阻止点击!!!');
        }

    });

    $('#DemeanorBack').on('click', function () {

        if (btnFilter) {
            isBackOrGoClicked = true;
            if (clearBackOrGoTime) {
                clearTimeout(clearBackOrGoTime);
            }
            doDemeanorTranslageBack(false);
        } else {
            console.log('阻止点击!!!');
        }

    });

    var isBackOrGoClicked = false;
    var clearBackOrGoTime;

    function doDemeanorTranslageBack() {
        if (currentIndex < 0) {
            currentIndex = (DemeanorData.length - 1) + currentIndex;
        } else {
            currentIndex--;
        }
        btnFilter = false;
        $('#classDemeanor').css({transition: '2s'})
        $('#classDemeanor').css({transform: 'translate(0px, 0px'}, "slow");
        setTimeout(function () {
            $('#classDemeanor').css({transition: ''});
            createDemeanor(DemeanorData, DemeanorData.length);
            btnFilter = true;
        }, 2000);
    }

    function doDemeanorTranslageGo(auto) {
        if (auto && isBackOrGoClicked) {
            clearBackOrGoTime = setTimeout(function () {
                isBackOrGoClicked = false;
            }, 1000 * 10);
            return;
        }
        currentIndex++;
        btnFilter = false;
        $('#classDemeanor').css({transition: '2s'});
        $('#classDemeanor').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'});
        setTimeout(function () {
            $('#classDemeanor').css({transition: ''});
            createDemeanor(DemeanorData, DemeanorData.length);
            btnFilter = true;
        }, 2000);
    }


    function createDemeanor(data, length) {
        var index = length > 3 ? 5 : length;
        var startIndex = currentIndex;
        if (currentIndex > data.length - 1) {
            currentIndex = 0;
        }
        $("#classDemeanor")[0].innerHTML = '';
        var Demeanors = data;
        var classDemeanors = [];
        for (var i = 0; i < index; i++) { //只控制循环次数
            if (startIndex > data.length - 1) {
                startIndex = 0;
            }
            if (startIndex < 0) {
                startIndex = data.length - 1;
            }
            classDemeanors.push(Demeanors[startIndex]);
            startIndex++;

        }
        console.log(classDemeanors, '重新构建的数组');
        var imageWidth = parseInt($('.classDemeanor').css('width').substring(0, $('.classDemeanor').css('width').length - 2)) * 1;
        var marginRight = parseInt($('.classDemeanor').css('width').substring(0, $('.classDemeanor').css('width').length - 2)) * 1;
        classDemeanors.forEach(function (classDemeanor) {
            var imagePath = classDemeanor.imagePath.split('&');
            var image = imagePath[0];
            if (image.substr(image.length - 3, 3) == 'mp4') {
                var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=videoOnClick('" + image.split('?')[0] + "')><i onClick=videoOnClick('" + image.split('?')[0] + "')></i><img src=" + imagePath[1] + "></div></div>";
                var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                $("#classDemeanor")[0].innerHTML = currentInner;
            } else {
                if (image.indexOf('?') == -1) {
                    var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '?' + WebServiceUtil.LARGE_IMG + '&v=1' + "></div></div>";
                    var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                    $("#classDemeanor")[0].innerHTML = currentInner;
                } else {
                    var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '&' + WebServiceUtil.LARGE_IMG + '&v=1' + "></div></div>";
                    var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                    $("#classDemeanor")[0].innerHTML = currentInner;
                }
            }
        })
        offsetDemeanor = parseInt($('.demeanor_item').css('marginRight').substring(0, $('.demeanor_item').css('marginRight').length - 2)) + parseInt($('.demeanor_item').css('width').substring(0, $('.demeanor_item').css('width').length - 2));
        $('#classDemeanor').css({width: ((offsetDemeanor * 5) + 10) + 'px'});
        // if (index > 3) {  //班级风采大于三张
            $('#classDemeanor').css({transform: 'translate3d(-' + offsetDemeanor + 'px, 0px, 0px)'});
            $('#classDemeanor').removeClass('classReward-Center');
        // } else {  //班级风采小于三张
        //     if (index == 3) {
        //         $('#classDemeanor').removeClass('classReward-Center');
        //     } else {
        //         $('#classDemeanor').addClass('classReward-Center');
        //     }
        //     $('#classDemeanor').css({transform: 'translate3d(0px, 0px, 0px)'});
        // }

    }

    function getClassRewardInfo(clazzId) {
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": clazzId,
            "type": 2
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    $("#classReward")[0].innerHTML = "";
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            var emptyDiv = '<div class=\'empty_center\'><div class=\'empty_icon empty_honor\'></div><div class=\'empty_text\'></div></div>';
                            $("#classReward")[0].innerHTML = emptyDiv;
                        } else {
                            RewardData.splice(0);
                            currentIndex_Reward = -1;
                            clearInterval(RewardTimer);
                            RewardData = result.response;
                            if (RewardData.length > 3) { //班级荣誉大于三张
                                $('#RewardBack').show();
                                $('#RewardGo').show();
                                createReward(RewardData, RewardData.length);
                                RewardFilter = true;
                                RewardTimer = setInterval(function () {
                                    //增加判断条件
                                    if (RewardData.length > 3) {
                                        doRewardTranslageGo(true);
                                    } else {
                                        clearInterval(RewardTimer);
                                        return;
                                    }
                                }, 5000);
                            } else {
                                clearInterval(RewardTimer);
                                currentIndex_Reward = 0;
                                $('#RewardBack').hide();
                                $('#RewardGo').hide();
                                RewardFilter = true;
                                createReward(RewardData, RewardData.length);
                            }
                        }
                    }
                }
            },
            onError: function (error) {

            }
        });
    }

    var isRewardBackOrGoClicked = false;
    var clearRewardBackOrGoTime;
    var rewardBtnFilter = true;

    function doRewardTranslageBack() {
        if (currentIndex_Reward < 0) {
            currentIndex_Reward = (RewardData.length - 1) + currentIndex_Reward;
        } else {
            currentIndex_Reward--;
        }
        rewardBtnFilter = false;
        $('#classReward').css({transition: '2s'})
        $('#classReward').css({transform: 'translate(0px, 0px'}, "slow");
        setTimeout(function () {
            $('#classReward').css({transition: ''});
            createReward(RewardData, RewardData.length);
            rewardBtnFilter = true;
        }, 2000);
    }

    function doRewardTranslageGo(auto) {
        if (auto && isRewardBackOrGoClicked) {
            clearRewardBackOrGoTime = setTimeout(function () {
                isRewardBackOrGoClicked = false;
            }, 1000 * 10);
            return;
        }
        currentIndex_Reward++;
        rewardBtnFilter = false;
        $('#classReward').css({transition: '2s'});
        $('#classReward').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'});
        setTimeout(function () {
            $('#classReward').css({transition: ''});
            createReward(RewardData, RewardData.length);
            rewardBtnFilter = true;
        }, 2000);
    }


    $('#RewardGo').on('click', function () {
        if (rewardBtnFilter) {
            isRewardBackOrGoClicked = true;
            if (clearRewardBackOrGoTime) {
                clearTimeout(clearRewardBackOrGoTime);
            }
            doRewardTranslageGo(false);
        } else {
            console.log('阻止点击!!!');
        }
    });


    $('#RewardBack').on('click', function () {
        if (rewardBtnFilter) {
            //阻止点击
            isRewardBackOrGoClicked = true;
            if (clearRewardBackOrGoTime) {
                clearTimeout(clearRewardBackOrGoTime);
            }
            doRewardTranslageBack(false);
        } else {
            console.log('阻止点击!!!');
        }

    });


    function createReward(data, length) {
        var index = length > 3 ? 5 : length;
        var startIndex = currentIndex_Reward;
        if (currentIndex_Reward > data.length - 1) {
            currentIndex_Reward = 0;
        }
        $("#classReward")[0].innerHTML = '';
        var Demeanors = data;
        var classRewards = [];
        for (var i = 0; i < index; i++) { //只控制循环次数
            if (startIndex > data.length - 1) {
                startIndex = 0;
            }
            if (startIndex < 0) {
                startIndex = data.length - 1;
            }
            classRewards.push(Demeanors[startIndex]);
            startIndex++;

        }
        console.log(classRewards, '重新构建的数组');
        var imageWidth = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 1;
        var marginRight = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 1;
        classRewards.forEach(function (classDemeanor) {
            var imagePath = classDemeanor.imagePath.split('&');
            var image = imagePath[0];
            if (image.substr(image.length - 3, 3) == 'mp4') {
                console.log(classDemeanor, '首帧图片');
                console.log(imagePath[1], '首帧图片');
                var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=videoOnClick('" + image.split('?')[0] + "')><i onClick=videoOnClick('" + image.split('?')[0] + "')></i><img src=" + imagePath[1] + "></div></div>";
                // var videoTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><i onClick=videoOnClick('" + classDemeanor.imagePath.split('?')[0] + "')>" + 12312 + "</i><video poster=" + imagePath[1] + " src=" + classDemeanor.imagePath.split('?')[0] + "></video></div>";
                var currentInner = $("#classReward")[0].innerHTML + imgTag;
                $("#classReward")[0].innerHTML = currentInner;
            } else {
                if (image.indexOf('?') == -1) {
                    var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '?' + WebServiceUtil.LARGE_IMG + '&v=1' + "></div></div>";
                    var currentInner = $("#classReward")[0].innerHTML + imgTag;
                    $("#classReward")[0].innerHTML = currentInner;
                } else {
                    var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '&' + WebServiceUtil.LARGE_IMG + '&v=1' + "></div></div>";
                    var currentInner = $("#classReward")[0].innerHTML + imgTag;
                    $("#classReward")[0].innerHTML = currentInner;
                }
            }
        })
        offsetDemeanor = parseInt($('.demeanor_itemTop').css('marginRight').substring(0, $('.demeanor_itemTop').css('marginRight').length - 2)) + parseInt($('.demeanor_itemTop').css('width').substring(0, $('.demeanor_itemTop').css('width').length - 2));
        $('#classReward').css({width: ((offsetDemeanor * 5) + 10) + 'px'});
        if (index > 3) {  //班级风采大于三张
            $('#classReward').css({transform: 'translate3d(-' + offsetDemeanor + 'px, 0px, 0px)'});
            $('#classReward').removeClass('classReward-Center');
        } else {  //班级风采小于三张
            if (index == 3) {
                $('#classReward').removeClass('classReward-Center');
            } else {
                $('#classReward').addClass('classReward-Center');
            }
            $('#classReward').css({transform: 'translate3d(0px, 0px, 0px)'});
        }
    }

});
