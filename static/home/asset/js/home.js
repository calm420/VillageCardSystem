$(document).ready(function () {
    var ms = new MsgConnection();

    var isDebug = true;
    var webserviceUrl = isDebug ? "http://127.0.0.1:7091/" : "http://jiaxue.maaee.com:7091/";

    InitializePage();

    //初始化页面元素
    function InitializePage() {
        // clazzId=819&roomId=1&mac=14:1f:78:73:1e:c3&schoolId=9
        //获取基本的地址栏参数,标识班牌的学校\班级等信息
        var clazzId = getQueryString("clazzId");
        var roomId = getQueryString("roomId");
        var mac = getQueryString("mac");
        var schoolId = getQueryString("schoolId");

        var pro = {
            "command": "braceletBoxConnect",
            "data": {
                "type": "web",
                "machine": mac,
                "version": '1.0',
                "webDevice": WebServiceUtil.createUUID()
            }
        };

        $("#studentOnDuty")[0].src = webserviceUrl + "studentOnDuty?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        $("#moralEducationScore")[0].src = webserviceUrl + "moralEducationScore?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        $("#classDemeanor")[0].src = webserviceUrl + "classDemeanor?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        $("#notify")[0].src = webserviceUrl + "notify?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        $("#application")[0].src = webserviceUrl + "application?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        $("#courseOfToday")[0].src = webserviceUrl + "courseOfToday?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        $("#courseAttendance")[0].src = webserviceUrl + "currentAttendance?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        $("#header")[0].src = webserviceUrl + "header?clazzId=" + clazzId + "&roomId=" + roomId + "&mac=" + mac + "&schoolId=" + schoolId;
        setTimeout(function () {
            ms.connect(pro);
            msListener()
        }, 3000)
    }

    /**
     * message消息
     */
    function msListener() {
        ms.msgWsListener = {
            onError: function (errorMsg) {
                // Toast.fail(errorMsg)
            }, onWarn: function (warnMsg) {
                // Toast.fail(warnMsg)
            }, onMessage: function (info) {
                document.querySelector('#courseOfToday').contentWindow.postMessage(JSON.stringify(info), '*');
                document.querySelector('#courseAttendance').contentWindow.postMessage(JSON.stringify(info), '*');
            }
        }
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
        if (r != null) return unescape(r[2]);
        return null;
    }

});

$(function () {

    var article = {};
    article.attacheMents = [];
    // InitializePage();

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
        var res = JSON.parse(e.data);
        if (res.method == 'editor') {
            article = res.article;
            console.log(article, '编辑时候的data');
        }
    })


})