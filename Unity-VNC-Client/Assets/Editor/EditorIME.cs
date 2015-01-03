using UnityEngine;
using UnityEditor;
using System.Collections;

public class EditorIME : EditorWindow
{
	[MenuItem("IME/Open")]
	static public void OpenWindow()
	{
		EditorWindow.GetWindow<EditorIME>(false, "Editor IME", true);
	}
	
	private string _text="";
	
	void OnGUI()
	{
		GUILayout.BeginHorizontal();
		
		GUILayout.Label( "Mode" );
		
		string[] selString = System.Enum.GetNames( typeof(IMECompositionMode) );
		
		Input.imeCompositionMode = (IMECompositionMode)GUILayout.SelectionGrid( (int)Input.imeCompositionMode,selString,selString.Length );
		
		GUILayout.EndHorizontal();
		
		_text = EditorGUILayout.TextArea( _text,GUILayout.Height(80f) );
	}
}