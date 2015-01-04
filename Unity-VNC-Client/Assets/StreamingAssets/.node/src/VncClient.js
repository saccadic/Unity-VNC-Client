var rfb = require('node-rfb3.8');
var vnc = new rfb();
var png = require('node-image-to-buffer').png;
var jpg = require('node-image-to-buffer').jpg;
var msgpack = require('msgpack-js');
var WebSocketServer = require('ws').Server;

var server = new WebSocketServer({host:'0.0.0.0', port:9090});

var count=0;

function sendTOunity(client,message){
    try{
        var bytedata = msgpack.encode(message);
	client.send(bytedata,{binary:true,mask: false});
    }catch(e){
        console.log("Error:",e);
    }
}

server.on('connection', function(client) {
    console.log('connection start:%d',client._ultron.id);
    client.send('Connected Node.js');
    // クライアントからのメッセージ受信イベントを処理
    client.on('message', function(request) {
        var data = msgpack.decode(request);
        switch (data.mode) {
            case 'connect':
                //console.log(data);
                vnc.connect(data.ip,data.port,data.password);

                vnc.events.on('connected',function(data){
                    console.log('client -> Authentication success');
                    console.log(data);
                    
                    vnc.info.pixel_format.bits_per_pixel = 32;
                    vnc.info.pixel_format.depth = 8;
                    vnc.info.pixel_format.big_endian_flag = 0;
                    vnc.info.pixel_format.true_colour_flag =　1;
                    //vnc.info.pixel_format.red_shift = 32;
                    //vnc.info.pixel_format.green_shift = 8;
                    //vnc.info.pixel_format.blue_shift = 0;
                    
                    vnc.SetPixelFormat();
                    vnc.SetEncodings();
                    //vnc.FramebufferUpdateRequest(1,0,0,vnc.info.width,vnc.info.height);
                    
                    var message = {
                        mode : 'connected',
                        name : vnc.info.name,
                        width: vnc.info.width,
                        height: vnc.info.height
                    }
                    sendTOunity(client,message);
                });
                
                vnc.events.on('data',function(rect){
                    //var buf = png.ToBuffer(rect.width,rect.height,rect.data);
                    var buf = jpg.ToBuffer(rect.width,rect.height,50,rect.data);
                    var message = {
                        mode : 'rect',
                        width: rect.width,
                        heigth:rect.height,
                        data : buf
                    }
                    //console.log(count+":",buf);
                    count++;
                    sendTOunity(client,message);
                });
                break;
            case 'update':
                vnc.FramebufferUpdateRequest(0,0,0,vnc.info.width,vnc.info.height);
                break;
            case 'pointer':
                vnc.PointerEvent(data.mask,data.x,data.y);
                break;
            case 'key':
                vnc.KeyEvent(data.on,data.code);
                break;
            default:
                console.log(data);
        };
    });
 
    // クライアントが切断したときの処理
    client.on('disconnect', function(){
        console.log('connection disconnect');
    });
 
    // 通信がクローズしたときの処理
    client.on('close', function(){
        console.log('close')
        process.exit(1);
    });
 
    // エラーが発生した場合
    client.on('error', function(err){
        console.log('error')
    });
});