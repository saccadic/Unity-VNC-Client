using UnityEngine;
using System.Collections;

public class SubDisplay : MonoBehaviour {

	public vncclient vnc;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		if(vnc.rect){
			gameObject.renderer.material.mainTexture = vnc.img;
		}
	}
}
