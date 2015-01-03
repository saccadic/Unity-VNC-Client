var os = require('os');
var fs = require('fs');

switch (os.arch()) {
    case 'x64':
        var ImageGenerator = require('./build/Release/x64/NodeImageGenerator');
        break;
    case 'ia32':
        var ImageGenerator = require('./build/Release/Win32/NodeImageGenerator');
        break;
}

var inti = {
    png:{
        ToBuffer:function(args){
            var w = 0;
            var h = 0;
            if (!(isFinite(w) && isFinite(h))) {
                return -1;
            }else{
                w = arguments[0];
                h = arguments[1];
                switch (arguments.length) {
                    case 3:
                        if (Buffer.isBuffer(arguments[2])) {
                            return ImageGenerator.write_png_to_memory(w,h,arguments[2]);
                        }
                        break;
                    case 5:
                        if (Buffer.isBuffer(arguments[2]) && Buffer.isBuffer(arguments[3]) && Buffer.isBuffer(arguments[4])) {
                            if (arguments[2].length && arguments[3].length && arguments[4].length && w*h ) {
                                var r = arguments[2];
                                var g = arguments[3];
                                var b = arguments[4];
                                
                                var data = new Buffer(w*h*3);
                                data.fill(0);
                                
                                for(var i=0;i<w*h;i++){
                                    data.concat([r[i],g[i],b[i]]);
                                }
                                
                                return ImageGenerator.write_png_to_memory(w,h,data);
                            }
                        }
                        break;
                }
            }
            return false;
        },
        ToFile:function(args){
            if (arguments.length == 4 && (typeof(arguments[2]) == 'string')) {
                var buf = this.ToBuffer(arguments[0],arguments[1],arguments[3]);
                if (buf != false) {
                    var write_stream = fs.createWriteStream('./'+arguments[2]);
                    write_stream.write(buf);
                    write_stream.end();
                }
            }else{
                console.log('Error:argument');
            }
            return 0;
        }
    },
    jpg:{
        ToFile:function(args){
            var w   = arguments[0];
            var h   = arguments[1];
            var i_c = 3
            var q   = arguments[2];
            var name= arguments[3];
            var data= arguments[4];
            
            var buf = ImageGenerator.write_jpag_to_memory(w,h,i_c,q,data);
            //console.log(buf);
            
            var write_stream = fs.createWriteStream('./'+name);
            write_stream.write(buf);
            write_stream.end();
        },
        ToBuffer:function(w,h,q,data){
            return  ImageGenerator.write_jpag_to_memory(w,h,q,data);
        }
    }
}

module.exports = inti;