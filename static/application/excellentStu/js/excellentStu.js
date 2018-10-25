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

    //初始化页面元素
    function InitializePage() {
        var clazzId = getQueryString("clazzId");
        getExcellentStu(clazzId);
    }

    function getExcellentStu(classId) {
        var param = {
            "method": 'getBraceletAttendTopStudentByClazzId',
            "clazzId": classId
        };
        console.log(param)
        WebServiceUtil.requestLittleAntApi(true,JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    console.log(result.response);
                    // var arr = [
                    //     {   "attendTime": 1530193673000, 
                    //         "user": { "avatar": "http://192.168.50.15:8080/Excoord_For_Education/userPhoto/default_avatar.png", 
                    //         "colAccount": "ST23993", "colPasswd": "bd3adc44bd53e6473e81885d05252f38", 
                    //         "colUid": 23993, 
                    //         "colUtype": "STUD",
                    //          "colValid": 1, 
                    //          "schoolId": 9, 
                    //          "schoolName":
                    //           "hzbtest", 
                    //           "userName": "小兔兔1" } }, 
                    //     { "attendTime": 1530193673000, 
                    //         "user": { "avatar": "http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png", 
                    //         "colAccount": "ST23993", "colPasswd": "bd3adc44bd53e6473e81885d05252f38", 
                    //         "colUid": 23993, 
                    //         "colUtype": 
                    //         "STUD", 
                    //         "colValid": 1, 
                    //         "schoolId": 9, 
                    //         "schoolName": "hzbtest", 
                    //         "userName": "小兔兔2" } }
                    // ]
                    if (result.response == []) {
                        $(".excellStu").replaceWith(`<div class="mEScoreInfo home_cardCont">
                        <div class="empty_center">
                            <div class="empty_icon empty_moralEducationScore"></div>
                            <div class="empty_text">暂无通知</div>
                        </div>
                    </div>`)
                    } else {
                        result.response.forEach((v, i) => {
                            $(".excellStu .left").append(
                                `
                                    <div class="my_flex">
                                        <span class="num">第${i + 1}名</span>
                                        <div class="info textOver">
                                            <img src=${v.user.avatar} />
                                            <span class="userName textOver">${v.user.userName}</span>
                                        </div>
                                        <span class="time">
                                            <img src="../../../images/clock.png" />
                                            ${formatHM(v.attendTime)}
                                        </span>
                                    </div>
                                   
                                `
                            )
                        })
                    }

                }

            },
            onError: function (error) {
                // Toast.fail(error, 1);
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


    $('#historyGoBack').on('click',function(){
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = 'http://localhost:7091/home';
        });
    })

})