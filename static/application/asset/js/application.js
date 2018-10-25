$(function () {

    var article = {};
    var classId = 5447;
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
    });




    //跳转蚁巢作业
    $('#toHomeWorkModule').on('click',function(){
        console.log('点击事件')
        var data = {
            method: 'openNewPage',
            url: "homeworkModule/index.html?classId="+classId,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = "homeworkModule/index.html?classId="+classId;
        });
    });

    //跳转步数
    $('#toStep').on('click',function(){
        console.log('点击事件')
        var data = {
            method: 'openNewPage',
            url: "homeworkModule/index.html?classId="+classId,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = "healthStep/index.html?classId="+classId+"&healthType=step";
        });
    });


    //跳转卡路里
    $('#toCalories').on('click',function(){
        console.log('点击事件')
        var data = {
            method: 'openNewPage',
            url: "healthStep/index.html?classId="+classId+"&healthType=calories",
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = "healthStep/index.html?classId="+classId+"&healthType=calories";
        });
    });

    //初始化页面元素
    function InitializePage() {

    }

})