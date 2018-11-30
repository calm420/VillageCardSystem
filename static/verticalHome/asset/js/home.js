

$(document).ready(function () {
    // alert("AAAA");
    //alert(window.location.href);

    var ms = new MsgConnection();

    var simpleMs = new SimpleConnection();
    simpleMs.connect();

    var isDebug = false;

    var webserviceUrl = isDebug ? "http://192.168.50.163:7091/" : "https://jiaoxue.maaee.com:9092/";
    // var webserviceUrl = isDebug ? "http://192.168.1.100:7091/" : "https://jiaoxue.maaee.com:9092/";


    InitializePage();


    //初始化页面元素
    function InitializePage() {
        // clazzId=819&roomId=1&mac=14:1f:78:73:1e:c3&schoolId=9
        //获取基本的地址栏参数,标识班牌的学校\班级等信息
        var clazzId = getQueryString("clazzId");
        var roomId = getQueryString("roomId");
        var mac = getQueryString("mac");
        var schoolId = getQueryString("schoolId");
        var pro = {
            "command": "braceletBoxConnect",
            "data": {
                "type": "web",
                "machine": mac,
                "version": '1.0',
                "webDevice": WebServiceUtil.createUUID()
            }
        };

        console.log(window.screen.width);
        console.log(window.screen.height);

        $("#studentOnDuty")[0].src = webserviceUrl + "studentOnDuty?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size')+"&screenWidth="+window.screen.width+"&screenHeight="+window.screen.height+"&vertical=true";
        $("#moralEducationScore")[0].src = webserviceUrl + "moralEducationScore?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#classDemeanor")[0].src = webserviceUrl + "classDemeanor?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#notify")[0].src = webserviceUrl + "notify?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#application")[0].src = webserviceUrl + "application?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#courseOfToday")[0].src = webserviceUrl + "courseOfToday?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#courseAttendance")[0].src = webserviceUrl + "courseAttendance?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#header")[0].src = webserviceUrl + "header?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&v=0.0.1"+ "&font=" + $('html').css('font-size')+"&screenWidth="+window.screen.width+"&screenHeight="+window.screen.height+"&vertical=true";
        setTimeout(function () {
            ms.connect(pro);
            msListener();
            simpleListener();
            getBraceletBoxSkinBySchoolId(schoolId);
        }, 3000)
    }


    function msListener() {
        var schoolId = getQueryString("schoolId");
        ms.msgWsListener = {
            onError: function (errorMsg) {
                // Toast.fail(errorMsg)
            }, onWarn: function (warnMsg) {
                // Toast.fail(warnMsg)
            }, onMessage: function (info) {
                console.log(info,"info")
                if(info.command == "braceletBoxConnect"){
                    if(info.data.playPushVideoStatus != undefined) {
                        var videoData = JSON.parse(info.data.playPushVideoStatus);
                        if(videoData.playStatus == "open" && videoData.schoolId == schoolId){
                            playPushVideo(videoData.videoPath)
                        }
                    }
                }
                if (info.command == "playPushVideoStatus" && info.data.playStatus == "open" && info.data.schoolId == schoolId) {
                    playPushVideo(info.data.videoPath)
                } else if (info.command == "playPushVideoStatus" && info.data.playStatus == "close" && info.data.schoolId == schoolId) {
                    closePushVideoMask()
                }
                document.querySelector('#courseOfToday').contentWindow.postMessage(JSON.stringify(info), '*');
                document.querySelector('#courseAttendance').contentWindow.postMessage(JSON.stringify(info), '*');
            }
        }
    }


    function simpleListener() {
        simpleMs.msgWsListener = {
            onError: function (errorMsg) {
                // Toast.fail(errorMsg)
            }, onWarn: function (warnMsg) {
                // Toast.fail(warnMsg)
            }, onMessage: function (info) {

                document.querySelector('#classDemeanor').contentWindow.postMessage(JSON.stringify(info), '*');
                document.querySelector('#studentOnDuty').contentWindow.postMessage(JSON.stringify(info), '*');
                document.querySelector('#notify').contentWindow.postMessage(JSON.stringify(info), '*');
                document.querySelector('#moralEducationScore').contentWindow.postMessage(JSON.stringify(info), '*');
            }
        }
    }


    function getBraceletBoxSkinBySchoolId(schoolId) {
        var param = {
            "method": 'getBraceletBoxSkinBySchoolId',
            "schoolId": schoolId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        console.log("===========>" + result.response.skinAttr);
                        document.getElementsByName("homeDiv")[0].id = result.response.skinAttr;
                        var clientWidth = document.body.clientWidth;
                        console.log("clientWidth", clientWidth);
                        var dateJson = {
                            skinName: result.response.skinAttr,
                            schoolId: schoolId,
                            clientWidth: clientWidth
                        };
                        var commandJson = { command: 'setSkin', data: dateJson };
                        document.querySelector('#header').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                        document.querySelector('#classDemeanor').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                        document.querySelector('#courseOfToday').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                        document.querySelector('#courseAttendance').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                        document.querySelector('#studentOnDuty').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                        document.querySelector('#moralEducationScore').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                        document.querySelector('#notify').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                        document.querySelector('#application').contentWindow.postMessage(JSON.stringify(commandJson), '*');
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    function getQueryString(parameterName) {
        var reg = new RegExp("(^|&)" + parameterName + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    window.addEventListener('message', function (e) {
        var res = JSON.parse(e.data);
        if (res.method == 'openNewPage') {
            var data = {
                method: 'openNewPage',
                url: webserviceUrl + res.url,
            }
            Bridge.callHandler(data, null, function (error) {
                window.location.href = webserviceUrl + res.url;
            });
        } else if ("playVideo" == res.method) {
            if (WebServiceUtil.isEmpty(res.src) == false) {
                playVideo(res.src);
            }
        } else if ("notifyContentShow" == res.method) {
            if (WebServiceUtil.isEmpty(res) == false) {
                getNotifyData(res.notifyTitle, res.notifyContent);
            }
        } else if ("playImage" == res.method) {
            if (WebServiceUtil.isEmpty(res.src) == false) {
                playImage(res.src);
            }
        }

    });

});
