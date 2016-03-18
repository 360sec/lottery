/**
 * Created by rock on 15/12/22.
 * mobile: 15821789261
 * qq: 646019533
 */
var Util = {

    //group num for scoller
    user_group : 5,

    //check repeat in random number
    checkExist: function(arr,num) {
        return arr.indexOf(num) == -1
    },

    //random produce 50 winner
    randomSelect: function(docs) {  //random select 50 user to render and return to client side (and pick winner inside them)

        //the user lists to be render
        var user_lists = [],
            random,
            arr = [];

        for(var q = 0;q < this.user_group; q++) {

            var new_docs = [];    //纪录最后随机出的用户信息数组

            for(var i = 0;i<10;i++) {
                var check_flag = false;

                //检查用户是否在随机数里重复
                while(!check_flag ) {
                    random = Math.floor(Math.random()*docs.length);
                    check_flag = this.checkExist(arr,random);    //check random selected repeat
                }

                arr.push(random);
                //docs[random].photoUrl = './img/uploads/avatar/'+docs[random]._id+'.jpg';
                docs[random].photoUrl = './img/default.jpg';
                if(!docs[random].hope) {
                    docs[random].hope = '新年快乐，平安健康！'; //default hope
                }

                var temp_mobile = docs[random].mobile.split(' ');
                var res_mobile = temp_mobile[temp_mobile.length-1];
                docs[random].mobile = res_mobile;

                new_docs.push(docs[random]);
            }
            var user_list = {"user_list":new_docs};
            user_lists.push(user_list);
        }
//        console.log(arr);
//        console.log(JSON.stringify(user_list, null, 4))
        return user_lists;
    },

    //check if object is empty
    isOwnEmpty: function(obj) {
        for(var name in obj) {
            if(obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Util;




