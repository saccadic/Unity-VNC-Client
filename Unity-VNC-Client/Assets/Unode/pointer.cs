using UnityEngine;
using System.Collections;

public class pointer : MonoBehaviour {
	private Ray ray;
	private RaycastHit  hit;

	public Vector3 size;
	public Vector3 pos;

	public float width=1,height=1;
	void Update () {
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast (ray, out hit, 1000)) {
			pos = resize(hit.collider.gameObject.transform,hit.point,new Vector3(width,height,0));
		}
	}

	Vector3 resize(Transform obj,Vector3 hit,Vector3 src){
		size = new Vector3 (10.0f*obj.localScale.x, 10.0f*obj.localScale.y, 10.0f*obj.localScale.z);
		float x = Mathf.Abs((hit.x-obj.localPosition.x) + size.x/2)*(src.x/size.x);
		float y = Mathf.Abs((hit.y-obj.localPosition.y) - size.y/2)*(src.y/size.y);
		return new Vector3 (x,y,0);
	}

	public void setSize(float w,float h){
		width = w;
		height = h;
	}
}
