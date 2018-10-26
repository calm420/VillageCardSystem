$(function () {

    var article = {};
    var classId = 5447;
    article.attacheMents = [];
    InitializePage();
    var schoolId = getQueryString("schoolId");
    var skin = 'skin_middleSchool';

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
        var commandInfo = JSON.parse(e.data);
        if(commandInfo.command == "setSkin"){
            if (schoolId == commandInfo.data.schoolId) {
                skin = commandInfo.data.skinName;
                document.getElementsByName("applicationDiv")[0].id= skin;
            }
        }
    })

    //跳转蚁巢作业
    $('#toHomeWorkModule').on('click',function(){
        var data = {
            method: 'openNewPage',
            url: "application/homeworkModule/index.html?classId="+classId+"&skin="+skin,
        };

        Bridge.callHandler(data, null, function (error) {
            window.parent.postMessage(JSON.stringify(data), '*');
        });
    });

    //跳转步数
    $('#toStep').on('click',function(){
        var data = {
            method: 'openNewPage',
            url: "application/homeworkModule/index.html?classId="+classId+"&skin="+skin,
        };

        Bridge.callHandler(data, null, function (error) {
            window.parent.postMessage(JSON.stringify(data), '*');
        });
    });


    //跳转卡路里
    $('#toCalories').on('click',function(){
        var data = {
            method: 'openNewPage',
            url: "application/healthStep/index.html?classId="+classId+"&healthType=calories&skin="+skin,
        };

        Bridge.callHandler(data, null, function (error) {
            window.parent.postMessage(JSON.stringify(data), '*');
            // window.location.href = "homeworkModule/index.html?classId="+classId;
        });
    });




    //跳转早到之星
    $('#toExcellentStu').on('click',function(){
        var data = {
            method: 'openNewPage',
            url: "application/excellentStu/index.html?clazzId="+classId+"&skin="+skin,
        };

        Bridge.callHandler(data, null, function (error) {
            window.parent.postMessage(JSON.stringify(data), '*');
        });
    });


    //跳转家校
    $('#toExcellentStu').on('click',function(){
        var data = {
            method: 'gotoNFCbyKK',
        };

        Bridge.callHandler(data, null, function (error) {

        });
    });

    //初始化页面元素
    function InitializePage() {

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