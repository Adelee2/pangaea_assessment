
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');

const redis = require('redis');

const publisher = redis.createClient();

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/publish/:topic',(req,res) => {
    let topic = req.params.topic;
    let data = req.body;
    if ((data === undefined && typeof data == "object") || topic == undefined || topic.length == 0) { // send a bad request response
        return res.status(400).send({topic, data})
    }

    let publish = publisher.publish(topic,JSON.stringify(data))
    if (publish) {
        return res.status(200).send({topic, data})
    }

    return res.status(404).send({topic,data})
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;