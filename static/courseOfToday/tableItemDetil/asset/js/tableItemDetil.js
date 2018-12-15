$(function () {
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var skin = WebServiceUtil.GetQueryString("skin");
    document.getElementsByName("tableItemDetil")[0].id = skin;
    var simpleMs = new SimpleConnection();
    simpleMs.connect();
    viewCourseTable(roomId)
    simpleListener();

    document.querySelector('#goback-home').addEventListener('click', function () {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    })

    function viewCourseTable(roomId) {
        var param = {
            "method": 'viewRoomCourseTable',
            "rid": roomId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    buileTable(result.response)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    function simpleListener() {
        simpleMs.msgWsListener = {
            onError: function (errorMsg) {
                // Toast.fail(errorMsg)
            }, onWarn: function (warnMsg) {
                // Toast.fail(warnMsg)
            }, onMessage: function (info) {
                console.log("info",info);
                if(info.command=="refreshClassCardPage"){
                    goHome();
                }
            }
        }
    }

    function buileTable(data) {
        var tbody = ''
        var td;
        for (var k in data) {
            var tr = '';
            data[k].forEach(function (e) {
                if (!!e.courseName) {
                    td = '<td><span class="class_name">' + e.courseName + '</span><span>' + e.classRoom.name + '</span> <span>(' + e.openTime + '-' + e.closeTime + ')</span> </td>'
                } else {
                    td = '<td></td>'
                }
                tr += td;
            })
            var trs = '<tr><td>' + k + '</td>' + tr + '</tr>'
            tbody += trs
        }
        document.querySelector('tbody').innerHTML = tbody
    }

    function goHome() {
        console.log('返回首页');
        var data = {
            method: 'finish',
        };
        Bridge.callHandler(data, null, function (error) {
            window.history.back(-1);
        });
    }

})