$(document).ready(function () {

    InitializePage();

    //监听接受消息
    window.addEventListener('message', (e) => {
        var res = JSON.parse(e.data);
        if (res.method == 'test') {
            console.log(res, '测试的postMessage');
        } else if (res.method == 'clearRichTestSign') {
            //清空编辑器内容
            window.location.reload();
        } else if (res.method == 'closeMask') {

        }
    })

    //初始化页面元素
    function InitializePage() {
        var clazzId = getQueryString("clazzId");
        getClassDemeanorInfo(clazzId);
        getClassRewardInfo(clazzId);
        var mySwiper = new Swiper('.classDemeanor', {
            slidesPerView: 3,
            spaceBetween: 30,
            preloadImages:false,
            /*
            initialSlide :2,
            loop: true,
            loopedSlides:3,*/
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loopFillGroupWithBlank: true,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:false,//修改swiper的父元素时，自动初始化swiper
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
        var mySwiper = new Swiper('.classReward', {
            slidesPerView: 3,
            spaceBetween: 30,
            preloadImages:false,
            /*
            initialSlide :2,
            loop: true,
            loopedSlides:3,*/
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loopFillGroupWithBlank: true,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:false,//修改swiper的父元素时，自动初始化swiper
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
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
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                        } else {
                            var classDemeanors = result.response;
                            classDemeanors.forEach(function (classDemeanor) {
                                if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                    var videoTag = "<div class='swiper-slide'><i onClick=videoOnClick('"+classDemeanor.imagePath.split('?')[0]+"')>"+12312+"</i><video style='width:350px;height: 350px;' src="+classDemeanor.imagePath.split('?')[0]+"></video></div>";
                                    var currentInner = $("#classDemeanor")[0].innerHTML + videoTag;
                                    $("#classDemeanor")[0].innerHTML = currentInner;
                                } else {
                                    if (classDemeanor.imagePath.indexOf('?') == -1) {
                                        var imgTag = "<div class='swiper-slide'><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '?' + WebServiceUtil.LARGE_IMG+"/></div>";
                                        var currentInner = $("#classDemeanor")[0].innerHTML + imgTag;
                                        $("#classDemeanor")[0].innerHTML = currentInner;
                                    } else {
                                        var imgTag = "<div class='swiper-slide'><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '?' + WebServiceUtil.LARGE_IMG+"/></div>";
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

    function getClassRewardInfo(clazzId) {
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": clazzId,
            "type": 2
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                        } else {
                            var classRewards = result.response;
                            classRewards.forEach(function (classDemeanor) {
                                if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                    var videoTag = "<div class='swiper-slide'><i onClick=videoOnClick('"+classDemeanor.imagePath.split('?')[0]+"')>"+12312+"</i><video style='width:350px;height: 350px;' src="+classDemeanor.imagePath.split('?')[0]+"></video></div>";
                                    var currentInner = $("#classReward")[0].innerHTML + videoTag;
                                    $("#classReward")[0].innerHTML = currentInner;
                                } else {
                                    if (classDemeanor.imagePath.indexOf('?') == -1) {
                                        var imgTag = "<div class='swiper-slide'><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '?' + WebServiceUtil.LARGE_IMG+"/></div>";
                                        var currentInner = $("#classReward")[0].innerHTML + imgTag;
                                        $("#classReward")[0].innerHTML = currentInner;
                                    } else {
                                        var imgTag = "<div class='swiper-slide'><img style='width:350px;height: 350px;' id='"+classDemeanor.id+"' src="+classDemeanor.imagePath + '?' + WebServiceUtil.LARGE_IMG+"/></div>";
                                        var currentInner = $("#classReward")[0].innerHTML + imgTag;
                                        $("#classReward")[0].innerHTML = currentInner;
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