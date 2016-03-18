    //除chrome外，其他支持需要在服务器上运行才支持
    if(!window.localStorage){
        alert('This browser does NOT support localStorage');
    }

    /*
     * config 奖项设置
     * localStorage 存储设置
     * board面板计奖函数
     */
    var config = {
        'awards' : 'five',
        'keycode': {
            '49': { 'class': 'one',    'name': '一等奖', 'total': 2 ,url:'1.png'},
            '50': { 'class': 'two',   'name': '二等奖', 'total': 5 ,url:'2.png'},
            '51': { 'class': 'three',    'name': '三等奖', 'total': 6,url:'3.png' },
            '52': { 'class': 'four',    'name': '四等奖', 'total': 30 ,url:'4.png'},
            '53': { 'class': 'five', 'name': '五等奖', 'total': 70 ,url:'5.png'},
            '54': { 'class': 'six', 'name': '补充抽奖', 'total': 100 ,url:'logo.png'}
        },


        get: function( key ) {
            return window.localStorage.getItem( key ) || ''
        },

        set: function( key, val) {
            window.localStorage.setItem( key, val );
        },

        /*
         *移除选定某项
         *去2个以上','  去前后','
         */
        remove: function( key, val ) {
            var key = key || config.awards,
                newval = config.get(key).replace(val, '').replace(/,{2,}/g, ',').replace(/(^,*)|(,*$)/g, '');

            config.set( key,  newval );
        },

        //获取当前locals
        getCur: function() {
            return config.get( config.awards )
        },

        //追加并去掉前后','
        setCur: function( val ) {
            var oldval = config.getCur(),
                newval = [ oldval, val ].join(',').replace(/(^,*)|(,*$)/g, '');

            config.set( config.awards, newval);
        },

        //查询当前是否有中奖记录！
        query: function( val ) {
            if (window.localStorage.length == 0){
                 return false;
             }
            var totalstr =  ','+window.localStorage.six+','+window.localStorage.five+','+window.localStorage.four+','+window.localStorage.three+','+window.localStorage.two+','+window.localStorage.one+',';
            console.log(totalstr);
            val = ','+val+',';
            if( totalstr.indexOf(val) >= 0){
                return true;
                    
            }
            return false;

        },

        //清空设置
        clear: function() {
            window.localStorage.clear()
        },

        //读取本地中奖数据
        reading: function() {
            for(key in config.keycode){
                var awards = config.keycode[key].class,
                    locals = config.get(awards);

                if( !!locals ){
                    var nums = locals.split(','),
                        selector = $('.' + awards);
                    
                    for(var i = 0; i < nums.length; i++){
                        config.appear( selector, nums[i] ,true)
                    }
                }
            }
        },

        appear: function( selector, num ,ignoreReading) {
            var data  = dataSource[ num ],

                code  = selector.find('code'),
                ratio = code.html(),
                min   = ~~/(\d+)\/\d+/.exec(ratio)[1],
                max   = ~~/\d+\/(\d+)/.exec(ratio)[1];

            if( min == max ){
                var awards = selector.attr('class').split(/\s+/)[0],
                    reg   = new RegExp('(\\d+,*){'+ max +'}');

                //过滤超过max位
                config.set(awards, reg.exec(config.get(awards))[0].replace(/(^,*)|(,*$)/g, '') )
                return
            }

            var newItem = selector.find('li:eq(0)').clone().removeAttr('class').attr({'data-num': num}).css({'margin-left': 300});

           // newItem.find('.num').html( data[ 'tel' ].replace(data[ 'tel' ].substr(3, 4), '****') );
            //newItem.find('.avatar img').attr('src', data[ 'url' ]);
            newItem.find('.num').hide();
            newItem.find('.avatar').hide();
            newItem.find('.name').html(data[ 'nick' ]);

            if( min > 0 ){
                newItem.prependTo( selector.find('.win') );
            } else {
                newItem.replaceAll( selector.find('li:eq(0)') )
            }

            setTimeout(function(){newItem.css({'margin-left': 0})}, 0)
            
            code.html( ratio.replace(/^\d+/, min + 1) );
            var cardsPan = $('.rcd-counter .ul');
            var card = $('<span id="'+ num +'">'+data[ 'nick' ]+'</span>');
            
            //ignoreReading?'':card.hide().appendTo(cardsPan).slideDown('slow');
            ignoreReading?'':card.hide().appendTo(cardsPan).fadeIn('slow');

            newItem.one('click', 'button', function() {
                var awards = newItem.parent().parent().parent('.active').attr('class').replace('active', '').replace(/^\s*|\s*$/g, '');
                $('.rcd-counter .ul').find('#'+num).remove();
                config.remove( awards, newItem.data('num') );
                newItem.css({'transition-delay': 0, 'margin-left': 300});
                code.html( ratio.replace(/^\d+/, ~~/(\d+)\/\d+/.exec(code.html())[1] - 1) );
                
                setTimeout(function(){
                    if( newItem.siblings().length == 0 ) {
                        var none = newItem.clone().addClass('none').removeAttr('style');
                        none.find('.num').hide();
                        none.find('.avatar').hide();
                        //none.find('.num').hide('***********');
                       // none.find('.avatar img').attr('src', 'img/blank.gif');
                        none.find('.name').html('***********');    

                        none.prependTo( selector.find('.win') )
                    }

                    newItem.remove()
                }, 600)
            })
        }
    }

    config['total'] = dataSource.length;
    console.log("Total Count:"+config['total'])

    /* 
     * 加载完毕后
     */
    function loader() {
        $('#copyleft').fadeOut();
        $('#content, .trigger').addClass('active');


        //空格控制
        var action = $( '.counter ul:not(.none) li' ).filter(function( i ){ return i > 0 }),
            lock = true,
            boot = Lucky( action );

        $( document ).on('keydown.lazyloader', function( e ){

            if( e.keyCode == 32 ){//空格
                var bgm = document.getElementById("bgm");
                if( lock ){
                    lock = boot.aStart();
                    bgm.play()
                }else{
                    lock = boot.lottery();
                    bgm.pause();

                    //console.log('five length:' $('.five li:not(.none)').length )
                    //当删除未领奖的时候，默认启用一次抽一次
                    config.awards == 'four' && taxis5( $('.five li:not(.none)').length % 5 );
                    config.awards == 'five' && taxis10( $('.five li:not(.none)').length % 10 );
                    if(config.awards == 'four' || config.awards == 'five'){
                        $('.rcd-counter .ul').empty();
                    }
                    
                }
            }
        })


        function taxis10( i ) {
            var i = i || 0;

            setTimeout(function(){
                if( ++i < 10 ) {
                    boot.aStart();
                    boot.lottery();

                    taxis10( i );
                }
            }, 1500)
        }
        function taxis5( i ) {
            var i = i || 0;

            setTimeout(function(){
                if( ++i < 5 ) {
                    boot.aStart();
                    boot.lottery();

                    taxis5( i );
                }
            }, 1500)
        }

    }

    function Lucky( args ){
        var args = args,
            timers = [],

            flicker = $('.flicker > img');

        return {
            //顺序运动
            aStart: function(){
                this.avatar();

                $.each(args, function( i, n ){
                    var single = $( n );

                    if( single.data( 'bingo' ) == undefined ){

                        single.data( 'bingo',  Bingo( single ) );

                    }
                    
                    timers[ i ] = setTimeout(function(){
                        
                        single.data( 'bingo' ).start();

                    }, i * 150)
                });

                return !1;
            },

            /*
             *抽奖
             /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/
             
             (new Date().getTime() * 9301 + 49297) % 233280 /233280.0 * Max

             ~~(Math.random() * max)
             ~~(Math.random() * (min - max + 1) + max)
             ( new Date().getTime() * 7 - 13 ) % totalCount + 1

             ~~(Math.random()*(max-min+1))

             Math.round( Math.random() * 1000 + .5) 
             Math.floor(Math.random() * 730) + 1

             //数组排序  [].sort(function () { return 0.5 - Math.random(); })
            */
            lottery: function() {
                for( var x in timers ) {
                    try{
                        if( timers.length > ~~x + 1 ) { 
                            clearTimeout( timers[ x ] )
                        }
                    }catch(e){

                    }
                }

                var lucky = this.randit();
                    value = [];
                //console.log("lucky:"+lucky)
                var nick = dataSource[ lucky ][ 'nick' ];
                $('.namepanl span').html(nick);
                for(var i = 0; i < lucky.length; i++){
                    ( i > 0 && i < 3 || i > 6 ) && value.push( lucky.charAt( i ) )
                }
                
                $.each(args, function(i, n){
                    var single = $( n ),
                        bingo = single.data( 'bingo' );

                    bingo.endTo( ~~value[ i ], i * 200, !i )
                })

                return !0;
            },

            /*
             * 随机抽取！
             */
            randit: function() {
                var result = Math.round( Math.random() * config.total + .5 ) - 1;
                    tel = dataSource[ result ][ 'tel' ];
                console.log(config.awards + ' time:'+ dataSource[ result ][ 'time' ] +" result:"+result +' tel:' +dataSource[ result ][ 'tel' ])

                if( config.query(result) ){
                    return this.randit();
                }
                if( config.awards ==  'one' && dataSource[ result ][ 'time' ] < '2' ){
                    return this.randit();
                }

                //html5存储序列号
                config.setCur( result );

                setTimeout(function(){
                    //停止头像
                    clearTimeout( timers[ args.length ] );

                    //flicker.attr('src', dataSource[ result ][ 'url' ]);

                    config.appear( $('.' +  config.awards), result )
                }, 1000)

                return result;
            },

            /*
             * 头像变换！
             */
            avatar: function() {
                var result = Math.round( Math.random() * config.total + .5 ) - 1;

                    url = dataSource[ result ][ 'url' ];

                //flicker.attr('src', url);

                timers[ args.length ] = setTimeout(arguments.callee, 100)
            }
        }
    }

    /*
     * 摇奖机Bingo
     * 从下至上循环摇动，控制backgroundPositionY
     * arg $对象
     */
    function Bingo( arg ) {
        var code = '3458', //网络识别号 [ 2 ]{ 3, 4, 5, 8 }
                           //RegExp( /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/ )

            loop = 0,      //循环次数
            running = 0,   //0 - 9
            timer = null;  //控制摇动时间

        /*
         * 增加随机步数selfAuto
         * 保证每次跳跃次数不一致
         * 范围 Math.random() * 10   --  [ 0 - 9 ]
         */
        function selfAuto() {
            running += ~~( Math.random() * 10 );

            format();
        }

        /*
         * 格式化format
         * running 保持0-9区间
         */
        function format() {
            if( running >= 10 ){
                loop ++;
                running -= 10;
            }
        }

        return {
            start: function() {
                selfAuto();
                var result = Math.round( Math.random() * config.total + .5 ) - 1;
                var nick = dataSource[ result ][ 'nick' ];
                $('.namepanl span').html(nick);
                
                
                arg.css({
                    'background-position-y': -120 * ( 10 * loop + running )
                })

                //[50, 100]
                timer = setTimeout( arguments.callee, Math.random() * 10 + 100 )
            },

            stop: function(){
                clearTimeout( timer )
            },

            endTo: function( num, timer ) {
                this.stop();

                timer = timer || 200;

                //网络识别号 [ 2 ]{ 3, 4, 5, 8 }
                if( arguments[2] != undefined && arguments[2] ) {
                    var to = code.indexOf( num ),
                        from = ( 10 * loop + running ) % 4;
                    
                    if( to >= from ) {
                        running += to - from;
                    } else {
                        running += 4 + to - from;
                    }
                    
                    format();
                } else {
                    if( num < running ) {
                        loop ++;
                    }
                    running = num;
                }
                

                arg.animate({
                    'background-position-y': -120 * ( 10 * loop + running  )
                }, timer)
            }
        }
    }

    $(document).ready(function() {
        var per = $('#loader .inner');

        $("#loader").addClass("ready");
        per.css('width', '100%');
        setTimeout(function() {
            per.css('transform', 'scale(1, 1)')
        }, 550);

        setTimeout(function(){
            $("#loader").animate({'opacity': 0}, 'fast', function() { $(this).remove() });
            $('#copyleft').addClass('active');
        }, 750);

        setTimeout(loader, 5000);
        //setTimeout(loader, 10);

        $('.trigger').on('click', function(){
            if( !$(this).data('active') ){
                $('.zone-container').addClass('active');
                
                $('.record-container').fadeOut();
                //animate({'width': 300}, 'fast');
                $('#content .counter-container').animate({'margin-left': -200}, 'fast');
                $('#content .flicker').animate({'margin-left': 0}, 'fast');

                $(this).data('active', true);
            } else {
                $('.zone-container').removeClass('active');

                $('#content .counter-container').animate({'margin-left': -350}, 'fast');
                $('#content .flicker').animate({'margin-left': -150}, 'fast');
                $('.record-container').fadeIn();
                $(this).data('active', false);
            }
        });

        config.reading();

        /*
         *更换壁纸、设置全局抽奖奖项
         *键盘操作[1: 一等奖, 2: 二等奖, 3: 三等奖, 4: 感恩奖，0: 全显]
         *CTRL + DEL 重置
         */
        $( document ).on('keydown', function( e ) {
            var k = config.keycode[ e.keyCode ];
            if( !!k ) {
                $('.rcd-counter .ul').empty();//清除旧数据
                $('.counter.namepanl span').html(k.name);
                config.awards = k.class;

                $('.' + config.awards).addClass('active').siblings().removeClass('active')
                var flicker = $('.flicker > img');
                flicker.attr('src','img/awards/'+ k[ 'url' ]);
                //background

            } else if (e.keyCode == 48){
                config.awards = 'five';

                $('.board > div').addClass('active');
            } else if (e.ctrlKey && e.keyCode == 46) {

                config.clear();

                window.location.reload()
            } else if(e.keyCode == 13){

                if(!$('.trigger').data('active') ){
                    $('.zone-container').addClass('active');
                    
                    $('.record-container').fadeOut();
                    //animate({'width': 300}, 'fast');
                    $('#content .counter-container').animate({'margin-left': -200}, 'fast');
                    $('#content .flicker').animate({'margin-left': 0}, 'fast');
    
                    $('.trigger').data('active', true);
                } else {
                    $('.zone-container').removeClass('active');
    
                    $('#content .counter-container').animate({'margin-left': -350}, 'fast');
                    $('#content .flicker').animate({'margin-left': -150}, 'fast');
                    $('.record-container').fadeIn();
                    $('.trigger').data('active', false);
                }
 
            }
        })

    })