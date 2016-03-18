/**
 * Created by rock on 15/12/22.
 * mobile: 15821789261
 * qq: 646019533
 */

$(function() {

    //initiate
    var socket = io();
    var playState = '-webkit-animation-play-state';
    var play_flag = false;  //animation playing
    var recover_flag = false;   //recover playing
    var user_list;  //record random user
    var win_list;   //record winner
    var current_level;  //record prize level
    var bgm_music = document.getElementById('bgm_music');
    var bgm_virtual = document.getElementById('bgm_virtual');
    var bgm_reality = document.getElementById('bgm_reality');
    var music_flag = true;
    var volume = 0.5;
    var delay = 40;

    //refresh the screen and get user
    refresh();

    //play bgm music
    bgm_music.play();

    //read each scroller in delay time
//    function timeout(delay,cg) {
//        setTimeout(function() {
//            for(var i = cg*10-10;i < cg*10;i++) {
//                (function(i) {
//
//                    //ajax get user avatar exist or not
//                    $.ajax({
//                        url: document.getElementsByClassName('card-avatar')[i].getAttribute('data-src'),
//                        type: "get",
//                        cache: false,
//                        contentType: "image/jpeg",
//                        timeout: delay,
//                        complete: function() {
//                            //called when complete
//                        },
//                        success: function(data) {
//                            //called when success
//                            document.getElementsByClassName('card-avatar')[i].setAttribute('src', document.getElementsByClassName('card-avatar')[i].getAttribute('data-src'))
//                            document.getElementsByClassName('card-avatar')[i+10].setAttribute('src', document.getElementsByClassName('card-avatar')[i].getAttribute('data-src'))
//                        },
//
//                        error: function() {
//                            //called when failed
//                            document.getElementsByClassName('card-avatar')[i].setAttribute('src', './img/default.png')
//                            document.getElementsByClassName('card-avatar')[i+10].setAttribute('src', './img/default.png')
//                        }
//                    });
//                })(i)
//            }
//        },delay)
//    }

    //read each card in delay time
    function timeout2(delay,i) {
        setTimeout(function() {
            $.ajax({
                url: document.getElementsByClassName('card-avatar')[i].getAttribute('data-src'),
                type: "get",
                cache: false,
                contentType: "image/jpeg",
                timeout: delay,
                complete: function() {
                    //called when complete
                },
                success: function(data) {
                    //called when success
                    document.getElementsByClassName('card-avatar')[i].setAttribute('src', document.getElementsByClassName('card-avatar')[i].getAttribute('data-src'))
                    document.getElementsByClassName('card-avatar')[i+10].setAttribute('src', document.getElementsByClassName('card-avatar')[i].getAttribute('data-src'))
                },

                error: function() {
                    //called when failed
                    document.getElementsByClassName('card-avatar')[i].setAttribute('src', './img/default.png')
                    document.getElementsByClassName('card-avatar')[i+10].setAttribute('src', './img/default.png')
                }
            });
        },delay);
    }

    //render img on card back
    function timeout1(delay,i,url) {
        setTimeout(function() {
            $.ajax({
                url: url,
                type: "get",
                cache: false,
                contentType: "image/jpeg",
                timeout: delay,
                complete: function() {
                    //called when complete
                },
                success: function(data) {
                    //called when success
                    $('.card-back').eq(i).find('.card-avatar').attr('src',url);
                },

                error: function() {
                    //called when failed
                }
            });
        },delay);
    }

    //render user avatar
    function renderImg() {
        var tmp_delay = delay;
        var tmp_index = 0;

        //ajax异步读取用户图片（有时间改promise）
        for(var cg = 1;cg <= 10;cg+=2) {
//            timeout(tmp_index++ * tmp_delay+50,cg);
            for(var i = cg*10-10;i < cg*10;i++) {
                timeout2(tmp_index++ * tmp_delay+delay,i);
            }

        }
    }

    //render img on card
    function renderCardImg(win_list) {

        if(win_list.length == 10) { //render 10  winner avatar
            //ajax异步读取用户图片（有时间改promise）
            for(var i = 0; i < 10;i++) {
                var url = $('.card-back').eq(i).find('.card-avatar').attr('data-src');
//                $('.card-back').eq(i).find('.card-avatar').attr('src',url);
                timeout1(50*i,i,url);
            }
        }
        else if(win_list.length == 1) {  //render single  winner avatar

            var url = $('.card-back-single').find('.card-avatar-single').attr('data-src');
//            $('.card-back-single').find('.card-avatar-single').attr('src',url);
            $.ajax({
                url: url,
                type: "get",
                cache: false,
                contentType: "image/jpeg",
                timeout: 100,
                complete: function() {
                    //called when complete
                },
                success: function(data) {
                    //called when success
                    $('.card-back-single').find('.card-avatar-single').attr('src',url);
                    console.log('success')
                },

                error: function() {
                    //called when failed
                    console.log('fail')
                }
            });
        }
    }

    //card animation for 10 player
    function cb_10(index) {
        //flip the card
        if(index == 11) {
            setTimeout(function() {
                if(play_flag) {
                    $('.card-item').eq(0).find('.card').addClass('flipped');
                    $('.card-item').eq(1).find('.card').addClass('flipped');
                    $('.card-item').eq(2).find('.card').addClass('flipped');
                    $('.card-item').eq(3).find('.card').addClass('flipped');
                    $('.card-item').eq(4).find('.card').addClass('flipped');
                }

            },1000);
            setTimeout(function() {
                if(play_flag) {
                    $('.card-item').eq(5).find('.card').addClass('flipped');
                    $('.card-item').eq(6).find('.card').addClass('flipped');
                    $('.card-item').eq(7).find('.card').addClass('flipped');
                    $('.card-item').eq(8).find('.card').addClass('flipped');
                    $('.card-item').eq(9).find('.card').addClass('flipped');
                }
                play_flag = false;
            },2500);
            return ;
        }
        else {  //deal the card
            $('.card-item').eq(index).addClass('card_animation'+(index+1));
            setTimeout(function() {
                if(play_flag) {
                    cb_10(index+1);
                }
            },300)
        }
    }

    //card animation for single player
    function cb_single() {
        $('#card-single').addClass('card_animation-single');    //deal the card
        setTimeout(function() {//flip card
            if(play_flag) {
                $('#card-single').find('.card').addClass('filpped-single');
                setTimeout(function() {
                    $('.shadow').removeClass('dispear')
                    $('.shadow').animate({opacity:0.5},1000,function() {
                        $('.shadow').addClass('shadow_animation');
                    })
                },2000)
            }
            play_flag = false;
        },1000)
    }

    //recover
    function recover() {

        $('.scroll-list').removeClass('scroll-acclerate');
        scoller_run();
        recover_flag = true;
        play_flag = false;
        $('.card').removeClass('flipped filpped-single');
        $('.card-item').animate({top:"100%",opacity:0})

        pause_music(bgm_virtual);
        volume = 0.5;
        play_music(bgm_music);

        setTimeout(function(){
            $('.card-item').attr('class','card-item')
            $('.card-item').css({opacity:1})
            $('.card-wrap').removeClass('bg_cover');
            $('.card-wrap').addClass('dispear');
            $('.shadow').addClass('dispear')
            $('.card-back').find('.card-avatar').attr('src','./img/default.png')
            $('.card-back-single').find('.card-avatar-single').attr('src','./img/default.png');
            recover_flag = false;
            play_flag = false;
//            $('.card-back').find('.card-avatar').attr('src','./img/default.png');
//            $('.card-back-single').find('.card-avatar').attr('src','./img/default.png');
        },3000)

        refresh();
    }


    //refresh card info (default 50)
    function refresh() {
        requestData(50);
    }

    //get random 50 user data to show and choose from db
    socket.on('getRefreshData',function(data) {
        renderScoller(data);
    })

    //request data from db
    function requestData(n) {
        socket.emit('sendRefreshData',n);
    }

    //hide mobile number
    String.prototype.addStar=function(character) {
        return this.substr(0, 3) + character+character+character+character + this.substr(6+character.length);
    }

    /*render scoller user info*/
    function renderScoller(data) {
        if(!data) {
            alert('奖池没有数据');
        }
        else {
            user_list = data;
            console.log(user_list);
            for(var i = 0;i < data.length;i++) {
                for(var j = i*20 ;j < i*20+10;j++) {
                    $('.card-name').eq(j).text(data[i].user_list[j-i*20].name);
                    $('.card-name').eq(j+10).text(data[i].user_list[j-i*20].name);

                    $('.card-mobile').eq(j).text(data[i].user_list[j-i*20].mobile.addStar('*'));
                    $('.card-mobile').eq(j+10).text(data[i].user_list[j-i*20].mobile.addStar('*'));

                    $('.card-hope').eq(j).text(data[i].user_list[j-i*20].hope);
                    $('.card-hope').eq(j+10).text(data[i].user_list[j-i*20].hope);
                    //var url = './img/uploads/avatar/'+data[i].user_list[j-i*20]._id+'.jpg';
                    var url = './img/default.jpg';
                    $('.card-avatar').eq(j).attr('data-src',url);
                    $('.card-avatar').eq(j+10).attr('data-src',url);
                }
            }
            renderImg();
        }
    }

    //run scoller
    function scoller_run() {
        $('.scroll-list').css(playState,'running');
    }

    //pause scoller
    function scoller_pause() {
        $('.scroll-list').css(playState,'paused');
    }

    //lower music volume and pause
    function pause_music(dom) {
        var vol = 0.3;
        var interval = 200; // 200ms interval
        music_flag = !music_flag;
        var fadeout = setInterval(
            function() {

                // Reduce volume by 0.05 as long as it is above 0
                // This works as long as you start with a multiple of 0.05!
                if (vol >= 0.05) {
                    vol -= 0.05;
                    dom.volume = vol;
                }
                else {
                    dom.volume = 0;
                    // Stop the setInterval when 0 is reached
                    clearInterval(fadeout);
                    if(dom == document.getElementById('bgm_virtual')) {
                        dom.pause();
                        dom.currentTime = 0;
                    }

                }
            }, interval);

    }

    //play music
    function play_music(dom) {
        var vol = 0;
        var interval = 200; // 200ms interval
        dom.volume = vol;
        dom.play();
        var fadein = setInterval(
            function() {
                // Reduce volume by 0.05 as long as it is above 0
                // This works as long as you start with a multiple of 0.05!
                if (vol <= volume) {
                    vol += 0.05;
                    dom.volume = vol;
                }
                else {
                    vol = volume;
                    // Stop the setInterval when 0 is reached
                    clearInterval(fadein);
                }
            }, interval);
    }

    //根据num参数从user_list中随机出1或10位中奖员工
    function randomJustice(user_list,num) {
        var arr = [],
            current_winner = 0,
            winner_list = [];
        if(num == 10) { //pick 10 winner

            while(current_winner < 10) {
                var ran = Math.floor(Math.random()*50);
                //随机数之前没有重复
                if(arr.indexOf(ran) == -1) {
                    current_winner++;
                    arr.push(ran)
                }
            }
            for(var i = 0;i < 10;i++) {
                winner_list.push(user_list[Math.floor(arr[i]/10)].user_list[arr[i]%10])
            }
            console.log(arr);
        }
        else if(num == 1) { //pick 1 winner
            var ran =  Math.floor(Math.random()*50);
            winner_list.push(user_list[Math.floor(ran/10)].user_list[ran%10])
            console.log(ran);
        }
        return winner_list;
    }

    //开始摇奖
    function startRoll() {
        if(!play_flag && !recover_flag) {
            play_flag = true;
            recover_flag = true;

            //换抽奖音乐
            pause_music(bgm_music);
            volume = 0.5;
            play_music(bgm_virtual);

            //停止加速
            $('.card-wrap').removeClass('dispear');
            $('.scroll-list').addClass('scroll-acclerate');

            //盖上黑色浮层cover
            setTimeout(function() {
                $('.card-wrap').addClass('bg_cover');
            },1000);
        }
    }

    //start animation and get 10 winner
    function rollTen() {
        if(play_flag) {
            //音效

            //停掉加速
            $('.scroll-list').removeClass('scroll-acclerate');
            $('#card-single').addClass('dispear');

            //get random 10 winner
            win_list = randomJustice(user_list,10);

            //render card info
            for(var i = 0;i < 10;i++) {
                $('.card-back').eq(i).find('.card-name').text(win_list[i].name)
                $('.card-back').eq(i).find('.card-mobile').text(win_list[i].mobile.addStar('*'))
                $('.card-back').eq(i).find('.card-hope').text(win_list[i].hope)
                var url = './img/default.jpg';
                $('.card-back').eq(i).find('.card-avatar').attr('data-src',url);
            }

            //render card img
            renderCardImg(win_list);

            //run the scroller
            scoller_run();

            //card animate start
            $('.card-item').animate({top:"80%"},500,function() {
                setTimeout(function() {
                    cb_10(0);
                },1000)
            })
        }
    }



    //start animation and get one winner
    function rollOne() {
        if(play_flag) {

            $('.scroll-list').removeClass('scroll-acclerate');
            //get random 1 winner
            win_list = randomJustice(user_list,1);

            //render card info
            $('.card-name-single').text(win_list[0].name)
            $('.card-mobile-single').text(win_list[0].mobile.addStar('*'))
            $('.card-hope-single').text(win_list[0].hope)
            var url = './img/default.jpg';
            $('.card-avatar-single').attr('data-src',url);

            //render card img
            renderCardImg(win_list);

            //run the scroller
            scoller_run();

            //card animate start
            $('#card-single').animate({top:"80%"},2000,function() {
                cb_single();
            })
        }
    }

    //发送短信
    function sendSms(mobile,key,userId) {
        //请求api
        API.request({
            _mt: 'promotion.sendSms',
            mobile: mobile.toString(),
            key: key,
            userId: userId
        }, function(data) {
            console.log(data);
        }, 'None', true);
    }

    //detect key down
    document.onkeydown = function (e) {
        e = e || event;
        switch (e.keyCode) {
            //开始摇奖 p
            case 80:
                startRoll();
                break;
            // 停止并出现三等奖10位   3
            case 51:
                rollTen();
                fworks.fire();
                //record winner info and prize level
                current_level = 3;
                break;
            // 停止并出现二等奖10位   2
            case 50:
                rollTen();
                fworks.fire();
                //record winner info and prize level
                current_level = 2;
                break;
            // 停止并出现一等奖10位   1
            case 49:
                rollTen();
                fworks.fire();
                //record winner info and prize level
                current_level = 1;
                break;
            // 停止并出现特等奖10位   5
            case 53:
                rollTen();
                fworks.fire();
                //record winner info and prize level
                current_level = 5;
                break;
            // 停止并出现其他奖 1位   s
            case 83:
                rollOne();
                fworks.fire();

                //record winner info and prize level
                current_level = 8;
                break;
            // 抽奖结束（正常）  space
            case 32:
                //判断中奖
                if(win_list) {
                    //record winner info and prize level
                    var win_info = {
                        level: current_level,
                        win_list: win_list
                    }
                    //一二三等奖发短息通知
                    for(var i = 0;i < win_list.length;i++) {
                        var prize_level;
                        if(current_level == 3) {
                            prize_level = 'PRIZE_THREE';
                        }
                        else if(current_level == 2) {
                            prize_level = 'PRIZE_TWO';
                        }
                        else if(current_level == 1) {
                            prize_level = 'PRIZE_ONE';
                        }
                        //发短信
//                        sendSms(win_list[i].mobile,prize_level,win_list[i].healthId);
                    }


                    //中奖人名单传回服务端并做更新数据库操作
                    socket.emit('updateWinner',win_info);
                    win_list = null;
                }

                recover();
                break;
            //打断抽奖（紧急情况） esc
            case 27:
                recover();
                break;
            //加强音量
            case 38:
                if(volume <= 0.95) {
                    volume += 0.05;
                    if(music_flag) {
                        bgm_music.volume = volume;
                    }
                    else {
                        bgm_virtual.volume = volume;
                    }
                }
                break;
            //降低音量
            case 40:
                if(volume>= 0.05) {
                    volume -= 0.05;
                    if(music_flag) {
                        bgm_music.volume = volume;
                    }
                    else {
                        bgm_virtual.volume = volume;
                    }
                }
                break;
        }
    }
})
