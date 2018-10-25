$(document).ready(function(){
    var isDebug = true;
    var webserviceUrl = isDebug?"http://127.0.0.1:7091/":"http://jiaxue.maaee.com:7091/";

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
        $("#studentOnDuty")[0].src=webserviceUrl+"studentOnDuty?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
        $("#moralEducationScore")[0].src=webserviceUrl+"moralEducationScore?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
        $("#classDemeanor")[0].src=webserviceUrl+"classDemeanor?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
        $("#notify")[0].src=webserviceUrl+"notify?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
        $("#application")[0].src=webserviceUrl+"application?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
        $("#courseOfToday")[0].src=webserviceUrl+"courseOfToday?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
        $("#currentAttendance")[0].src=webserviceUrl+"currentAttendance?clazzId="+clazzId+"&roomId="+roomId+"&mac="+mac+"&schoolId="+schoolId;
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

    //监听接受消息
    window.addEventListener('message', (e) => {
        var res = JSON.parse(e.data);
        if (res.method == 'editor') {
            article = res.article;
            console.log(article, '编辑时候的data');
        }else if(res.method="playVideo"){
            if(WebServiceUtil.isEmpty(res.src)==false){
                playVideo(res.src);
            }
        }
    })

});