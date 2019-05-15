$(function () {
    var font = WebServiceUtil.GetQueryString('font');
    var villageId = WebServiceUtil.GetQueryString("villageId");
    $('html').css('font-size', font)
    InitializePage();

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
                    if (result.response == null) {
                        $(".mEScoreInfo").replaceWith('<div class="mEScoreInfo home_cardCont"><div class="empty_center"><div class="empty_icon empty_moralEducationScore"></div><div class="empty_text">暂无评分</div></div></div>');
                    } else {
                        let str = '';
                        for (let i = 0; i < result.response.length; i++) {
                            str += '<li><span>第'+(i+1)+'名</span><span>'+result.response[i].gradeName+'</span><span>'+result.response[i].sum+'</span></li>'
                        }
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