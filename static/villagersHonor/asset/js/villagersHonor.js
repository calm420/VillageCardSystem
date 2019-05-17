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
                console.log(result);
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0) {

                    }else {
                        var str = '';
                        // var src_1 = 'https://avatar-static.segmentfault.com/546/141/54614191-5a7e3527a5cc4_big64';
                        for (let i = 0; i < result.response.length; i++) {
                            if(result.response[i].avatar === undefined){
                                str += '<li><img src=' + '../../../images/default-avatar.jpg' + ' alt=""><span>' + result.response[i].userName + '</span></li>'
                            }else {
                                str += '<li><img src=' + result.response[i].avatar + ' alt=""><span>' + result.response[i].userName + '</span></li>'
                            }
                            // str += '<li><img src='+src_1+' alt=""><span>'+result.response[i].userName+'</span></li>'
                        }
                        document.getElementById("honor").style.display = 'block';
                        document.getElementById("honorEmpty").style.display = 'none';
                        document.getElementById("honor").innerHTML = str
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

});