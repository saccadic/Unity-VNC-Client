var util = require('util');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var child_process = require("child_process");
var WebSocketServer = require('ws').Server

var msgpack = require('msgpack-js');

var children = {};
var TransformClients = [];
var counter = 0;
function sendTOunity(client,message){
    try{
        var bytedata = msgpack.encode(message);
    
	client.send(bytedata,{binary:true,mask: false});
        
        //console.log("Nodejs -> Unity:",bytedata.length);
    }catch(e){
        console.log("Error:",e);
    }
}

function BroadcastToUnity(SelfClient,message) {
    for(var i=0;i<TransformClients.length;i++){
	if(TransformClients[i] != SelfClient)
	    sendTOunity(TransformClients[i],message);
    }
}


if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on('exit', function(worker, code, signal) {
    console.log("worker("+worker.id+").exit " + worker.process.pid);
  });
  cluster.on('online', function(worker) {
    console.log("worker("+worker.id+").online " + worker.process.pid);
  });
  cluster.on('listening', function(worker, address) {
    console.log("worker("+worker.id+").listening " + address.address + ":" + address.port);
  });
 
} else {    
    var server = new WebSocketServer({host:'0.0.0.0', port:8080});

    server.on('connection', function(client) {
	console.log('connection start:%d',client._ultron.id);
	
	// クライアントからのメッセージ受信イベントを処理
	client.on('message', function(request) {
	    var data = msgpack.decode(request);
	    //console.log("Unity -> Nodejs:%d:%d",request.length,counter++);
    
	    //--------------Main area--------------
	    switch (data.mode) {
		case "connect":
		    var message = {
			mode : 'connected',
			ver  : 'v0.10.28'
		    }
		    sendTOunity(client,message);
		    break;
		case "child":
		    console.log("Run:" + data.name);
		    if (data.regist != null) {
			var child = child_process.fork("./"+data.js);
			children[data.name] = {
			    "child" : child,
			    "cilent": client
			}
			children[data.name].child.on("message", function(msg) {
			   console.log(msg);
			   sendTOunity(children[msg.name].cilent,msg); 
			});
		    }else{
			children[data.name].child.send(data.options);
		    }
		    break;
		case "transform":
		    //client.send(data.name);
		    if (data.regist != null) {
			TransformClients.push(client);
			var message = {
			    mode : 'connected',
			    ver  : 'v0.10.28'
			}
			sendTOunity(client,message);			
			//console.log("TransformClients:"+TransformClients.length);
		    }else{
			//for(var i=0;i<data.size;i++){
			    //console.log("Name:%s ObjectSize:%d DataSize:%d",data.objects[i].name,data.size,request.length);
			    //console.log(util.inspect(data,false,null));
			//}
			//console.log(util.inspect(data,false,null));
			BroadcastToUnity(client,data);
		    }
		    break;
		case "echo":
		    var message = {
			mode : data.mode,
			text : data.text
		    }
		    sendTOunity(client,message);
		    break;
	    }
	    //--------------------------------------
	});
     
	// クライアントが切断したときの処理
	client.on('disconnect', function(){
	    console.log('connection disconnect');
	});
     
	// 通信がクローズしたときの処理
	client.on('close', function(){
	    for(var i=0;i<TransformClients.length;i++){
		if(TransformClients[i] == client)
		    TransformClients.splice(i,1);
	    }
	    console.log('connection close');
	});
     
	// エラーが発生した場合
	client.on('error', function(err){
	    console.log(err);
	    console.log(err.stack);
	});
    });
}