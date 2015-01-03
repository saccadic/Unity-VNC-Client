var png = require('./index.js').png;
var jpg = require('./index.js').jpg;

var w = 255;
var h = 255;
var data = new Buffer(w*h*3);
data.fill(0);
for(var i=0,t=0;i<h;i++){
    for(var j=0;j<w;j++){
        data.writeUInt8(i,t++);
        data.writeUInt8(j,t++);
        data.writeUInt8(200,t++); 
    }
}
png.ToFile(w,h,'gradation.png',data);
jpg.ToFile(w,h,3,50,'gradation.jpg',data);

var buf = png.Tobuffer(w,h,data);
console.log(buf);
var buf = jpg.Tobuffer(w,h,3,50,data);
console.log(buf);

var w = 2000;
var h = 2000;
var data = new Buffer(w*h*3);
data.fill(0);
for(var i=0,t=0;i<h;i++){
    for(var j=0;j<w;j++){
        data.writeUInt8(Math.floor( Math.random() * 255 ),t++);
        data.writeUInt8(Math.floor( Math.random() * 255 ),t++);
        data.writeUInt8(Math.floor( Math.random() * 255 ),t++); 
    }
}
png.ToFile(w,h,'noise.png',data);
jpg.ToFile(w,h,3,50,'noise.jpg',data);

var fs = require('fs');
fs.readFile('./data.txt', function (err, data) {
    png.ToFile(500,500,'Vnc.png',data);
    jpg.ToFile(500,500,3,50,'Vnc.jpg',data);
});

