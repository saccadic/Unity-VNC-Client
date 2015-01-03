#include <png.h>
#include "common.h";

class PngMaker
{
public:
	PngMaker();
	~PngMaker();

	bool init(void);
	bool png_free(void);

	void write_png_gray(size_t w, size_t h, char *file_name, unsigned char **image);
	void write_png_rgb(size_t w, size_t h, char *file_name, unsigned char **image);

	png_structp png_ptr;
	png_infop   info_ptr;
private:
	static void PngWriteCallback(png_structp  png_ptr, png_bytep data, png_size_t length);
	static void PngWriteCallback2(png_structp  png_ptr, png_bytep data, png_size_t length);
};

PngMaker::PngMaker()
{

}

PngMaker::~PngMaker()
{
	
}

bool PngMaker::init(void){
	png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
	if (png_ptr == NULL){
		return false;
	}
	info_ptr = png_create_info_struct(png_ptr);
	if (info_ptr == NULL) {
		png_destroy_write_struct(&png_ptr, (png_infopp)NULL);
		return false;
	}

	return true;
}

bool PngMaker::png_free(){
	if (png_ptr != NULL && info_ptr != NULL){
		png_destroy_write_struct(&png_ptr, &info_ptr);
		return true;
	}

	return false;
}


void PngMaker::write_png_gray(size_t w, size_t h, char *file_name, unsigned char **image)
{
	FILE *fp;

	init();

	fp = fopen(file_name, "wb");                            // まずファイルを開きます
	png_ptr = png_create_write_struct(                      // png_ptr構造体を確保・初期化します
		PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
	info_ptr = png_create_info_struct(png_ptr);             // info_ptr構造体を確保・初期化します
	png_init_io(png_ptr, fp);                               // libpngにfpを知らせます
	png_set_IHDR(png_ptr, info_ptr, w, h,          // IHDRチャンク情報を設定します
		8, PNG_COLOR_TYPE_GRAY, PNG_INTERLACE_NONE,
		PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);
	png_write_info(png_ptr, info_ptr);                      // PngMakerファイルのヘッダを書き込みます
	png_write_image(png_ptr, image);                        // 画像データを書き込みます
	png_write_end(png_ptr, info_ptr);                       // 残りの情報を書き込みます
	png_destroy_write_struct(&png_ptr, &info_ptr);          // ２つの構造体のメモリを解放します
	fclose(fp);                                             // ファイルを閉じます
	
	png_free();
}

void PngMaker::write_png_rgb(size_t w, size_t h, char *file_name, unsigned char **image)
{
	FILE *fp;

	init();

	fp = fopen(file_name, "wb");                            // まずファイルを開きます
	png_ptr = png_create_write_struct(                      // png_ptr構造体を確保・初期化します
		PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
	info_ptr = png_create_info_struct(png_ptr);             // info_ptr構造体を確保・初期化します
	png_init_io(png_ptr, fp);                               // libpngにfpを知らせます
	png_set_IHDR(png_ptr, info_ptr, w, h,          // IHDRチャンク情報を設定します
		8, PNG_COLOR_TYPE_RGB, PNG_INTERLACE_NONE,
		PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);
	png_write_info(png_ptr, info_ptr);                      // PngMakerファイルのヘッダを書き込みます
	png_write_image(png_ptr, image);                        // 画像データを書き込みます
	png_write_end(png_ptr, info_ptr);                       // 残りの情報を書き込みます
	png_destroy_write_struct(&png_ptr, &info_ptr);          // ２つの構造体のメモリを解放します
	fclose(fp);                                             // ファイルを閉じます

	png_free();
}
