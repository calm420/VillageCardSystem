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

    notifySeeMore = function(){
        parent.location.href="http://localhost:7091/notify/historyNotify/index.html?roomId=1";
    }
    $('#notifySeeMore').on('click',function(){
        var data = {
            method: 'openNewPage',
            url: "notify/historyNotify/index.html?roomId="+1,
        };

        Bridge.callHandler(data, null, function (error) {
            window.parent.postMessage(JSON.stringify(data), '*');
        });
    });


    getIndex = function (index) {
        $(".modal").hide();
        $(".modal").eq(index).show();
        console.log(index, "index")
    }
    closeModal = function (index) {
        $(".modal").hide();
        $(".modal").eq(index).hide();
        console.log(index, "index")
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
                        $(".notifyData").replaceWith(`<div class="mEScoreInfo home_cardCont">
                        <div class="empty_center">
                            <div class="empty_icon empty_moralEducationScore"></div>
                            <div class="empty_text">暂无通知</div>
                        </div>
                    </div>`)
                    } else {
                        result.response.forEach((v, i) => {
                            $(".notifyData").append(
                                `
                                <div>
                                    <li>
                                        <span class="notify_list text_hidden"
                                                onClick="getIndex(${i})">${v.noticeTitle}</span>
                                        <i class="titleMore notify_titleMore"></i>
                                    </li>
                                    <div class="modal" style="display:none">
                                        <span onClick="closeModal(${i})">关闭</span>
                                        <div>扫除</div>
                                        ${v.noticeContent}
                                    </div>
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