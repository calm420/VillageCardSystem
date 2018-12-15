$(function () {
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    var clazzId = WebServiceUtil.GetQueryString("clazzId");
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var font = WebServiceUtil.GetQueryString('font');
    var skin;
    $('html').css('font-size', font)
    InitializePage();

    //监听接受消息
    window.addEventListener('message', function(e){
        var commandInfo = JSON.parse(e.data);
        if(commandInfo.command == "setSkin"){
            if (schoolId == commandInfo.data.schoolId) {
                skin = commandInfo.data.skinName;
                document.getElementsByName("moralEducationScoreDiv")[0].id=skin;
            }
        }
        if (commandInfo.command == "moralEducation") {
            InitializePage();
        }
    })

    //初始化页面元素
    function InitializePage() {
        getMoralEducationInfo(clazzId);
    }
    function getMoralEducationInfo(clazzId) {
        var param = {
            "method": "getMoralEducationInfo",
            "clazzId": clazzId,
        }
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "result");
                if (result.msg == '调用成功' || result.success == true) {
                    if (result.response == null) {
                        $(".mEScoreInfo").replaceWith('<div class="mEScoreInfo home_cardCont"><div class="empty_center"><div class="empty_icon empty_moralEducationScore"></div><div class="empty_text">暂无评分</div></div></div>');
                    } else {
                        $(".schoolScore").html(result.response.schoolRank)
                        $(".gradeScore").html(result.response.clazzRank)
                        $(".sumSocre").html(result.response.totalScore)
                        $(".ceremonyScore").html(result.response.politeness)
                        $(".healthSocre").html(result.response.health)
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    $('#seeMoreHistory').on('click', function () {
        var data = {
            method: 'openNewPage',
            url: "moralEducationScore/historyScore/index.html?roomId=" + roomId + "&clazzId=" + clazzId + "&schoolId=" + schoolId+"&skin="+skin,
        };
        window.parent.postMessage(JSON.stringify(data), '*');
    });

})