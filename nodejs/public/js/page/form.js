/**
 * Created by rock on 15/12/22.
 * mobile: 15821789261
 * qq: 646019533
 */
var user_id;

$(function() {

    /*full window*/
    if(window.innerHeight<568) {
        document.getElementsByClassName('form-container')[0].style.minHeight = window.innerHeight+80+"px";
    }
    else {
        document.getElementsByClassName('form-container')[0].style.minHeight = window.innerHeight+"px";
    }

	// socket initiate
	var socket = io(),
        search_flag = true, //avoid search double click
        blob;   //base64 to blob


	//上传照片
	$('.upload-avatar').on("click",function() {
		$('#uploadImg').trigger('click')
	})

	//socket  tell server-side search database by name
	$('.search').on("click",function() {
		if(search_flag) {   //check if user clicked search and not finish yet
            //emit username by socket
			socket.emit('sendUserName', $('#f-name').val());
		}
        else {
            window.location.reload();
        }
    })

    //alert for name doesn't exist
	$('.alert-bot').on('click',function() {
		$('.alert-wrap').addClass('dispear');
	});

    //handle submit on bottom
    $('.fake-submit').on("click",function() {

        //验证用户是否搜索到姓名记录
        if(!user_id) {
            $('.alert-top').html('请输入正确的姓名并搜索相匹配的记录')
            $('.alert-wrap').removeClass('dispear');
            return false;
        }

        //验证用户是否填写健康号
        if(!$('#f-healthId').val()) {
            $('.alert-top').html('请输出正确的健康号,健康号一经提交不可更改，请仔细填写')
            $('.alert-wrap').removeClass('dispear');
            return false;
        }

        if($('#f-commited').val()) {    //提交过
            $('.submit-wrap').removeClass('dispear');

        }
        else {  //未提交
            socket.emit('sendHealthId', {"userName":$('#f-name').val().split(' ')[0],"healthId":$('#f-healthId').val()});
        }


    })

    //cancel submit
    $('.submit-cancel').on("click",function() {
        $('.submit-wrap').addClass('dispear');
    })

    //check if user healthId is duplicated
    socket.on("getHealthId",function(res) {
        if(res) { //健康号重复
            $('.alert-top').html('该健康号已被提交，请联系平安健康杜娜：18765676765');
            $('.alert-wrap').removeClass('dispear');
        }
        else {  //健康号未重复
            $('.submit-wrap').removeClass('dispear');
        }
    })


	//get user info from database
	socket.on('getUserInfo',function(info) {

		if(info ==null) {	//name doesn't exist
            $('.alert-top').html('<p>该姓名不存在,请确认输入无误，<br /> 如有疑问请联系平安健康杜娜。</p><p>联系电话<a href="tel:18765676765">18765676765</a></p>')
            $('.alert-wrap').removeClass('dispear');
        }
		else {  //name exist
            search_flag = false;
			if(info.length == 1) {	//single name
                //append user info to form
                appendFormData(info,0);
            }
            else {	//duplicated name

                //append user chooser list
                createHtml(info);

                $('.chooseUser-wrap').removeClass('dispear');

                //select user
                $('.chooseUser-item').on('click',function() {
                    var index = $(this).index();

                    //add checked icon
                    $('.checked').addClass('dispear')
                    $('.chooseUser-item').removeClass('chooseUser-active');
                    $(this).addClass('chooseUser-active');
                    $(this).find('.checked').removeClass('dispear')

                    //append info to form
                    appendFormData(info,index);

                    //remove user chooser list
                    setTimeout(function() {
                        $('.chooseUser-wrap').addClass('dispear')
                    }, 500)
                })
            }
        }
    })


	//upload img
    $('#uploadImg').on("change",function(e) {

        //check img size lt 4mb
        if(document.getElementById('uploadImg').files[0].size <= 4194304) {
            var tgt = e.target || window.event.srcElement,
                files = tgt.files;

            // FileReader support
            if (FileReader && files && files.length) {
                var fr = new FileReader();
                fr.onload = function (e) {
//                    $('.photoCrop-wrap').removeClass('dispear');
//                    //裁切界面
//                    $('.photoCrop').append("<img class='cropAvatar' src="+fr.result+" />")
//                    $('.cropAvatar').cropper({
//                      aspectRatio: 1,
//                      autoCropArea: 0.65,
//                      strict: true,
//                      guides: true,
//                      highlight: true,
//                      dragCrop: true,
//                      cropBoxMovable: true,
//                      cropBoxResizable: true
//                    });
//
//                    //cancel crop
//                    $('.cancel-crap').on("click",function() {
//                        $('.photoCrop-wrap').addClass('dispear');
//                        $('.crap').text("确认提交");
//                        document.getElementsByClassName('cropper-container')[0].parentNode.removeChild(document.getElementsByClassName('cropper-container')[0])
//                    });
//
//                    //crop image
//                    $('.crap').on("click",function() {
//                        $('.crap').text("正在提交");
//                        //get base64 img
//                        var resp = $('.cropAvatar').cropper('getCroppedCanvas').toDataURL("image/jpeg",0.3);
//
//
//                        //get file blob
//                        blob = dataURItoBlob(resp);
//
//                        //clear old crop zone
//                        document.getElementsByClassName('cropper-container')[0].parentNode.removeChild(document.getElementsByClassName('cropper-container')[0])
//                        $('.photoCrop-wrap').addClass('dispear')
//                        $('.avatar').attr('src',resp);
//                        $('.crap').text("确认提交");
//                    })

//                    var canvas = document.getElementById("c");
//                    var ctx = canvas.getContext("2d");
//                    var image = new Image();
//                    image.src = fr.result;
//                    image.onload = function() {
//                        ctx.drawImage(image, 0, 0,canvas.width, canvas.height);
//                        if(document.getElementById('uploadImg').files[0].size <= 1048576) {
//                            var resp = canvas.toDataURL("image/jpeg",1);
//                        }
//                        else {
//                            var resp = canvas.toDataURL("image/jpeg",0.5);
//                        }
//
//                        blob = dataURItoBlob(resp);
//                        $('.avatar').attr('src',resp);
//                    };

//                    var resp = canvas.toDataURL("image/jpeg",0.3);
//                    blob = dataURItoBlob(resp);
//                    var resp = fr.result;
//                    resp = resp.toDataURL("image/jpeg",0.3);
//
//                    blob = dataURItoBlob(resp);

                    //头像图片更新
                    $('.avatar').attr('src',fr.result);

                }
                fr.readAsDataURL(files[0]);
            }
            // Not supported
            else {
                alert("不支持文件上传")
            }
        }
        else {
            //图片太大了
            alert('请选择小于4mb的图片')
        }
    })

    //form submit
    $('#uploadForm').submit(function() {

        //send photo
//        var fd = new FormData(document.getElementsByClassName[0])
//        fd.append("file",blob)
//        var xhr = new XMLHttpRequest();
//        xhr.onreadystatechange = function() {
//            if ( xhr.status == 200) {
//                $('.avatar').attr('src',"./img/uploads/avatar/"+user_id);
//            }
//          };
//        var action_upload =  '/upload?'+'userId='+user_id;
//        xhr.open('post',action_upload,true);
//        xhr.send(fd);

        //send form with user info
		$("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({
                error: function(xhr) {
                status('Error: ' + xhr.status);
                    $('.alert-top').html('提交失败')
                    $('.alert-wrap').removeClass('dispear');
                },
                success: function(response) {
                    console.log(response)
                    $("#status").empty().text(response);
                    $('.pacman').addClass('dispear');
                    $('.alert-top').html('提交成功')
                    $('.alert-wrap').removeClass('dispear');
                    $('#f-healthId').attr('disabled',true);
                    $('.f-commited').val(true);
                }
        });
        return false;
	});    

    //convert base64 img into file
//    function dataURItoBlob(dataURI) {
//	    // convert base64/URLEncoded data component to raw binary data held in a string
//	    var byteString;
//	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
//	        byteString = atob(dataURI.split(',')[1]);
//	    else
//	        byteString = unescape(dataURI.split(',')[1]);
//
//	    // separate out the mime component
//	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//
//	    // write the bytes of the string to a typed array
//	    var ia = new Uint8Array(byteString.length);
//	    for (var i = 0; i < byteString.length; i++) {
//	        ia[i] = byteString.charCodeAt(i);
//	    }
//
//	    return new Blob([ia], {type:mimeString});
//	}


    //append info to form
    function appendFormData(info,index) {
        if(info[index].commited) {
            $('#f-healthId').attr('disabled',true)
        }
        $('.f-commited').val(info[index].commited);
        user_id = info[index].id;
        $('.avatar').attr('src','./img/uploads/avatar/'+user_id+'.jpg')
        var temp_mobile = info[index].mobile.split(' ');
        var mobile = temp_mobile[temp_mobile.length-1]
        $('#f-mobile').val(mobile);
        $('#f-name').val(info[index].name+' ' + info[index].department);
        $('#f-name').attr('disabled',true);
        $('.search').text("更改");
        if(info[index].hope) {
            $('#f-hope').val(info[index].hope)
        }
        if(info[index].healthId) {
            $('#f-healthId').val(info[index].healthId)
        }
    }

    //append html for chooser user
    function createHtml(obj) {
        var arr =[];
        for(var i = 0;i < obj.length; i++) {
            arr.push('<li class="chooseUser-item"><div class="chooseUser-item-inner"><img class="checked dispear" src="img/checked.png" /><p class="chooseUser-name">姓名：'+obj[i].name+'</p><p class="chooseUser-department">部门：'+obj[i].department+'</p><p class="chooseUser-um">UM账号：'+obj[i].um+'</p></div></li>')
        }
        $('.chooseUser-list').html(arr.join(''))
    }

})

//get form submit action
function getAction(form) {
    $('.pacman').removeClass('dispear');
	$('.submit-wrap').addClass('dispear');
	$('#f-id').val(user_id);
	form.action = '/uploadPhoto';
}	
