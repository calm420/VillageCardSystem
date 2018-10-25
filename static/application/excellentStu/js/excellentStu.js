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

    //初始化页面元素
    function InitializePage() {
        var clazzId = getQueryString("clazzId");
        getExcellentStu(clazzId);
    }

    function getExcellentStu(classId){
        var param = {
            "method": 'getBraceletAttendTopStudentByClazzId',
            "clazzId": classId
        };
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    console.log(result.response);
                    //var response = [{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.15:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}},{"attendTime":1530193673000,"user":{"avatar":"http://192.168.50.34:8080/Excoord_For_Education/userPhoto/default_avatar.png","colAccount":"ST23993","colPasswd":"bd3adc44bd53e6473e81885d05252f38","colUid":23993,"colUtype":"STUD","colValid":1,"schoolId":9,"schoolName":"hzbtest","userName":"小兔兔"}}];
                    this.setState({
                        getExcellentStuData: result.response
                    })
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

      /**
     * 获取地址栏参数
     * @param name
     * @returns {null}
     * @constructor
     */
    function getQueryString(parameterName){
        var reg = new RegExp("(^|&)"+ parameterName +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

})