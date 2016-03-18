var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/router');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/am');
var hbs = require('hbs');
var util = require('./public/js/util/util');
var API = require('./public/js/util/api');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


hbs.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper('ifCond', function(v1, options) {
    if(v1 == 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

routes(app);

//set layout
app.use(function(req, res, next){
    app.set('view options', { layout: 'layout' });
})

//socket communicate between  client-side and server-side
io.on('connection', function(socket){

    //get db table
    var collection = db.get('user');


    //socket get username from client-side and return user info to client-side
    socket.on('sendUserName',function(names) {

        //search name from database
        collection.find({ name: names }).on('error',function(err) {
            socket.emit('getUserInfo',null);
            console.log(err);
        }).on('success', function (doc) {

            var user_list = [];

            //check if user exist
            if(doc[0] == undefined) {
                socket.emit('getUserInfo',null);
            }
            else {
                for(var i = 0;i < doc.length;i++) {
                    var user = {};
                    user.id =  doc[i]._id;
                    user.commited = doc[i].commited;
                    user.name = doc[i].name;
                    user.mobile = doc[i].mobile;
                    user.department = doc[i].department;
                    user.um = doc[i].um;
                    user.hope = doc[i].hope;
                    user.healthId = doc[i].healthId;
                    user_list.push(user);
                }
                //send user info to client side
                socket.emit('getUserInfo',user_list);
            }
        })

    });

    //check duplicated health id and return result
    socket.on('sendHealthId',function(id) {
        collection.find({ healthId: id.healthId }).on('error',function(err) {
            socket.emit('getHealthId',true);
            console.log(err);
        }).on('success', function (doc) {

            //return healthId is occupied or not
            if(util.isOwnEmpty(doc)) {
                socket.emit('getHealthId',false);
            }
            else {
                //commited before but no duplicated
                if(doc.length == 1 && id.userName == doc[0].name ) {
                    socket.emit('getHealthId',false);
                }
                else {  //duplicated healthId
                    socket.emit('getHealthId',true);
                }
            }
        })
    })


    //从数据库随机取得50位未中奖的用户并传给客户端
    socket.on('sendRefreshData',function(num) {

        //进入奖池并且未中奖的才能进有机会抽奖
        collection.find({prize_level:0},{},function(e,docs){

            //for test
//        collection.find({},{},function(e,docs){

            //剩余奖池人数不足
            if(docs.length < 50) {
//                console.log(docs);
                socket.emit('getRefreshData',null);
            }
            else {

                //从奖池中取得50位随机的用户并返回给客户端
                var user_lists = util.randomSelect(docs);
//                console.log(user_lists);

                //test case for random
                for(var i = 0;i < user_lists.length;i++) {
                    for(var j = 0;j < user_lists[i].user_list.length;j++) {
                        var counts = user_lists[i].user_list[j].counts?user_lists[i].user_list[j].counts:0;
                        collection.findAndModify(
                            { _id: user_lists[i].user_list[j]._id },  //search query
                            { $set: {   //update
                                counts:counts+1
                            }},
                            function(err,user_lists) { //catch error
                                if (err) throw err;
                                console.log( user_lists );
                            }
                        )
                    }
                }

//                console.log(user_lists)
//                console.log(JSON.stringify(user_lists, null, 4))
                socket.emit('getRefreshData',user_lists);
            }

        });
    })

    //更新中奖玩家信息并记录， 不能参与下次抽奖
    socket.on('updateWinner',function(win_list) {
//        console.log(win_list);




        switch(win_list.level) {
            case 3: //三等奖
                for(var i = 0;i < 10;i++) {
                    collection.findAndModify(
                        { _id: win_list.win_list[i]._id },  //search query
                        { $set: {   //update
                            prize_level: 3
                        }},
                        function(err,doc) { //catch error
                            if (err) throw err;
                            console.log( doc );
                        }
                    )
                }
                break;
            case 2: //二等奖
                for(var i = 0;i < 10;i++) {
                    collection.findAndModify(
                        { _id: win_list.win_list[i]._id },  //search query
                        { $set: {   //update
                            prize_level: 2
                        }},
                        function(err,doc) { //catch error
                            if (err) throw err;
                            console.log( doc );
                        }
                    )
                }
                break;
            case 1: //一等奖
                for(var i = 0;i < 10;i++) {
                    collection.findAndModify(
                        { _id: win_list.win_list[i]._id },  //search query
                        { $set: {   //update
                            prize_level: 1
                        }},
                        function(err,doc) { //catch error
                            if (err) throw err;
                            console.log( doc );
                        }
                    )
                }
                break;
            case 5: //特等奖
                for(var i = 0;i < 10;i++) {
                    collection.findAndModify(
                        { _id: win_list.win_list[i]._id },  //search query
                        { $set: {   //update
                            prize_level: 5
                        }},
                        function(err,doc) { //catch error
                            if (err) throw err;
                            console.log( doc );
                        }
                    )
                }
                break;
            case 8: //所有的其他奖
                collection.findAndModify(
                    { _id: win_list.win_list[0]._id },  //search query
                    { $set: {   //update
                        prize_level: 8
                    }},
                    function(err,doc) { //catch error
                        if (err) throw err;
                        console.log( doc );
                    }
                )
                break;
        }
    })

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//服务器开启在3001端口
http.listen(3001, function(){
    console.log('listening on *:3001');
});


module.exports = app;
