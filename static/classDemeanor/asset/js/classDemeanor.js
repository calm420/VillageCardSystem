$(document).ready(function () {

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
        }else if(commandInfo.command == "setSkin"){
            if (schoolId == commandInfo.data.schoolId) {
                var skin = commandInfo.data.skinName;
                document.getElementsByName("classDemeanorDiv")[0].id=skin;
            }
        }
    })

    //初始化页面元素
    function InitializePage() {
        var clazzId = getQueryString("clazzId");
        var schoolId = getQueryString("schoolId");
        var font = getQueryString('font')
        $('html').css('font-size', font)
        localStorage.setItem("clazzId",clazzId);
        localStorage.setItem("schoolId",schoolId);
        getClassDemeanorInfo(clazzId);
        getClassRewardInfo(clazzId);
        var mySwiper = new Swiper('.classDemeanor', {
            slidesPerView: 3,
            spaceBetween: 12,
            preloadImages:true,
            updateOnImagesReady : true,
            autoplayDisableOnInteraction : false,
            /*
            initialSlide :2,
            loop: true,
            loopedSlides:3,*/
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loopFillGroupWithBlank: true,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:false,//修改swiper的父元素时，自动初始化swiper
        });
        //鼠标覆盖停止自动切换
        mySwiper.el.onmouseover = function(){
            mySwiper.autoplay.stop();
        }

        //鼠标覆盖停止自动切换
        mySwiper.el.onmouseout = function(){
            mySwiper.autoplay.start();
        }

        var mySwiperOfClassReward = new Swiper('.classReward', {
            slidesPerView: 3,
            spaceBetween: 12,
            preloadImages:true,
            updateOnImagesReady : true,
            autoplayDisableOnInteraction : false,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loopFillGroupWithBlank: true,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:false,//修改swiper的父元素时，自动初始化swiper
        });
        //鼠标覆盖停止自动切换
        mySwiperOfClassReward.el.onmouseover = function(){
            mySwiperOfClassReward.autoplay.stop();
        }

        //鼠标覆盖停止自动切换
        mySwiperOfClassReward.el.onmouseout = function(){
            mySwiperOfClassReward.autoplay.start();
        }
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
                    $("#classDemeanor")[0].innerHTML="";
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            var emptyDiv=`
                                   <div class='empty_center'>
                                     <div class='empty_icon empty_honor'></div>
                                     <div class='empty_text'>暂无荣誉</div>
                                    </div>`;
                            $("#classDemeanor")[0].innerHTML = emptyDiv;
                        } else {
                            var classDemeanors = result.response;
                            classDemeanors.forEach(function (classDemeanor) {
                                var imagePath = classDemeanor.imagePath.split('&');
                                classDemeanor.imagePath = imagePath[0];
                                if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                    // console.log(classDemeanor.imagePath,'mp4');
                                    var videoTag = "<div class='swiper-slide'><i onClick=videoOnClick('"+classDemeanor.imagePath.split('?')[0]+"')>"+12312+"</i><video poster="+imagePath[1]+" style='width:350px;height: 350px;' src="+classDemeanor.imagePath.split('?')[0]+"></video></div>";
                                    var currentInner = $("#classDemeanor")[0].innerHTML + videoTag;
                                    $("#classDemeanor")[0].innerHTML = currentInner;
                                } else {
                                    if (classDemeanor.imagePath.indexOf('?') == -1) {
                                        var imgTag = "<div class='swiper-slide'><div onClick=imageOnClick('"+classDemeanor.imagePath.split('?')[0]+"')><img class='imageOnClick' style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '?' + WebServiceUtil.MIDDLE_IMG+"></div></div>";
                                        var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                                        $("#classDemeanor")[0].innerHTML = currentInner;
                                    } else {
                                        var imgTag = "<div class='swiper-slide'><div onClick=imageOnClick('"+classDemeanor.imagePath.split('?')[0]+"')><img class='imageOnClick' style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '&' + WebServiceUtil.MIDDLE_IMG+"></div></div>";
                                        var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                                        $("#classDemeanor")[0].innerHTML = currentInner;
                                    }
                                }
                            })
                        }
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    $(".imageOnClick").on("click", "body", function() {
        alert('这里是动态元素添加的事件');
    });

    function getClassRewardInfo(clazzId) {
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": clazzId,
            "type": 2
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    $("#classReward")[0].innerHTML="";
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                            var emptyDiv=`<div class='empty_center'>
                                     <div class='empty_icon empty_honor'></div>
                                     <div class='empty_text'>暂无班级风采</div>
                                    </div>`;
                            $("#classReward")[0].innerHTML = emptyDiv;
                        } else {
                            var classRewards = result.response;
                            classRewards.forEach(function (classDemeanor) {

                                var imagePath = classDemeanor.imagePath.split('&');
                                classDemeanor.imagePath = imagePath[0];
                                if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                    var videoTag = "<div class='swiper-slide'><i onClick=videoOnClick('"+classDemeanor.imagePath.split('?')[0]+"')>"+12312+"</i><video poster='"+imagePath[1]+"' style='width:350px;height: 350px;' src="+classDemeanor.imagePath.split('?')[0]+"></video></div>";
                                    var currentInner = $("#classReward")[0].innerHTML + videoTag;
                                    $("#classReward")[0].innerHTML = currentInner;
                                } else {
                                    if (classDemeanor.imagePath.indexOf('?') == -1) {
                                        var imgTag = "<div class='swiper-slide'><div onClick=imageOnClick('"+classDemeanor.imagePath.split('?')[0]+"')><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '?' + WebServiceUtil.MIDDLE_IMG+"></div></div>";
                                        var currentInner = $("#classReward")[0].innerHTML + imgTag;
                                        $("#classReward")[0].innerHTML = currentInner;
                                    } else {
                                        var imgTag = "<div class='swiper-slide'><div onClick=imageOnClick('"+classDemeanor.imagePath.split('?')[0]+"')><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '&' + WebServiceUtil.MIDDLE_IMG+"></div></div>";
                                        var currentInner = $("#classReward")[0].innerHTML + imgTag;
                                        $("#classReward")[0].innerHTML = currentInner;
                                    }
                                }


                                // if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                //     var videoTag = "<div class='swiper-slide'><i onClick=videoOnClick('"+classDemeanor.imagePath.split('?')[0]+"')>"+12312+"</i><video poster='' style='width:350px;height: 350px;' src="+classDemeanor.imagePath.split('?')[0]+"></video></div>";
                                //     var currentInner = $("#classReward")[0].innerHTML + videoTag;
                                //     $("#classReward")[0].innerHTML = currentInner;
                                // } else {
                                //     if (classDemeanor.imagePath.indexOf('?') == -1) {
                                //         var imgTag = "<div class='swiper-slide'><div onClick=imageOnClick('"+classDemeanor.imagePath.split('?')[0]+"')><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '?' + WebServiceUtil.MIDDLE_IMG+"></div></div>";
                                //         var currentInner = $("#classReward")[0].innerHTML + imgTag;
                                //         $("#classReward")[0].innerHTML = currentInner;
                                //     } else {
                                //         var imgTag = "<div class='swiper-slide'><div onClick=imageOnClick('"+classDemeanor.imagePath.split('?')[0]+"')><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '&' + WebServiceUtil.MIDDLE_IMG+"></div></div>";
                                //         var currentInner = $("#classReward")[0].innerHTML + imgTag;
                                //         $("#classReward")[0].innerHTML = currentInner;
                                //     }
                                // }
                            })
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
    function getQueryString(parameterName){
        var reg = new RegExp("(^|&)"+ parameterName +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    
});