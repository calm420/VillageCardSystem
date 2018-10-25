$(function () {
    var article = {};
    article.attacheMents = [];
    InitializePage();

    $('#changeImage').click(function () {
        $("#upload").change(function () {
            if (this.files[0]) {
                var formData = new FormData();
                formData.append("file" + 0, this.files[0]);
                formData.append("name" + 0, this.files[0].name);
                $.ajax({
                    type: "POST",
                    url: "https://jiaoxue.maaee.com:8890/Excoord_Upload_Server/file/upload",
                    enctype: 'multipart/form-data',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function (res) {
                    }
                });
            }
        })
    })

    /**
     * 时间戳转年月日
     * @param nS
     * @returns {string}
     */
    formatYMD = function (nS) {
        var da = new Date(parseInt(nS));
        var year = da.getFullYear();
        var month = da.getMonth() + 1;
        var date = da.getDate();
        var ymdStr = [year, month, date].join('-');
        return ymdStr;
    };

    function sendMessageTo(data) {
        window.parent.postMessage(JSON.stringify(data), '*');
    }
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
    window.addEventListener('message', (e) => {
        alert(e);
        var res = JSON.parse(e.data);
        if (res.method == 'test') {
            console.log(res, '测试的postMessage');
        } else if (res.method == 'clearRichTestSign') {
            //清空编辑器内容
            window.location.reload();
        } else if (res.method == 'closeMask') {

        }
    })

    //初始化页面元素
    function InitializePage() {
        var clazzId = getQueryString("clazzId");
        console.log(clazzId,"clazzId")
        // getMoralEducationInfo(5447);
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
                        $(".mEScoreInfo").replaceWith(`<div class="mEScoreInfo home_cardCont">
                        <div class="empty_center">
                            <div class="empty_icon empty_moralEducationScore"></div>
                            <div class="empty_text">暂无通知</div>
                        </div>
                    </div>`)
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