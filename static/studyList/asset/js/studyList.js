$(function () {
    var font = WebServiceUtil.GetQueryString('font');
    var villageId = WebServiceUtil.GetQueryString("villageId");
    $('html').css('font-size', font)
    InitializePage();

    //监听接受消息
    window.addEventListener('message', function(e){
        var commandInfo = JSON.parse(e.data);
        if(commandInfo.command == "setSkin"){
            if (schoolId == commandInfo.data.schoolId) {
                skin = commandInfo.data.skinName;
                // document.getElementsByName("moralEducationScoreDiv")[0].id=skin;
            }
        }
        if (commandInfo.command == "moralEducation") {
            InitializePage();
        }
    })

    //初始化页面元素
    function InitializePage() {
        getMoralEducationInfo(villageId);
    }
    function getMoralEducationInfo(villageId) {
        var param = {
            "method": "getLearningList",
            "villageId": villageId,
        }
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "result");
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response.length === 0) {
                        // $(".mEScoreInfo").replaceWith('<div class="mEScoreInfo home_cardCont"><div class="empty_center"><div class="empty_icon empty_moralEducationScore"></div><div class="empty_text">暂无评分</div></div></div>');
                    } else {
                        var str = '';
                        for (var i = 0; i < result.response.length; i++) {
                            str += '<li><span>'+result.response[i].gradeName+'</span><span>'+result.response[i].sum+'</span></li>'
                        }
                        document.getElementById("studyList").style.display = 'block'
                        document.getElementById("studyListEmpty").style.display = 'none'
                        document.getElementById("studyList").innerHTML = str
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }
})