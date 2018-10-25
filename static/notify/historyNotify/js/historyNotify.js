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

    function sendMessageTo(data) {
        window.parent.postMessage(JSON.stringify(data), '*');
    }

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

     /**
     * getTimeFormat时间戳转换格式
     */
    getTimeFormat = function(t) {
        var _time = new Date(t);
        // var   year=_time.getFullYear();//年
        var month = (_time.getMonth() + 1) < 10 ? ("0" + (_time.getMonth() + 1)) : (_time.getMonth() + 1);//月
        var date = _time.getDate() < 10 ? "0" + _time.getDate() : _time.getDate();//日
        var hour = _time.getHours() < 10 ? "0" + _time.getHours() : _time.getHours();//时
        var minute = _time.getMinutes() < 10 ? "0" + _time.getMinutes() : _time.getMinutes();//分
        // var   second=_time.getSeconds();//秒
        return month + "/" + date + " " + hour + ":" + minute;
    }

    //初始化页面元素
    function InitializePage() {
        var roomId = getQueryString("roomId");
        console.log(roomId, "roomId")
        getNotifyInfo(1);
        // getNotifyInfo(roomId);
    }
    function getNotifyInfo(roomId) {
        var param = {
            "method": 'getClassBrandNoticeListByClassId',
            "classroomId": roomId,
            "pageNo": -1
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "2345678");
                if (result.msg == '调用成功' || result.success == true) {
                    result.response = [{
                        classroomId: 1,
                        createTime: "2018-05-31",
                        id: 141,
                        noticeContent: "今日",
                        noticeTitle: "扫除",
                        type: 1,
                        uid: 0
                    }, {
                        classroomId: 1,
                        createTime: "2018-05-31",
                        id: 141,
                        noticeContent: "今日2",
                        noticeTitle: "扫除扫除扫除",
                        type: 1,
                        uid: 0
                    }]
                    if (result.response.length == 0) {
                        console.log("12")
                        $(".notify_list").replaceWith(`<div class="mEScoreInfo home_cardCont">
                        <div class="empty_center">
                            <div class="empty_icon empty_moralEducationScore"></div>
                            <div class="empty_text">暂无通知</div>
                        </div>
                    </div>`)
                    } else {
                        result.response.forEach((v, i) => {
                            $(".notify_list").append(
                                `
                                <div class="divBox">
                                <ul class="ulBox">
                                    <li onClick={this.onClick}>
                                        <p class="title">${v.noticeTitle}<span
                                        class="time">getTimeFormat(${v.createTime})</span></p>
                                        <div class="noticeContent" style={{display: ${i} == '0' ? "block" : "none"}}>
                                            ${v.noticeContent}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                                `
                            )
                        })

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