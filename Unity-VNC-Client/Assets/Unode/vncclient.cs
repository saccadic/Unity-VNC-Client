using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using WebSocketSharp;
using MiniMessagePack;

public class vncclient : MonoBehaviour {
	public WebSocket ws;
	public string ws_adress;

	public string ip;
	public string port;
	public string password;
	private Unode_v1_3 unode;

	private string ObjectName;

	MiniMessagePacker pakage;
	private Dictionary<string,object>	Msgpack,packed_data;
	public Texture2D img;

	private bool rect = false;
	public float timer = 0;
	public int updateFream = -1;

	public float interval;
	// Use this for initialization
	void Start () {
		ObjectName = gameObject.name;
		unode = GameObject.Find ("Unode_v1_3").GetComponent<Unode_v1_3>();
		ws = new WebSocket(ws_adress);
		ws.Connect ();

		ws.OnOpen += (sender, e) => {
			Debug.Log ("ws.OnOpen:");
		};
		
		ws.OnMessage += (sender, e) => {
			switch(e.Type){
			case Opcode.Binary:
				try{
					Msgpack = unode.MessagePackDecode(e.RawData) as Dictionary<string,object>;
					object data;
					if(Msgpack.TryGetValue("mode",out data)){
						switch((string)data){
							case "connected":
								Debug.Log ("Vnc server Connected.");
								break;
							case "rect":
								rect = true;
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
	
	// Update is called once per frame
	void Update () {
		if(rect){
			Debug.Log("Update");
			rect = false;
			img = loadtexture( (byte[])Msgpack["data"], (long)Msgpack["width"], (long)Msgpack["heigth"]);
			gameObject.renderer.material.mainTexture = img;
		}
		if(updateFream == 1){
			timer += Time.deltaTime;
			if(timer>interval){
				timer = 0;
				updateRequest();
			}
		}
	}

	void OnApplicationQuit() {
		if (ws != null)
			ws.Close ();
	}

	public void connect(){
		var packed_data = new Dictionary<string, object> {
			{ "mode", "connect" },
			{ "ip", ip },
			{ "port", port },
			{ "password", password },
		};
		unode.send(ws,packed_data);
	}

	public void updateRequest(){
		var packed_data = new Dictionary<string, object> {
			{ "mode", "update" }
		};
		unode.send(ws,packed_data);
	}

	public void SetUpdateFream(){
		updateFream *= -1;
	}

	private Texture2D loadtexture(byte[] image,long width,long height){
		Texture2D texture = new Texture2D((int)width, (int)height);
		texture.LoadImage(image);
		
		return texture;
	}
}
