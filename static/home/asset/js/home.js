$(document).ready(function(){
    InitializePage();

    //初始化页面元素
    function InitializePage() {
        // clazzId=819&roomId=1&mac=14:1f:78:73:1e:c3&schoolId=9
        //获取基本的地址栏参数,标识班牌的学校\班级等信息
        var clazzId = getQueryString("clazzId");
        var roomId = getQueryString("roomId");
        var mac = getQueryString("mac");
        var schoolId = getQueryString("schoolId");
        console.log(clazzId+"\t"+roomId+"\t"+mac+"\t"+schoolId);
        localStorage.setItem("clazzId",clazzId);
        sessionStorage.setItem("clazzId",clazzId);
        localStorage.setItem("roomId",roomId);
        localStorage.setItem("mac",mac);
        localStorage.setItem("schoolId",schoolId);
        var message = {clazzId:clazzId};
        $("#studentOnDuty")[0].src="http://127.0.0.1:7091/studentOnDuty?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
        $("#studentOnDuty")[0].contentWindow.postMessage(message,"*");
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