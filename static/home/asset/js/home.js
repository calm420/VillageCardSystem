$(document).ready(function () {
    var ms = new MsgConnection();
    var simpleMs = new SimpleConnection();
    simpleMs.connect();
    var webserviceUrl = WebServiceUtil.isDebug_ifream ? "http://" + WebServiceUtil.localDebugUrl + ":6091/" : "https://" + WebServiceUtil.localDebugUrl + ":6091/";
    InitializePage();
    //初始化页面元素
    function InitializePage() {
        // clazzId=819&roomId=1&mac=14:1f:78:73:1e:c3&schoolId=9
        //获取基本的地址栏参数,标识班牌的学校\班级等信息
        var clazzId = WebServiceUtil.GetQueryString("clazzId");
        var roomId = WebServiceUtil.GetQueryString("roomId");
        var mac = WebServiceUtil.GetQueryString("mac");
        var villageId = WebServiceUtil.GetQueryString("villageId");
        // var villageId = 9;
        //mac地址约定到后台时全部转为了小写,所以这里再做一次,保证是小写
        mac = mac.toLowerCase();
        var schoolId = WebServiceUtil.GetQueryString("schoolId");
        var pro = {
            "command": "braceletBoxConnect",
            "data": {
                "type": "web",
                "machine": mac,
                "version": '1.1',
                "webDevice": WebServiceUtil.createUUID()
            }
        };
        $("#studentOnDuty")[0].src = webserviceUrl + "villagersHonor?villageId=" + villageId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#moralEducationScore")[0].src = webserviceUrl + "studyList?villageId=" + villageId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#classDemeanor")[0].src = webserviceUrl + "countryRevitalization?villageId=" + villageId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#notify")[0].src = webserviceUrl + "notify?villageId=" + villageId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#application")[0].src = webserviceUrl + "dripDeeds?villageId=" + villageId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#courseOfToday")[0].src = webserviceUrl  + "dangkeNotice?mac=" + mac + "&villageId=" + villageId + "&font=" + $('html').css('font-size');
        $("#courseAttendance")[0].src = webserviceUrl + "dangkeAttendance?villageId=" + villageId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&font=" + $('html').css('font-size');
        $("#header")[0].src = webserviceUrl + "header?villageId=" + villageId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&v=0.0.1";
        setTimeout(function () {
            ms.connect(pro);
            msListener();
            simpleListener();
            getBraceletBoxSkinBySchoolId(schoolId);
        }, 3000)
        var visitType = WebServiceUtil.GetQueryString("visitType");
        if (!!visitType && visitType == 0) {
            var font = WebServiceUtil.GetQueryString('font');
            $('html').css('font-size', font);
            $("#classCardHomePage").addClass('noHeader');
            $("#topHeader").css('display','none');
        }
    }


    function msListener() {
        var schoolId = WebServiceUtil.GetQueryString("schoolId");
        ms.msgWsListener = {
            onError: function (errorMsg) {
                console.log("error at msListener:" + errorMsg);
            }, onWarn: function (warnMsg) {
                console.log("warnMsg at msListener:" + warnMsg);
            }, onMessage: function (info) {
                console.log("info at msListener", info);
                if (info.command == "braceletBoxConnect") {
                    if (info.data.playPushVideoStatus != undefined) {
                        var videoData = JSON.parse(info.data.playPushVideoStatus);
                        if (videoData.playStatus == "open" && videoData.schoolId == schoolId) {
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
                if (info.command == "refreshClassCardPage") {
                    window.location.reload();
                }
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
                        // document.getElementsByName("homeDiv")[0].id = result.response.skinAttr;
                        var clientWidth = document.body.clientWidth;
                        console.log("clientWidth", clientWidth);
                        var dateJson = {
                            skinName: result.response.skinAttr,
                            schoolId: schoolId,
                            clientWidth: clientWidth
                        };
                        var commandJson = {command: 'setSkin', data: dateJson};
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
