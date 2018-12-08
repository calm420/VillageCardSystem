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

    InitializePage();

    //监听接受消息
    window.addEventListener('message', function (e) {
        var clazzId = localStorage.getItem("clazzId");
        var schoolId = localStorage.getItem("schoolId");
        var commandInfo = JSON.parse(e.data);
        if (commandInfo.command == 'classDemeanor') {
            if (clazzId == commandInfo.data.cid) {
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
        var clazzId = getQueryString("clazzId");
        var schoolId = getQueryString("schoolId");
        var font = getQueryString('font')
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
                            DemeanorData = [];
                            clearInterval(DemeanorTimer);
                            DemeanorData = result.response
                            createDemeanor(DemeanorData);
                            DemeanorTimer = setInterval(function () {
                                currentIndex++;
                                $('#classDemeanor').css({transition: '2s'})
                                $('#classDemeanor').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'});;
                                setTimeout(function () {
                                    $('#classDemeanor').css({transition: ''});
                                    createDemeanor(DemeanorData);
                                }, 2000);
                            }, 5000);
                        }
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    $('#DemeanorGo').on('click', function () {
        if (btnFilter) {
            btnFilter = false;
            currentIndex++;
            clearInterval(DemeanorTimer);
            $('#classDemeanor').css({transition: '2s'})
            $('#classDemeanor').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'}, "slow", function () {
                alert('123');
            });
            setTimeout(function () {
                $('#classDemeanor').css({transition: ''});
                btnFilter = true;
                createDemeanor(DemeanorData);
                DemeanorTimer = setInterval(function () {
                    currentIndex++;
                    $('#classDemeanor').css({transition: '2s'})
                    console.log($('#classDemeanor').css('transition'), 'style');
                    $('#classDemeanor').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'}, "slow", function () {
                        alert('123');
                    });
                    ;
                    setTimeout(function () {
                        $('#classDemeanor').css({transition: ''});
                        createDemeanor(DemeanorData);
                    }, 2000);
                }, 5000);
            }, 2000);
        } else {
            console.log('阻止点击!!!');
        }

    });

    $('#DemeanorBack').on('click', function () {
        if (btnFilter) {
            //阻止点击
            btnFilter = false;
            console.log(currentIndex, '计算前');
            if (currentIndex < 0) {
                currentIndex = (DemeanorData.length - 1) + currentIndex;
            } else {
                currentIndex--;
            }
            console.log(currentIndex, '计算后');
            clearInterval(DemeanorTimer);
            $('#classDemeanor').css({transition: '2s'})
            $('#classDemeanor').css({transform: 'translate(0px, 0px'}, "slow", function () {
                alert('123');
            });
            setTimeout(function () {
                $('#classDemeanor').css({transition: ''});
                //释放点击
                btnFilter = true;
                createDemeanorBack(DemeanorData);
                DemeanorTimer = setInterval(function(){
                    currentIndex++;
                    $('#classDemeanor').css({transition:'2s'})
                    console.log($('#classDemeanor').css('transition'),'style');
                    $('#classDemeanor').css({transform: 'translate(-'+(offsetDemeanor + offsetDemeanor)+'px, 0px'},"slow",function(){alert('123');});;
                    setTimeout(function(){
                        $('#classDemeanor').css({transition:''});
                        createDemeanor(DemeanorData);
                    },2000);
                },5000);
            }, 2000);
        } else {
            console.log('阻止点击!!!');
        }

    });

    function createDemeanorBack(data) {
        var startIndex = currentIndex;
        if (currentIndex < 0) {
            currentIndex = data.length - 1;
        }
        $("#classDemeanor")[0].innerHTML = '';
        var Demeanors = data;
        var classDemeanors = [];
        // debugger;
        for (var i = 0; i < 5; i++) { //只控制循环次数
            if (startIndex > data.length - 1) {
                startIndex = 0;
            }
            if (startIndex < 0) {
                startIndex = data.length - 1;
            }
            classDemeanors.push(Demeanors[startIndex]);
            startIndex++;

        }
        // startIndex = startIndex - 2;
        console.log(classDemeanors, '重新构建的数组');
        var imageWidth = parseInt($('.classDemeanor').css('width').substring(0, $('.classDemeanor').css('width').length - 2)) * 0.3;
        var marginRight = parseInt($('.classDemeanor').css('width').substring(0, $('.classDemeanor').css('width').length - 2)) * 0.05;
        classDemeanors.forEach(function (classDemeanor) {
            var imagePath = classDemeanor.imagePath.split('&');
            var image = imagePath[0];

            // classDemeanor.imagePath = imagePath[0];
            if (image.substr(image.length - 3, 3) == 'mp4') {
                // console.log(classDemeanor.imagePath,'mp4');
                // var videoTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><i onClick=videoOnClick('" + classDemeanor.imagePath.split('?')[0] + "')>" + 12312 + "</i><video poster=" + imagePath[1] + " src=" + classDemeanor.imagePath.split('?')[0] + "></video></div>";
                var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=videoOnClick('" + image.split('?')[0] + "')><i onClick=videoOnClick('" + image.split('?')[0] + "')></i><img src="+imagePath[1]+"></div></div>";
                var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                $("#classDemeanor")[0].innerHTML = currentInner;
            } else {
                if (image.indexOf('?') == -1) {
                    var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '?' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                    $("#classDemeanor")[0].innerHTML = currentInner;
                } else {
                    var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '&' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                    $("#classDemeanor")[0].innerHTML = currentInner;
                }
            }
        })
        // setTimeout(function(){
        offsetDemeanor = parseInt($('.demeanor_item').css('marginRight').substring(0, $('.demeanor_item').css('marginRight').length - 2)) + parseInt($('.demeanor_item').css('width').substring(0, $('.demeanor_item').css('width').length - 2));
        $('#classDemeanor').css({width: ((offsetDemeanor * 5) + 10) + 'px'});
        $('#classDemeanor').css({transform: 'translate3d(-' + offsetDemeanor + 'px, 0px, 0px)'});
        // },100)
    }


    function createDemeanor(data) {
        var startIndex = currentIndex;
        if (currentIndex > data.length - 1) {
            currentIndex = 0;
        }
        // var endIndex = result.response.length <= startIndex?result.response.length:startIndex
        // var classDemeanors = result.response.splice(startIndex,);
        $("#classDemeanor")[0].innerHTML = '';
        var Demeanors = data;
        var classDemeanors = [];
        // debugger;
        for (var i = 0; i < 5; i++) { //只控制循环次数
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
        var imageWidth = parseInt($('.classDemeanor').css('width').substring(0, $('.classDemeanor').css('width').length - 2)) * 0.3;
        var marginRight = parseInt($('.classDemeanor').css('width').substring(0, $('.classDemeanor').css('width').length - 2)) * 0.05;
        classDemeanors.forEach(function (classDemeanor) {
            var imagePath = classDemeanor.imagePath.split('&');
            var image = imagePath[0];

            // classDemeanor.imagePath = imagePath[0];
            if (image.substr(image.length - 3, 3) == 'mp4') {
                // console.log(classDemeanor.imagePath,'mp4');
                // var videoTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><i onClick=videoOnClick('" + classDemeanor.imagePath.split('?')[0] + "')>" + 12312 + "</i><video poster=" + imagePath[1] + " src=" + classDemeanor.imagePath.split('?')[0] + "></video></div>";
                var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=videoOnClick('" + image.split('?')[0] + "')><i onClick=videoOnClick('" + image.split('?')[0] + "')></i><img src="+imagePath[1]+"></div></div>";
                var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                $("#classDemeanor")[0].innerHTML = currentInner;
            } else {
                if (image.indexOf('?') == -1) {
                    var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '?' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                    $("#classDemeanor")[0].innerHTML = currentInner;
                } else {
                    var imgTag = "<div class='swiper-slide demeanor_item' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '&' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                    $("#classDemeanor")[0].innerHTML = currentInner;
                }
            }
        })
        offsetDemeanor = parseInt($('.demeanor_item').css('marginRight').substring(0, $('.demeanor_item').css('marginRight').length - 2)) + parseInt($('.demeanor_item').css('width').substring(0, $('.demeanor_item').css('width').length - 2));
        $('#classDemeanor').css({width: ((offsetDemeanor * 5) + 10) + 'px'});
        $('#classDemeanor').css({transform: 'translate3d(-' + offsetDemeanor + 'px, 0px, 0px)'});

    }

    $('#RewardGo').on('click', function () {
        if (btnFilter) {
            btnFilter = false;
            currentIndex_Reward++;
            clearInterval(RewardTimer);
            $('#classReward').css({transition: '2s'})
            $('#classReward').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'});
            setTimeout(function () {
                $('#classReward').css({transition: ''});
                btnFilter = true;
                createReward(RewardData);
                RewardTimer = setInterval(function () {
                    currentIndex_Reward++;
                    $('#classReward').css({transition: '2s'})
                    $('#classReward').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'});;
                    setTimeout(function () {
                        $('#classReward').css({transition: ''});
                        createReward(RewardData);
                    }, 2000);
                }, 5000);
            }, 2000);
        } else {
            console.log('阻止点击!!!');
        }
    });

    $('#RewardBack').on('click', function () {
        if (btnFilter) {
            //阻止点击
            btnFilter = false;
            if (currentIndex_Reward < 0) {
                currentIndex_Reward = (RewardData.length - 1) + currentIndex_Reward;
            } else {
                currentIndex_Reward--;
            }
            clearInterval(RewardTimer);
            $('#classReward').css({transition: '2s'})
            $('#classReward').css({transform: 'translate(0px, 0px'});
            setTimeout(function () {
                $('#classReward').css({transition: ''});
                //释放点击
                btnFilter = true;
                createRewardBack(RewardData);
                RewardTimer = setInterval(function(){
                    currentIndex_Reward++;
                    $('#classReward').css({transition:'2s'})
                    $('#classReward').css({transform: 'translate(-'+(offsetDemeanor + offsetDemeanor)+'px, 0px'},"slow",function(){alert('123');});;
                    setTimeout(function(){
                        $('#classReward').css({transition:''});
                        createReward(RewardData);
                    },2000);
                },5000);
            }, 2000);
        } else {
            console.log('阻止点击!!!');
        }

    });

    function createRewardBack(data) {
        var startIndex = currentIndex_Reward;
        if (currentIndex_Reward < 0) {
            currentIndex_Reward = data.length - 1;
        }
        $("#classReward")[0].innerHTML = '';
        var Demeanors = data;
        var classRewards = [];
        // debugger;
        for (var i = 0; i < 5; i++) { //只控制循环次数
            if (startIndex > data.length - 1) {
                startIndex = 0;
            }
            if (startIndex < 0) {
                startIndex = data.length - 1;
            }
            classRewards.push(Demeanors[startIndex]);
            startIndex++;

        }
        // startIndex = startIndex - 2;
        console.log(classRewards, '重新构建的数组');
        var imageWidth = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 0.3;
        var marginRight = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 0.05;
        classRewards.forEach(function (classDemeanor) {
            var imagePath = classDemeanor.imagePath.split('&');
            var image = imagePath[0];
            // classDemeanor.imagePath = imagePath[0];
            if (image.substr(image.length - 3, 3) == 'mp4') {
                console.log(classDemeanor,'首帧图片');
                console.log(imagePath[1],'首帧图片');
                var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=videoOnClick('" + image.split('?')[0] + "')><i onClick=videoOnClick('" + image.split('?')[0] + "')></i><img src="+imagePath[1]+"></div></div>";
                // var videoTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><i onClick=videoOnClick('" + classDemeanor.imagePath.split('?')[0] + "')>" + 12312 + "</i><video poster=" + imagePath[1] + " src=" + classDemeanor.imagePath.split('?')[0] + "></video></div>";
                var currentInner = $("#classReward")[0].innerHTML + imgTag;
                $("#classReward")[0].innerHTML = currentInner;
            } else {
                if (image.indexOf('?') == -1) {
                    var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '?' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classReward")[0].innerHTML + imgTag;
                    $("#classReward")[0].innerHTML = currentInner;
                } else {
                    var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '&' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classReward")[0].innerHTML + imgTag;
                    $("#classReward")[0].innerHTML = currentInner;
                }
            }
        })
        // setTimeout(function(){
        offsetDemeanor = parseInt($('.demeanor_itemTop').css('marginRight').substring(0, $('.demeanor_itemTop').css('marginRight').length - 2)) + parseInt($('.demeanor_itemTop').css('width').substring(0, $('.demeanor_itemTop').css('width').length - 2));
        $('#classReward').css({width: ((offsetDemeanor * 5) + 10) + 'px'});
        $('#classReward').css({transform: 'translate3d(-' + offsetDemeanor + 'px, 0px, 0px)'});
        // },100)
        // var startIndex = currentIndex_Reward;
        // if (currentIndex_Reward < 0) {
        //     currentIndex_Reward = data.length - 1;
        // }
        // $("#classReward")[0].innerHTML = '';
        // var Demeanors = data;
        // var classRewards = [];
        // // debugger;
        // for (var i = 0; i < 3; i++) { //只控制循环次数
        //     if (startIndex > data.length - 1) {
        //         startIndex = 0;
        //     }
        //     if (startIndex < 0) {
        //         startIndex = data.length - 1;
        //     }
        //     classRewards.push(Demeanors[startIndex]);
        //     startIndex++;
        // }
        // console.log(classRewards, '重新构建的数组classReward');
        // var imageWidth = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 0.3;
        // var marginRight = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 0.05;
        // classRewards.forEach(function (classDemeanor) {
        //     var imagePath = classDemeanor.imagePath.split('&');
        //     classDemeanor.imagePath = imagePath[0];
        //     if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
        //         var videoTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><i onClick=videoOnClick('" + classDemeanor.imagePath.split('?')[0] + "')>" + 12312 + "</i><video poster='" + imagePath[1] + "' src=" + classDemeanor.imagePath.split('?')[0] + "></video></div>";
        //         var currentInner = $("#classReward")[0].innerHTML + videoTag;
        //         $("#classReward")[0].innerHTML = currentInner;
        //     } else {
        //         if (classDemeanor.imagePath.indexOf('?') == -1) {
        //             var imgTag = "<div class='slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='swiper-slideImage' onClick=imageOnClick('" + classDemeanor.imagePath.split('?')[0] + "')><img id='" + classDemeanor.id + "' src=" + classDemeanor.imagePath + '?' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
        //             var currentInner = $("#classReward")[0].innerHTML + imgTag;
        //             $("#classReward")[0].innerHTML = currentInner;
        //         } else {
        //             var imgTag = "<div class='slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='swiper-slideImage' onClick=imageOnClick('" + classDemeanor.imagePath.split('?')[0] + "')><img id='" + classDemeanor.id + "' src=" + classDemeanor.imagePath + '&' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
        //             var currentInner = $("#classReward")[0].innerHTML + imgTag;
        //             $("#classReward")[0].innerHTML = currentInner;
        //         }
        //     }
        // })
        // setTimeout(function () {
        //
        //     // $('.demeanor_itemTop').css({width: imageWidth+'px',marginRight:marginRight+'px'});
        //     offsetDemeanor = parseInt($('.demeanor_itemTop').css('marginRight').substring(0, $('.demeanor_itemTop').css('marginRight').length - 2)) + parseInt($('.demeanor_itemTop').css('width').substring(0, $('.demeanor_itemTop').css('width').length - 2));
        //     $('#classReward').css({width: ((offsetDemeanor * 5) + 10) + 'px'});
        //     $('#classReward').css({transform: 'translate3d(-' + offsetDemeanor + 'px, 0px, 0px)'});
        // }, 100)
    }


    function createReward(data) {
        var startIndex = currentIndex_Reward;
        if (currentIndex_Reward > data.length - 1) {
            currentIndex_Reward = 0;
        }
        $("#classReward")[0].innerHTML = '';
        var Demeanors = data;
        var classRewards = [];
        // debugger;
        for (var i = 0; i < 5; i++) { //只控制循环次数
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
        var imageWidth = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 0.3;
        var marginRight = parseInt($('.classReward').css('width').substring(0, $('.classReward').css('width').length - 2)) * 0.05;
        classRewards.forEach(function (classDemeanor) {
            var imagePath = classDemeanor.imagePath.split('&');
            var image = imagePath[0];
            // classDemeanor.imagePath = imagePath[0];
            if (image.substr(image.length - 3, 3) == 'mp4') {
                console.log(classDemeanor,'首帧图片');
                console.log(imagePath[1],'首帧图片');
                var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=videoOnClick('" + image.split('?')[0] + "')><i onClick=videoOnClick('" + image.split('?')[0] + "')></i><img src="+imagePath[1]+"></div></div>";
                // var videoTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><i onClick=videoOnClick('" + classDemeanor.imagePath.split('?')[0] + "')>" + 12312 + "</i><video poster=" + imagePath[1] + " src=" + classDemeanor.imagePath.split('?')[0] + "></video></div>";
                var currentInner = $("#classReward")[0].innerHTML + imgTag;
                $("#classReward")[0].innerHTML = currentInner;
            } else {
                if (image.indexOf('?') == -1) {
                    var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '?' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classReward")[0].innerHTML + imgTag;
                    $("#classReward")[0].innerHTML = currentInner;
                } else {
                    var imgTag = "<div class='swiper-slide demeanor_itemTop' style='width:" + imageWidth + "px;margin-right:" + marginRight + "px'><div class='demeanor_itemImage' onClick=imageOnClick('" + image.split('?')[0] + "')><img class='imageOnClick' id='" + classDemeanor.id + "' src=" + image + '&' + WebServiceUtil.MIDDLE_IMG + "></div></div>";
                    var currentInner = $("#classReward")[0].innerHTML + imgTag;
                    $("#classReward")[0].innerHTML = currentInner;
                }
            }
        })
        offsetDemeanor = parseInt($('.demeanor_itemTop').css('marginRight').substring(0, $('.demeanor_itemTop').css('marginRight').length - 2)) + parseInt($('.demeanor_itemTop').css('width').substring(0, $('.demeanor_itemTop').css('width').length - 2));
        $('#classReward').css({width: ((offsetDemeanor * 5) + 10) + 'px'});
        $('#classReward').css({transform: 'translate3d(-' + offsetDemeanor + 'px, 0px, 0px)'});
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
                            RewardData = [];
                            currentIndex_Reward = -1;
                            clearInterval(RewardTimer);
                            RewardData = result.response;
                            createReward(RewardData);
                            RewardTimer = setInterval(function () {
                                currentIndex_Reward++;
                                $('#classReward').css({transition: '2s'})
                                $('#classReward').css({transform: 'translate(-' + (offsetDemeanor + offsetDemeanor) + 'px, 0px'});;
                                setTimeout(function () {
                                    $('#classReward').css({transition: ''});
                                    createReward(RewardData);
                                }, 2000);
                            }, 5000);
                        }
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
        if (r != null) return unescape(r[2]);
        return null;
    }

});