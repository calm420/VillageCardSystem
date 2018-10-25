/**
 * 本节考勤
 */
var url = "https://www.maaee.com/Excoord_For_Education/webservice";
var totalCount=0;
var totalStudent=new Array();
$(document).ready(function(){
    init();
});
function init(){
    var locationHref = decodeURI(window.location.href);
    var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
    var searchArray = locationSearch.split("&");
    var classTableId = searchArray[0].split('=')[1];

   // var defaultId = searchArray[1].split('=')[1];
    getStudentByCourseTableItem(classTableId);
    openTimeInterVal(classTableId);
}
function openTimeInterVal(classTableId){
    //开启定时器获取实到人数
    timer = setInterval(function () {
       getBraceletAttend(classTableId);
    }, 10000)
}
function goHomePage(classTableId){
        //parent.location.href="http://localhost:7091/courseAttendanceDetail/?classTableId="+classTableId;
        var data = {
            method: 'openNewPage',
            url: "courseAttendanceDetail?classTableId=" + classTableId,
        };

        window.parent.postMessage(JSON.stringify(data), '*');
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
function getBraceletAttendHandle(response){
    console.log(response);
    // $("#imageTip"+4004).show();
    // $("#signTip"+4004).remove();
    $("#attendCount").text(response.length);
    $("#noAttendCount").text(totalCount-response.length);
    if(response==null||response.length==0){
        return
    }
    for (var i = 0; i < response.length; i++) {
        var user=response[i];
       for(var j=0;j<totalStudent.length;j++){
           if(user.colUid==totalStudent[j].colUid){
                $("#imageTip"+user.colUid).show();
                $("#signTip"+user.colUid).remove();
           }
       }
    }
}
function getStudentByCourseTableItem(classTableId){
    var param = {
        "method": 'getStudentByCourseTableItem',
        "id": classTableId
    };
    $.post(url, {
        params: JSON.stringify(param)
    }, function (result, status) {
        if (status == "success") {
            var response=result.response;
            getStudentByCourseTableItemHandle(response,classTableId);
        }
    }, "json");
}
function getStudentByCourseTableItemHandle(response,classTableId){
    if(response==null||response.length==0){
        return
    }
    for (var i = 0; i < response.length; i++) {
        var user=response[i];
        var template = $("#student_template");
        template.find("#student_name").text(user.userName);
        template.find("#student_avatar").attr("src", user.avatar);
        template.find(".signIcon_green").attr("id", "imageTip"+user.colUid);
        template.find(".signIcon").attr("id", "signTip"+user.colUid);
        $("#student_list_container").append(template.html());
        totalStudent.push(user.colUid);
    }
    console.log(totalStudent);
    totalCount=response.length;
    $("#totalCount").text(response.length);
    getBraceletAttend(classTableId);
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