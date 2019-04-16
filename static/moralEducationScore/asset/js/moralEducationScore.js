$(function () {
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    var clazzId = WebServiceUtil.GetQueryString("clazzId");
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var font = WebServiceUtil.GetQueryString('font');
    var skin="skin_default";
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
                        var response = result.response;
                        var createTimeStr = WebServiceUtil.formatMD(response.createTime);
                        console.log("createTimeStr",createTimeStr);
                        $(".scoreDate").html(createTimeStr);
                        $(".schoolScore").html(response.schoolRank)
                        $(".gradeScore").html(response.clazzRank)
                        $(".sumSocre").html(response.totalScore)
                        $(".ceremonyScore").html(response.politeness)
                        $(".healthSocre").html(response.health)
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
            url: "moralEducationScore/historyScore/index.html?roomId=" + roomId + "&clazzId=" + clazzId + "&schoolId=" + schoolId+"&skin="+skin+"&font="+font,
        };
        window.parent.postMessage(JSON.stringify(data), '*');
    });

})