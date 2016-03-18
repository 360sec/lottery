/**
 * Created by rock on 15/12/22.
 * mobile: 15821789261
 * qq: 646019533
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var util = require('../public/js/util/util');

//initiate upload file name and dest
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/uploads/avatar/')
    },
    filename: function (req, file, cb) {
        var name = req.body.userId+'.jpg'
        cb(null, name)
    }
})

//for photo
//var upload1 = multer({}).single('file');

//数据库更新
var upload = multer({storage:storage}).single('userPhoto');


//router
module.exports = function(app) {

//    router for home
//    app.get('/', function(req, res, next) {
//        var db = req.db;
//        var collection = db.get('user');
//        collection.find({},{},function(e,docs){
//            res.render('index', {
//                "userList" : docs
//            });
//        });
//    });

    //router for form
//	app.get('/', function(req, res, next) {
//	        res.render('form', {
//	        	title: '年会召集令'
//	        });
//	});

    //handle game
    app.get('/game',function(req, res, next) {
        var db = req.db;
        var collection = db.get('user');

        //进入奖池并且未中奖的才能进有机会抽奖
        collection.find({prize_level:0},{},function(e,docs){

            //for test
//        collection.find({},{},function(e,docs){
            var user_lists = util.randomSelect(docs);

            //page render
            res.render('game', {
                title: 'game',
                id:'game',
                user_lists: user_lists
            });
        });
    })


    //photo upload
//	app.post('/upload', function(req, res, next) {
////        console.log(req.query);
//        //handle photo upload by multer
//		upload1(req, res, function (err) {
//            var db = req.db;
//            var collection = db.get('user');
//
//            //update photoUrl
//            collection.findAndModify(
//                { _id: req.query.userId },  //search query
//                { $set: {   //update
//                   photoUrl: './img/uploads/avatar/'+req.query.userId+'.jpg'
//                }},
//                function(err,docs) { //catch error
//                    if (err) throw err;
//                    console.log( docs );
//                }
//            )
//
//			res.end("File is uploaded");
//		})
//	});

    //database upload
    app.post('/uploadPhoto', function(req,res,next) {

        //handle user info upload by multer
        upload(req, res, function (err) {
            // database connection
            var db = req.db;
            var collection = db.get('user');
            //user not committed before
            if(!req.body.userCommited) {


                //assign user an index to perform random select
                collection.find({commited:true}).on('error',function(error) {
                    console.log( error );
                    throw error;
                }).on('success', function (doc) {

                    //database add
                    collection.findAndModify(
                        { _id: req.body.userId },  //search query by user id
                        { $set: {   //record the user info and update in db
                            mobile :  req.body.userMobile,
                            healthId : req.body.userHealthId,
                            hope: req.body.userHope,
                            currentIndex:  doc.length,
                            commited: true,
                            prize_level: 0,
                            photoUrl: './img/uploads/avatar/'+req.body.userId+'.jpg'
                        }},
                        function(err,docs) { //catch error
                            if (err) throw err;
                            console.log( docs );
                        }
                    )
                })

            }
            else {  //user committed before
                //database only update mobile&hope
                collection.findAndModify(
                    { _id: req.body.userId },  //search query
                    { $set: {   //update
                        mobile :  req.body.userMobile,
                        hope: req.body.userHope
                    }},
                    function(err,doc) { //catch error
                        if (err) throw err;
                        console.log( doc );
                    }
                )
            }

            //handle error
            if (err) {
                return res.end("Error uploading file.");
            }

            //success meeage
            res.end("File is uploaded");

        })
    })
}

