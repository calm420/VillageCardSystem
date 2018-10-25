/**
 * 本节考勤
 */
var timerFlag = false;
$(document).ready(function(){
    init();

});
function init(){

}
function gotoAttendDetail() {
    window.location.href="http://localhost:7091/courseAttendanceDetail/";
}

function checkCourseOpenHandle(data) {
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
    } else if (data.command == 'braceletBoxConnect' && WebServiceUtil.isEmpty(data.classTableId) == false) {
        //重连开课
        if (roomId ==data.classroomId) {
            this.getStudentByCourseTableItem(data);
            if (!timerFlag) {
                this.openTimeInterVal(data);
            }
        }
    }

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
