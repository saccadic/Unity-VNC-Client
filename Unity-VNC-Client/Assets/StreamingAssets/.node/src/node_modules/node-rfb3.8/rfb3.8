var net = require('net');
var EventEmitter = require('events').EventEmitter;
var des = require('./lib/vnc_des-ecb.js');



var rfb = function(){
    //イベント
    this.events = new EventEmitter();
    //TCP/IP
    this.client = new net.Socket();
    this.client.setTimeout(180000);//デフォルト3分
    //状態遷移
    this.mode = 0;
    //設定情報
    this.info = {
        name:'',
        ver:0,
        width:0,
        height:0,
        pixel_format:{
            bits_per_pixel:0,
            depth:0,
            big_endian_flag:0,
            true_colour_flag:0,
            red_max:0,
            green_max:0,
            blue_max:0,
            red_shift:0,
            green_shift:0,
            blue_shift:0,
        }
    };
    //バッファデータ
    this.BufList = [];
    //レクトデータ
    this.rect = {};
};

rfb.prototype.connect = function(ipadress,port_number,password){
    var self = this;

    self.client.connect({host:ipadress,port:port_number}, function(){
        console.log('client -> Connect to vncserver');
    });
    self.client.on('connect', function(){
        console.log('client -> Connected');
        self.client.setTimeout(0);
        self.client.setNoDelay(true);
    });
    self.client.on('data', function(data){
        //console.log(data);
        switch (self.mode) {
            case 0://バージョンマッチング
                console.log(data.toString());
                if (data.toString() == 'RFB 003.008\n' || data.toString() == 'RFB 004.001\n') {
                    self.info.ver = 3.8;
                    self.mode = 1;
                    self.client.write('RFB 003.008\n');
                }else{
                    console.log('Error:not mach protocol vertion');
                    self.client.end();
                }
                break;
            case 1://セキュリティ設定（VNC Authentication）
                var size = data.readUInt8(0);
                if (size > 0) {
                    for(var i=1;i<=size;i++){
                        if (data.readUInt8(i) == 2) {
                            self.mode = 2;
                            self.client.write('\u0002');
                        }
                    }
                }else{
                    self.mode = -1;
                }
                break;
            case 2://VNC認証　チャレンジ・レスポンス
                var response = des.MakeResponse(password,data);
                self.mode = 3;
                self.client.write(response);
                break;
            case 3://認証結果　0:成功　1：失敗
                if (data.readInt32BE(0) == 0) {
                    self.mode = 4;
                    self.client.write('\u0001');
                }else{
                    console.log('Error:failure authentication');
                }
                break;
            case 4://設定データ受信
                ReceiveVncServerInfo(self.info,data);
                self.mode = 5;
                self.events.emit('connected',self.info);

                break;
            case 5://メインセクション
                //console.log(data.length+'main:',data);
                switch (data.slice( 0, 1).readUInt8(0)) {
                    case 0:
                        //console.log('FramebufferUpdate');
                        self.rect.number_of_rectangles = data.slice( 2, 4).readUInt16BE(0);
                        self.BufferSize = 0;
                        self.BufList = [];
                        if (data.length<=4) {
                            self.mode = 6;
                        }else{
                            var buf = data.slice(4);
                            self.rect.x_position    = buf.slice( 0,2).readUInt16BE(0);
                            self.rect.y_position    = buf.slice( 2,4).readUInt16BE(0);
                            self.rect.width         = buf.slice( 4,6).readUInt16BE(0);
                            self.rect.height        = buf.slice( 6,8).readUInt16BE(0);
                            self.rect.encoding_type = buf.slice( 8,12).readInt32BE(0);
                            buf = buf.slice(12);
                            self.BufferSize += buf.length;
                            self.BufList.push(buf);
                            self.mode = 8;
                        }
                        break;
                    case 1:
                        self.mode = 7;
                        console.log('SetColourMapEntries');
                        //console.log(data);
                        self.rect.first_colour      = data.slice( 3, 5).readUInt16BE(0);
                        self.rect.number_of_colours = data.slice( 5, 7).readUInt16BE(0);
                        self.BufList = [];
                        self.BufferSize = 0;
                        self.client.setTimeout(100);
                        break;
                    case 2:
                        console.log("Bell!");
                        break;
                    case 3:
                        console.log("ServerCutText");
                        break;
                }
                break;
            case 6:
                self.rect.x_position    = data.slice( 0,2).readUInt16BE(0);
                self.rect.y_position    = data.slice( 2,4).readUInt16BE(0);
                self.rect.width         = data.slice( 4,6).readUInt16BE(0);
                self.rect.height        = data.slice( 6,8).readUInt16BE(0);
                self.rect.encoding_type = data.slice( 8,12).readInt32BE(0);
                
                var buf = data.slice(12);
                self.BufferSize += buf.length;
                self.BufList.push(buf);
                self.mode = 8;
                break;
            case 7:
                self.BufferSize += data.length;
                self.BufList.push(data);
                //console.log(self.BufferSize);
                if (self.BufferSize == self.rect.width*self.rect.height*4) {
                    console.log(self.BufferSize);
                    self.events.emit('encode');
                }
                break;
            case 8:
                self.BufferSize += data.length;
                self.BufList.push(data);
                if (self.BufferSize == self.rect.width*self.rect.height*4) {
                    //console.log(self.BufferSize);
                    self.events.emit('encode');
                }
                break;
            case -1:
                console('Error:'+data.slice(4).toString());
                self.client.end();
                break;
        }
    });
    
    self.events.on('encode', function(){
        self.mode = 5;
        var buf = Buffer.concat(self.BufList, self.BufList.totalLength);
        //console.log(buf);
        self.rect.data = new Buffer(self.rect.width*self.rect.height*3);
        for(var i=0;i<self.rect.width*self.rect.height;i++){
            self.rect.data[3*i  ] = buf[4*i+2];
            self.rect.data[3*i+1] = buf[4*i+1];
            self.rect.data[3*i+2] = buf[4*i];
        }
        self.events.emit('data',self.rect);
    });
    
    self.client.on('error', function(data){
        console.log(''+data);
    });
    self.client.on('end', function(){
        console.log('end');
    });
    self.client.on('close', function(){
        console.log('client-> connection is closed');
    });
    self.client.on('timeout',function(){
        console.log('timeout');
        switch (self.mode) {
            case 7:
                self.mode = 5;
                self.rect.buf = Buffer.concat(self.BufList, self.BufList.totalLength);
                break;
            default:
                console.log('client -> Timeout');
                self.client.end();
        }
    });
    
};

