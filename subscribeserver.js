let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');

const redis = require('redis');

const subscriber = redis.createClient();

let app1 = express();

app1.use(logger('dev'));
app1.use(bodyParser.json());
app1.use(express.urlencoded({ extended: false }));
app1.use(cookieParser());

app1.post('/subscribe/:topic',(req,res) => {
    // console.log("params",req.params)
    let url = req.body.url;

    // strip off the '/' from the request path
    let topic = req.params.topic;
    //    validate the body payload
    console.log(topic)

    if (url === undefined && topic == undefined) {
        // send a bad request response

        return res.status(400).send({url, topic})

    } 
    // console.log("code got here")
    subscriber.on("message",(channel,message) => {
        console.log("Received data :"+message);
    })
    
    let token = subscriber.subscribe(topic);
    if (token) {

        return res.status(200).send({url, topic})

    }

    return res.status(404).send({url, topic})
})

// catch 404 and forward to error handler
app1.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
//   app1.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app1.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
//   });

module.exports = app1;