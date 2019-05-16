$(function () {
    var clazzId = WebServiceUtil.GetQueryString("clazzId");
    var skin = WebServiceUtil.GetQueryString("skin");
    var events=[];
    // document.getElementsByName("historyScore")[0].id=skin;
    var font = WebServiceUtil.GetQueryString('font');
    $('html').css('font-size', font);
    var simpleMs = new SimpleConnection();
    simpleMs.connect();
    simpleListener();
    InitializePage();

    //初始化页面元素
    function InitializePage() {

        $('#calendar').fullCalendar({
            defaultView: 'month',
            height: 'auto',
            header: {
                left: '',
                center: '',
                right: 'prev,title,next today'
            },
            displayEventTime:true,
            displayEventEnd:true,
            weekMode:"liquid",
            aspectRatio:2,
            allDaySlot:false,
            timeFormat: 'HH:mm',
            locale:'zh-cn',
            eventOrder:'index',
            viewRender:function (view) {//动态把数据查出，按照月份动态查询
                console.log(view.start._i,view.end._i);
                getHistoryMoralEducationInfo(view.start._i,view.end._i);
            },
            /*dayClick: function() {
                alert('a day has been clicked!');
            }*/
            /*events:function(start, end, callback){
                //prev上一月, next下一月等事件时调用
                console.log(start,end);
            }*/
        });
        $('#calendar').fullCalendar( 'removeEvents');
    }
    function getHistoryMoralEducationInfo(startTime,endTime) {
        var param = {
            "method": 'getHistoryMoralEducationInfo',
            "clazzId": clazzId,
            "startTime": startTime,
            "endTime": endTime,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if(result.success==true && result.msg=="调用成功"){
                    $('#calendar').fullCalendar( 'removeEvents');
                    var response = result.response;
                    if(response != null && typeof(response)!=undefined){
                        for(var i=0;i<response.length;i++){
                            var scoreData = response[i];
                            drawCalendar(scoreData);
                        }
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
                $('body').html("查询出错:" + JSON.stringify(responseStr))
            }
        });
    }

    function simpleListener() {
        simpleMs.msgWsListener = {
            onError: function (errorMsg) {
                // Toast.fail(errorMsg)
                console.log("errorMsg",errorMsg);
            }, onWarn: function (warnMsg) {
                console.log("warnMsg",warnMsg);
            }, onMessage: function (info) {
                console.log("info",info);
                if(info.command=="refreshClassCardPage"){
                    goHome();
                }
            }
        }
    }

    /**
     * 绘制日期中的数据
     * @param scoreData
     * @param date
     */
    function drawCalendar(scoreData) {
        var isallDay=true;
        events.splice(0);
        var date = WebServiceUtil.formatYMD(scoreData.createTime);
        //总分
        var totalScoreItem={
            title : "总分： "+scoreData.totalScore,
            index:1,
            start : date,
            className : "event-bar allScore",
            allDay :  isallDay,
            end : date,
            backgroundColor : "rgba(0,0,0,0)",
        };
        events.push(totalScoreItem);

        //全校排名
        var schoolOrderItem={
            title : "全校排名： "+scoreData.schoolRank,
            index:2,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "rgba(0,0,0,0)",
        };
        events.push(schoolOrderItem);

        //年级排名
        var gradeOrderItem={
            title : "年级排名： "+scoreData.clazzRank,
            index:3,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor :"rgba(0,0,0,0)",
        };
        events.push(gradeOrderItem);

        //礼貌
        var etiquetteItem={
            title : "礼貌： "+scoreData.politeness,
            index:4,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "rgba(0,0,0,0)",
        };
        events.push(etiquetteItem);

        //卫生
        var healthyItem={
            title : "卫生： "+scoreData.health,
            index:5,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "rgba(0,0,0,0)",
        };
        events.push(healthyItem);

        $('#calendar').fullCalendar( 'addEventSource', events );
    }

    $('#historyGoBack').on('click',function(){
        goHome();
    })


    function goHome() {
        console.log('返回首页');
        var data = {
            method: 'finish',
        };
        Bridge.callHandler(data, null, function (error) {
            window.history.back(-1);
        });
    }

})