rfb.prototype.SetPixelFormat = function(){
    var buf = new Buffer(20);
    buf.fill(0);

    buf.writeUInt8(0,0);//message-type
    
    buf.writeUInt8(0,1);//padding
    buf.writeUInt8(0,2);
    buf.writeUInt8(0,3);
    
    buf.writeUInt8(this.info.pixel_format.bits_per_pixel,4);  //bits_per_pixel
    buf.writeUInt8(this.info.pixel_format.depth,5);           //depth
    buf.writeUInt8(this.info.pixel_format.big_endian_flag,6); //big_endian_flag    
    buf.writeUInt8(this.info.pixel_format.true_colour_flag,7);//true_colour_flag,
    
    buf.writeUInt16BE(this.info.pixel_format.red_max,8);   //red_max
    buf.writeUInt16BE(this.info.pixel_format.green_max,10);//green_max
    buf.writeUInt16BE(this.info.pixel_format.blue_max,12); //blue_max
    
    buf.writeUInt8(this.info.pixel_format.red_shift,14);  //red_shift
    buf.writeUInt8(this.info.pixel_format.green_shift,15);//green_shift
    buf.writeUInt8(this.info.pixel_format.blue_shift,16); //blue_shift              
    
    buf.writeUInt8(0x0,17);//padding
    buf.writeUInt8(0x0,18);
    buf.writeUInt8(0x0,19);
    
    //console.log(buf);
    this.client.write(buf);
}

rfb.prototype.SetEncodings = function(){
    var buf = new Buffer(8);
    
    buf.writeUInt8(2,0);    //message-type
    
    buf.writeUInt8(0,1);    //padding
    
    buf.writeUInt16BE(1,2); //number-of-encodings
    buf.writeInt32BE(0,4);  //encoding-type     
    
    //console.log(buf);
    this.client.write(buf);  
}

rfb.prototype.FramebufferUpdateRequest = function(i,x,y,w,h){
    var buf = new Buffer(10);
    
    buf.writeUInt8(3,0);   //message-type
    
    buf.writeUInt8(i,1);   //incremental
    
    buf.writeUInt16BE(x,2);//x-position
    buf.writeUInt16BE(y,4);//y-position
    buf.writeUInt16BE(w,6);//width
    buf.writeUInt16BE(h,8);//height
   
    //console.log(buf);
    this.client.write(buf);
}

rfb.prototype.KeyEvent = function(down,key){
    if (key > 0) {
        var buf = new Buffer(8);
        buf.writeUInt8(4,0);   //message-type
        buf.writeUInt8(down,1);//down-flag  
        buf.writeUInt16BE(0,3);//padding
        buf.writeUInt32BE(key,4);//key
        console.log(key+":",buf);
        this.client.write(buf);
    }
}

rfb.prototype.PointerEvent = function(mask,x,y){
    var buf = new Buffer(6);
    buf.writeUInt8(5,0);   //message-type
    
    switch (mask) {
        case 0:
            buf.writeUInt8(1 << 0,1);
            break;
        case 1:
            buf.writeUInt8(1 << 1,1);
            break;
        case 2:
            buf.writeUInt8(1 << 2,1);
            break;
        case 3:
            buf.writeUInt8(1 << 3,1);
            break;
        case 4:
            buf.writeUInt8(1 << 4,1);
            break;
        case 5:
            buf.writeUInt8(1 << 5,1);
            break;
        default:
            buf.writeUInt8(0,1);
            break;
    }
    
    buf.writeUInt16BE(x,2);//x-position
    buf.writeUInt16BE(y,4);//y-position
    console.log(buf);
    this.client.write(buf);
}

function ReceiveVncServerInfo(info,data) {
    //console.log('R'+data.length+':',data);
    
    info.width  = data.slice(0,2).readUInt16BE(0);
    info.height = data.slice(2,4).readUInt16BE(0);
    
    info.pixel_format.bits_per_pixel   = data.slice( 4, 5).readUInt8(0);
    info.pixel_format.depth            = data.slice( 5, 6).readUInt8(0);
    info.pixel_format.big_endian_flag  = data.slice( 6, 7).readUInt8(0);
    info.pixel_format.true_colour_flag = data.slice( 7, 8).readUInt8(0);
    info.pixel_format.red_max          = data.slice( 8,10).readUInt16BE(0);
    info.pixel_format.green_max        = data.slice(10,12).readUInt16BE(0);
    info.pixel_format.blue_max         = data.slice(12,14).readUInt16BE(0);
    info.pixel_format.red_shift        = data.slice(14,15).readUInt8(0);
    info.pixel_format.green_shift      = data.slice(15,16).readUInt8(0);
    info.pixel_format.blue_shift       = data.slice(16,17).readUInt8(0);
    
    //Padding  3byte.17-20
    //NameSize 4byte.20-24 
    
    info.name   = data.slice(24).toString();
}

module.exports = rfb;