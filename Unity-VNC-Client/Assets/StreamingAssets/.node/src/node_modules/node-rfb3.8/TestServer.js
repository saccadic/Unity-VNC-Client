var rfb = require('./rfb3.8.js');
var png = require('node-image-to-buffer').png;
var jpg = require('node-image-to-buffer').jpg;
var fs = require('fs');
var r = new rfb();

var password = 'savant';

r.connect('192.168.56.101','5902',password);
var x = 0;
r.events.on('connected',function(data){
    console.log('client -> Authentication success');
    console.log(data);
    
    r.info.pixel_format.bits_per_pixel = 32;
    r.info.pixel_format.depth = 8;
    r.info.pixel_format.big_endian_flag = 0;
    r.info.pixel_format.true_colour_flag =　1;
    
    r.SetPixelFormat();
    r.SetEncodings();
    r.FramebufferUpdateRequest(1,0,0,r.info.width,r.info.height);
    setInterval(function(){
        r.FramebufferUpdateRequest(0,0,0,r.info.width,r.info.height);
        //r.PointerEvent(0,x,x);
        //console.log(x);
    },200);
});

r.events.on('data',function(rect){
    //console.log(rect.data.length+':',rect.data);
    //png.ToFile(rect.width,rect.height,'view.png',rect.data);
    //var buf = jpg.ToBuffer(rect.width,rect.height,3,50,rect.data);
    var buf = png.ToBuffer(rect.width,rect.height,rect.data);
    
    fs.writeFile('view.png', buf , function (err) {

    });
    //var buf = png.ToBuffer(rect.width,rect.height,rect.data);
    console.log(x++,buf);
    //jpg.ToFile(rect.width,rect.height,3,50,'view.jpg',rect.data); 
});



