var url = require('url');
var cookieParser = require('cookie-parser')
var express = require('express');
var session = require('express-session')
var minimist = require('minimist');
var http = require('http');
var https = require('https');
var fs = require("fs");
var path = require('path');
//只有本地调试时需要设置为true,线上启动方式为https,发版前记得修改为false,
var isDebug = true;

var argv = minimist(process.argv.slice(2), {
    default: {
        as_uri: isDebug ? "http://192.168.50.119:7091" : 'https://jiaoxue.maaee.com:9092'
    }
});

var options =
    {
        key: fs.readFileSync('keys/server.key'),
        cert: fs.readFileSync('keys/server.crt')
    };

var app = express();
app.use(cookieParser());
var sessionHandler = session({
    secret: 'none',
    rolling: true,
    resave: true,
    saveUninitialized: true
});
app.use(sessionHandler);

var asUrl = url.parse(argv.as_uri);
var port = asUrl.port;
if (isDebug) {
    http.createServer(app).listen(port, function () {
        console.log('Open ' + url.format(asUrl));
    });
} else {
    https.createServer(options, app).listen(port, function () {
        console.log('Open ' + url.format(asUrl));
    });
}

app.use(express.static(path.join(__dirname, 'static')));

