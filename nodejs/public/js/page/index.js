//$(function() {
//    for(var i = 0;i < document.getElementsByClassName('user').length;i++) {
//        (function(i) {
//            $.ajax({
//                url: document.getElementsByClassName('user_photo')[i].getAttribute('data-src'),
//                type: "get",
//                cache: false,
//                timeout: 10000,
//                complete: function() {
//
//                    //called when complete
//                },
//                success: function(data) {
//                    console.log(i);
//                    document.getElementsByClassName('user_photo')[i].setAttribute('src', document.getElementsByClassName('user_photo')[i].getAttribute('data-src'))
//                },
//                error: function() {
//
//                }
//            });


//
//            var img = new Image();
//            img.src = document.getElementsByClassName('user_photo')[i].getAttribute('data-src');
//            img.onload = function() {
//                console.log(i);
//                document.getElementsByClassName('user_photo')[i].setAttribute('src', document.getElementsByClassName('user_photo')[i].getAttribute('data-src'))
//            }
//        })(i)
//    }
//
//})