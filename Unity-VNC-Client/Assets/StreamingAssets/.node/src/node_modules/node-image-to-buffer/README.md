node-image-to-buffer
====================

ピクセルデータから任意のフォーマット（png,jpeg,gif,etc）のバッファに変換するにnode.js用モジュール  
動作確認環境 = {Node.js:v0.10.28,arch:[x64,x86],OS:[Windows7,64bit]}

ビルド
------
VC2013  
./build/binding.sln　からビルドする

使い方
------
    /*example.js*/
    var png = require('node-image-to-buffer').png;
    var jpg = require('node-image-to-buffer').jpg;
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
    var buf = jpg.Tobuffer(w,h,50,data);
    console.log(buf);

関数
------
    png.ToFile(width,height,filename,data);
+   `width` :  
    _横サイズ_（Number型)
+   `height`:  
    _縦サイズ_（Number型)
+   `filename`:  
    _出力ファイル名_（String型)
+   `data`:  
    _ピクセルデータ_（Buffer型)  

------

    png.ToBUffer(width,height,data);
+   `width` :  
    _横サイズ_（Number型)  
+   `height`:  
    _縦サイズ_（Number型)  
+   `data`:  
    _ピクセルデータ_（Buffer型)  

------

    jpg.ToFile(width,height,quality,filename,data);
+   `width` :  
    _横サイズ_（Number型)  
+   `height`:  
    _縦サイズ_（Number型)  
+   `quality`:  
    _画像品質_（Number型)  
+   `filename`:  
    _出力ファイル名_（String型)  
+   `data`:  
    _ピクセルデータ_（Buffer型)

------

    jpg.ToBuffer(width,height,quality,data);  
+   `width` :  
    _横サイズ_（Number型)
+   `height`:  
    _縦サイズ_（Number型)
+   `quality`:  
    _画像品質_（Number型)
+   `data`:  
    _ピクセルデータ_（Buffer型)  

使用ライブラリ
------
+   [libpng  ver1.6.15](http://www.libpng.org/pub/png/libpng.html "libpng")
+   [zlib  ver1.2.8](http://www.zlib.net/ "zlib")
+   [libjpeg ver9](http://www.ijg.org/ "libjpeg")

予定
------
*   拡大、縮小など機能を増やす
*   libjpeg-turboなど他のライブラリも追加
*   例外処理など追加

ライセンス
------
Copyright &copy; 2015 Katsuyoshi Hotta [@Savant_Cat](https://twitter.com/Savant_Cat)  
Licensed under the [MIT license][MIT]
[MIT]: http://www.opensource.org/licenses/mit-license.php

