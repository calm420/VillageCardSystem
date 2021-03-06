function backHome(){
    var data = {
        method: 'backHome',
    };
    console.log(data,"data")
    Bridge.callHandler(data, null, function (error) {
    });
}
$(function () {
    var abcode = null;
    var timer = null;
    var timeOffset = null;
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    var villageId = WebServiceUtil.GetQueryString("villageId");
    var font = WebServiceUtil.GetQueryString("font");
    var vertical = WebServiceUtil.GetQueryString('vertical')
    if (!!font) {
        $('html').css('font-size', font)
    }
    getVillageInfoByVillageId(villageId)
    makeTime();
    if (!!vertical) {
        $('.headTitle').width('70%')
        // $('#weather').css('display', 'none')
    }


    /**
     * 根据IP地址获取adcode
     * 调用查询天气函数
     */
    // try {
    //     $.get('https://restapi.amap.com/v3/ip?key=fce57f3f5ed99a1b7925992439e5a224&ip=' + returnCitySN["cip"], function (res) {
    //         abcode = res.adcode
    //         weatherInfo(res.adcode)
    //     })
    // } catch (e) {
    //     console.log(e);
    // }

    /**
     * 获取网络时间
     */
    function getCurrentTimeMillis(resolve) {
        var param = {
            "method": 'getCurrentTimeMillis',
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    resolve(result.response)
                } else {
                    resolve(new Date().getTime())
                }
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 查询天气
     * @param adcode
     */
    function weatherInfo(adcode) {
        $.get('https://restapi.amap.com/v3/weather/weatherInfo?key=fce57f3f5ed99a1b7925992439e5a224&city=' + adcode + '&extensions=all', function (res) {
            buildWether(res.forecasts[0].casts.splice(0, 2))
        })
    }

    /**
     * 构建天气
     * @param data
     */
    function buildWether(data) {
        var img = document.createElement("img");

        if (data[0].dayweather.indexOf('阴') != -1) {
            img.src = "./asset/images/Overcast_icon.png";
        } else if (data[0].dayweather.indexOf('晴') != -1) {
            img.src = "./asset/images/sunny_icon.png";
        } else if (data[0].dayweather.indexOf('多云') != -1) {
            img.src = "./asset/images/Cloudy_icon.png";
        } else if (data[0].dayweather.indexOf('雷') != -1) {
            img.src = "./asset/images/Thundershower_icon.png";
        } else if (data[0].dayweather.indexOf('雨') != -1) {
            img.src = "./asset/images/rain_icon.png";
        } else if (data[0].dayweather.indexOf('雪') != -1) {
            img.src = "./asset/images/snow_icon.png";
        } else if (data[0].dayweather.indexOf('霾') != -1) {
            img.src = "./asset/images/haze_icon.png";
        }

        // document.querySelector('#weather-img').appendChild(img);
        // document.querySelector('#weather-today .climate').innerHTML = data[0].dayweather
        // document.querySelector('#weather-tomorrow .climate').innerHTML = data[1].dayweather
        // document.querySelector('#weather-today .temperature').innerHTML = data[0].nighttemp + '℃~' + data[0].daytemp + '℃'
        // document.querySelector('#weather-tomorrow .temperature').innerHTML = data[1].nighttemp + '℃~' + data[1].daytemp + '℃'
    }

    /**
     * 制作电子表
     */
    function makeTime() {
        getCurrentTimeMillis(function (time) {
            timer = setInterval(function () {
                document.querySelector('#watch').innerText = set(time)
                //每天刷新天气两次
                if (set(time) == '00:10:00' || set(time) == '12:10:00') {
                    // weatherInfo(abcode)
                }
                //更新日期
                if (set(time) == '00:10:00') {
                    document.querySelector('#week').innerText = setTodayDate(new Date(time))
                }

                time = Number(time);
                time += 1000;
            }, 1000);
            document.querySelector('#week').innerText = setTodayDate(new Date(time))
        })
    }

    /*function makeTime() {
        var date = new Date(),
            time = date.getTime();
        timer = setInterval(function () {
            document.querySelector('#watch').innerText = set(time)
            //每天刷新天气两次
            if (set(time) == '00:10:00' || set(time) == '12:10:00') {
                weatherInfo(abcode)
            }
            //更新日期
            if (set(time) == '00:10:00') {
                var date = new Date();
                document.querySelector('#week').innerText = setTodayDate(date)
            }

            time = Number(time);
            time += 1000;
        }, 1000);
        document.querySelector('#week').innerText = setTodayDate(date)
    }*/

    /**
     * 设置北京时间的方法，针对时分秒的显示
     * @param time
     * @returns {string}
     */
    function set(time) {
        timeOffset = ((-1 * (new Date()).getTimezoneOffset()) - (8 * 60)) * 60000;
        now = new Date(time - timeOffset);
        return p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds())
    }

    /**
     * 格式化时间的显示方式
     * @param s
     * @returns {string}
     */
    function p(s) {
        return s < 10 ? '0' + s : s;
    }

    /*
     设置日期的方法，针对年月日星期的显示
    */
    function setTodayDate(today) {
        var months, dates, weeks, intMonths, intDates, intWeeks, today, timeString;

        intMonths = today.getMonth() + 1;//获得月份+1
        intDates = today.getDate();//获得天数
        intWeeks = today.getDay();//获得星期

        if (intMonths < 10) {
            months = '0' + intMonths + '月';
        } else {
            months = intMonths + '月';
        }

        if (intDates < 10) {
            dates = '0' + intDates + '日 ';
        } else {
            dates = intDates + '日 ';
        }

        var weekArray = new Array(7);
        weekArray[0] = '星期日';
        weekArray[1] = '星期一';
        weekArray[2] = '星期二';
        weekArray[3] = '星期三';
        weekArray[4] = '星期四';
        weekArray[5] = '星期五';
        weekArray[6] = '星期六';
        weeks = weekArray[intWeeks] + ' ';

        timeString = months + dates + weeks;

        return timeString;
    }

    /**
     * 获取班级名称
     * @param id
     */
    function getVillageInfoByVillageId(villageId) {
        var param = {
            "method": 'getVillageInfoByVillageId',
            "villageId": villageId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        document.querySelector('#class-name').innerHTML = result.response.villageName
                    }
                }
            },
            onError: function (error) {
            }
        });
    }

    //监听接受消息
    window.addEventListener('message', function (e) {
        var commandInfo = JSON.parse(e.data);
        if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                var skin = commandInfo.data.skinName;
                // document.getElementsByName("headerDiv")[0].id = skin;
            }
        }
    })

  

})
