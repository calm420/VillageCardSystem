/**
 * 本节考勤
 */
var debug=true;
var url =debug?"http://192.168.50.15:9006/Excoord_ApiServer/webservice": "https://www.maaee.com/Excoord_For_Education/webservice";
var totalCount=0;
var timerFlag = false;
$(document).ready(function(){
    init();

});
function init(){
    //getStudentByCourseTableItem(35)
}
function gotoAttendDetail() {
    parent.location.href="http://localhost:7091/courseAttendanceDetail/";
}

function checkCourseOpenHandle(data) {
    var roomId =getQueryString("roomId");
    if (data.command == 'brand_class_open') {
        var classTableId=data.data.classTableId;
        //获取应到人数
        if (roomId == data.data.classroomId) {
            getStudentByCourseTableItem(classTableId);
            if (!timerFlag) {
                this.openTimeInterVal(classTableId);
            }
        }
    } else if (data.command == 'brand_class_close') {
        if (roomId ==data.data.classroomId) {
            clearInterval(timer)
            timerFlag = false;
        }
    } else if (data.command == 'braceletBoxConnect') {
        //重连开课
        if( data.data.classroomId!=null) {
            if (roomId == data.classroomId) {
                this.getStudentByCourseTableItem(data.classTableId);
                if (!timerFlag) {
                    this.openTimeInterVal(data.classTableId);
                }
            }
        }
    }

}
function openTimeInterVal(classTableId){
    //开启定时器获取实到人数
    timer = setInterval(function () {
        getBraceletAttend(classTableId);
    }, 10000)
}
function getBraceletAttend(classTableId){
    var param = {
        "method": 'getBraceletAttend',
        "cid": classTableId
    };
    $.post(url, {
        params: JSON.stringify(param)
    }, function (result, status) {
        if (result.success == true) {
            var response=result.response;
            if(response!=null){
                $("#attendCount").text(response.length);
            }else{
                $("#attendCount").text(0);
            }
        }else{
            $("#attendCount").text(0);
        }
    }, "json");
}
function getStudentByCourseTableItem(classTableId){
    var param = {
        "method": 'getStudentByCourseTableItem',
        "id": classTableId
    };
    $.post(url, {
        params: JSON.stringify(param)
    }, function (result, status) {
        if (result.success == true) {
            var response=result.response;
            if(response!=null){
                $("#totalCount").text(response.length);
            }else{
                $("#totalCount").text(0);
            }
        }else{
            $("#totalCount").text(0);
        }
    }, "json");
}
function sendMessageTo(data) {
    window.parent.postMessage(JSON.stringify(data), '*');
}

//监听接受消息
window.addEventListener('message', (e) => {
    console.log(e);
    var res = JSON.parse(e.data);
    checkCourseOpenHandle(res);
})
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) {
        return unescape(r[2]);
    }
    return null;
}