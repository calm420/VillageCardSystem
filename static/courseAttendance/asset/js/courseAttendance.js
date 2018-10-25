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
    getStudentByCourseTableItem(35)
}
function gotoAttendDetail() {
    window.location.href="http://localhost:7091/courseAttendanceDetail/";
}

function checkCourseOpenHandle(data) {
    debugger
    var roomId = localStorage.getItem('roomId');
    if (data.command == 'brand_class_open') {
        //获取应到人数
        if (roomId == data.classroomId) {
            this.getStudentByCourseTableItem(data);
            if (!timerFlag) {
                this.openTimeInterVal(ata);
            }
        }
    } else if (data.command == 'brand_class_close') {
        if (roomId ==data.classroomId) {
            this.setState({openClass: false});
            clearInterval(timer)
            timerFlag = false;
        }
    } else if (data.command == 'braceletBoxConnect') {
        //重连开课
        if( data.classroomId!=null) {
            if (roomId == data.classroomId) {
                this.getStudentByCourseTableItem(data);
                if (!timerFlag) {
                    this.openTimeInterVal(data);
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
        if (status == "success") {
            var response=result.response;
            getBraceletAttendHandle(response);
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
            debugger
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
