var crypto = require('crypto');

function PaddingText(text){
    if (text.length < 8) {
        for(var i=0;i<=(8-text.length);i++){
                text += '\0';       
        }
    }
    return text;
}

function ReverseByte(text) {
        var buf = new Buffer(text.length);
        for(var i=0;i<text.length;i++){
            var bn = text.charCodeAt(i).toString(2);
            var tmp = '';
            for(var t=0;t<bn.length;t++){
                tmp += bn[bn.length-1-t];
            }
            buf[i] = parseInt(tmp+'0',2);
        }
        return buf;
}

function MakeResponse(password,challenge) {
        var pass = ReverseByte(PaddingText(password));
        var cipher = crypto.createCipheriv('des-ecb', pass, '');
        cipher.setAutoPadding(false);
        var response = new Buffer(cipher.update(challenge,'binary'));
        /*
        var util = require('util');
        console.log(
            'Password : '+pass.length+':'+util.inspect(Buffer(password),false,null)+' [Shift]-> '+util.inspect(pass,false,null)+'\n'+
            'challenge:'+challenge.length+':'+util.inspect(challenge,false,null)+'\n'+
            'DES      :'+response.length+':'+util.inspect(response ,false,null)
        );
        */
        return response;
}

var des = {};
des.MakeResponse = MakeResponse;
module.exports = des;





