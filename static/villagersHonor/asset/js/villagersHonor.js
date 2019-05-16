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
        var villageId = WebServiceUtil.GetQueryString("villageId");
        getDutyInfo(villageId);
        setTimeout(function () {
            if(!!vertical) {
                $('.studentOnDuty_list').width('2.73rem')
            }
        },1000)
    }

    function getDutyInfo(villageId) {
        var param = {
            "method": 'getHonorVillager',
            "villageId": villageId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result)
                var str = '';
                // var src_1 = 'https://avatar-static.segmentfault.com/546/141/54614191-5a7e3527a5cc4_big64';
                for (let i = 0; i < result.response.length; i++) {
                    str += '<li><span>'+(i+1)+'</span><span>'+result.response[i].userName+'</span><img src='+result.response[i].avatar+' alt=""></li>'
                    // str += '<li><span>'+(i+1)+'</span><span>'+result.response[i].userName+'</span><img src='+src_1+' alt=""></li>'
                }
                document.getElementById("honor").innerHTML = str
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

});