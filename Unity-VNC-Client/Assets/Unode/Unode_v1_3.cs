using UnityEngine;
using System;
using System.Diagnostics;
using System.Collections;
using System.Collections.Generic;
using System.Text;

using WebSocketSharp;
using MiniMessagePack;

using Debug = UnityEngine.Debug;

public class Unode_v1_3 : MonoBehaviour {
	
	//Websocket
	public string adress;
	public WebSocket ws;
	public bool IsNodeJS;
	
	//Messagepack
	MiniMessagePacker pakage;
	private Dictionary<string,object>	Msgpack,
										packed_data,
										localPosition,
										localEulerAngles,
										localScale;

	//Node.exe
	public string program_name;
	public bool windowtype_hidden = false;
	public bool x86;
	
	[HideInInspector]
	public string nodejs_path;
	public string Script_path;
	
	public bool connected = false;
	private Process nodejs_process;
	private ProcessStartInfo info;
	public bool cmd = true;
	public string command;
	public string js;
	
	//Program Options
	public string ObjectName;
	public string mode;

	void Awake() {
		if (IsNodeJS = open_nodejs (x86)) {
			ws = new WebSocket (adress);
			pakage = new MiniMessagePacker ();
			ObjectName = name;
			SetupUnode (ws, adress);
		}
	}
	
	void Start () {

	}
	
	//メインスレッド
	void Update () {

	}
	
	void OnApplicationQuit() {
		if (ws != null)
			ws.Close ();
		kill_nodejs ();
	}
	
	private bool open_nodejs(bool arch){
		if (arch == true) {
			nodejs_path = Application.streamingAssetsPath + "/.node/x86/";
		} else {
			nodejs_path = Application.streamingAssetsPath + "/.node/x64/";
		}
		Script_path = Application.streamingAssetsPath + "/.node/src/";
		
		info = new System.Diagnostics.ProcessStartInfo();
		info.FileName = nodejs_path + program_name;
		info.WorkingDirectory = Script_path;
		
		if(cmd){
			info.Arguments = command;
		}else{
			info.Arguments = Script_path + js;
		}
		
		if(windowtype_hidden)
			info.WindowStyle = ProcessWindowStyle.Hidden;
		
		try{
			nodejs_process = Process.Start(info);
		}catch(System.ComponentModel.Win32Exception w){
			Debug.Log("Not Found." + w);
			return false;
		}
		return true;
	}
	
	private void kill_nodejs(){
		if (!nodejs_process.HasExited)
			nodejs_process.Kill ();
	}

	public void SetupUnode(WebSocket ws,string adress){
		ws.Connect ();

		var packed_data = new Dictionary<string, object> {
			{ "mode", "connect" },
			{ "name", name },
		};
		send(ws,packed_data);
					
		ws.OnOpen += (sender, e) => {
			Debug.Log ("ws.OnOpen:");
		};
		
		ws.OnMessage += (sender, e) => {
			switch(e.Type){
				case Opcode.Binary:
					try{
						Msgpack = MessagePackDecode(e.RawData) as Dictionary<string,object>;
						object data;
						if(Msgpack.TryGetValue("mode",out data)){
							//Debug.Log("["+obj_name+"]byte::"+e.RawData.Length);
							mode = (string)data;
							switch(mode){
								case "connected":
									Debug.Log ((string)Msgpack["ver"]);
									connected = true;
									break;
								case "echo":
									Debug.Log ("echo:"+(string)Msgpack["text"]);
									break;
							}
						}else{
							Debug.Log("error"+"["+ObjectName+"]"+":mode::"+e.RawData.Length);
						}
					}catch{
						Debug.Log("error:"+"["+ObjectName+"]"+"Msgpack");
					}
					break;
				case Opcode.Text:
					Debug.Log("TextMesaage:"+e.Data);
					break;
			}
		};
		
		ws.OnError += (object sender, ErrorEventArgs e) => {
			Debug.Log ("OnError"+"["+ObjectName+"]"+ e.Message);
		};
		
		ws.OnClose += (object sender, CloseEventArgs e) => {
			Debug.Log ("OnClosed"+"["+ObjectName+"]"+ e.Reason);
		};		
	}

	public byte[] MessagePackEncode(Dictionary<string,object> dic){
		return pakage.Pack(dic);
	}
	
	public object MessagePackDecode(byte[] raw){
		return pakage.Unpack(raw);
	}
	
	public void send(WebSocket ws,Dictionary<string,object> dic){
		if(ws.IsAlive){
			byte[] data = MessagePackEncode(dic);
			//Debug.Log(sizeof(byte)*data.Length);
			ws.Send(data);
		}
	}
	
	public void RegistNodeModule(WebSocket ws,string name,string js){
		packed_data = new Dictionary<string, object> {
			{ "mode", "child" },
			{ "regist", true},
			{ "name", name},
			{ "js", js}
		};
		send(ws,packed_data);		
	}
	
	public void SendToNodeModule(WebSocket ws,string name,Dictionary<string,object> option){
		var packed_data = new Dictionary<string, object> {
			{ "mode", "child" },
			{ "name", name},
			{ "options", option}
		};
		send(ws,packed_data);		
	}

	public void AddTransformObjct(GameObject obj){
		
	}
}
