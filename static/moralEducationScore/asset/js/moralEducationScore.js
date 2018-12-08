$(function () {
    var schoolId = getQueryString("schoolId");
    var clazzId = getQueryString("clazzId");
    var font = getQueryString('font')
    $('html').css('font-size', font)
    InitializePage();

    formatHM = function (nS) {
        var da = new Date(parseInt(nS));
        var hour = da.getHours() + ":";
        var minutes = da.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var hmStr = hour + minutes;
        return hmStr;
    };

    //监听接受消息
    window.addEventListener('message', function(e){
        var commandInfo = JSON.parse(e.data);
        if(commandInfo.command == "setSkin"){
            if (schoolId == commandInfo.data.schoolId) {
                var skin = commandInfo.data.skinName;
                document.getElementsByName("moralEducationScoreDiv")[0].id=skin;
            }
        }
        if (commandInfo.command == "moralEducation" && commandInfo.data.cid == clazzId) {
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
    /**
    * 获取地址栏参数
    * @param name
    * @returns {null}
    * @constructor
    */
    function getQueryString(parameterName) {
        var reg = new RegExp("(^|&)" + parameterName + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

})