

$(document).ready(function () {
    var ms = new MsgConnection();
    var simpleMs = new SimpleConnection();
    simpleMs.connect();

    var webserviceUrl = WebServiceUtil.isDebug_ifream ? "http://"+WebServiceUtil.localDebugUrl+":7091/" : "https://jiaoxue.maaee.com:9092/";

    InitializePage();

    //初始化页面元素
    function InitializePage() {
        // clazzId=819&roomId=1&mac=14:1f:78:73:1e:c3&schoolId=9
        //获取基本的地址栏参数,标识班牌的学校\班级等信息
        var clazzId = WebServiceUtil.GetQueryString("clazzId");
        var roomId = WebServiceUtil.GetQueryString("roomId");
        var mac = WebServiceUtil.GetQueryString("mac");
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

        $("#header")[0].src = webserviceUrl + "schoolHeader?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId + "&v=0.0.1";
        setTimeout(function () {
            ms.connect(pro);
            msListener();
            simpleListener();
            // getBraceletBoxSkinBySchoolId(schoolId);
        }, 3000)
    }


    function msListener() {
        var schoolId = WebServiceUtil.GetQueryString("schoolId");
        ms.msgWsListener = {
            onError: function (errorMsg) {
                console.log("error at msListener:"+errorMsg);
            }, onWarn: function (warnMsg) {
                console.log("warnMsg at msListener:"+warnMsg);
            }, onMessage: function (info) {
                console.log("info at msListener",info);
                
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
                if(info.command=="refreshClassCardPage"){
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
