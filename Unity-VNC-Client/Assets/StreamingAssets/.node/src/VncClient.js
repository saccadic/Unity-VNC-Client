var rfb = require('node-rfb3.8');
var vnc = new rfb();
var png = require('node-image-to-buffer').png;
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
                console.log(data);
                vnc.connect(data.ip,data.port,data.password);

                vnc.events.on('connected',function(data){
                    console.log('client -> Authentication success');
                    console.log(data);
                    
                    vnc.info.pixel_format.bits_per_pixel = 32;
                    vnc.info.pixel_format.depth = 8;
                    vnc.info.pixel_format.big_endian_flag = 0;
                    vnc.info.pixel_format.true_colour_flag =　1;
                    
                    vnc.SetPixelFormat();
                    vnc.SetEncodings();
                    vnc.FramebufferUpdateRequest(1,0,0,vnc.info.width,vnc.info.height);
                    
                    var message = {
                        mode : 'connected'
                    }
                    sendTOunity(client,message);
                });
                
                vnc.events.on('data',function(rect){
                    var buf = png.ToBuffer(rect.width,rect.height,rect.data);
                    var message = {
                        mode : 'rect',
                        width: rect.width,
                        heigth:rect.height,
                        data : buf
                    }
                    console.log(count+":",buf);
                    count++;
                    sendTOunity(client,message);
                });
                break;
            case 'update':
                vnc.FramebufferUpdateRequest(0,0,0,vnc.info.width,vnc.info.height);
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
    });
 
    // エラーが発生した場合
    client.on('error', function(err){
        console.log('error')
    });
});