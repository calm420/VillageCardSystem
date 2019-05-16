$(document).ready(function () {
    InitializePage();
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    var clazzId = WebServiceUtil.GetQueryString("clazzId");
    var font = WebServiceUtil.GetQueryString('font')
    var vertical = WebServiceUtil.GetQueryString('vertical')
    $('html').css('font-size', font)

    //监听接受消息
    window.addEventListener('message',function (e) {
        var commandInfo = JSON.parse(e.data);
        if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                var skin = commandInfo.data.skinName;
                // document.getElementsByName("studentOnDutyDiv")[0].id = skin;
            }
        }else if (commandInfo.command == "studentDuty") {
            if (clazzId == commandInfo.data.cid) {
                getDutyInfo(clazzId);
            }
        }
    })

    //初始化页面元素
    function InitializePage() {
        var clazzId = WebServiceUtil.GetQueryString("clazzId");
        // getDutyInfo(clazzId);
        setTimeout(function () {
            if(!!vertical) {
                $('.studentOnDuty_list').width('2.73rem')
            }
        },1000)
    }

    function getDutyInfo(clazzId) {
        var param = {
            "method": 'getClassBrandStudentDutyByToday',
            "clazzId": clazzId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
              
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

});