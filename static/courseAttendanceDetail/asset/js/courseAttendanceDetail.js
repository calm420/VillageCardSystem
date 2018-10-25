/**
 * 本节考勤
 */
var url = "https://www.maaee.com/Excoord_For_Education/webservice";
var totalCount=0;
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
    $("#attendCount").text(response.length);
    $("#noAttendCount").text(totalCount-response.length);
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
        $("#student_list_container").append(template.html());
    }
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