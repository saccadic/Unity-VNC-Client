#include <png.h>

class PngEncoder {
public:
	PngEncoder(unsigned char *d, int w, int h);
	~PngEncoder();

	unsigned char *data;
	         char *png;
	unsigned int   png_len, mem_len;
			 int   width, height;

	png_structp png_ptr;
	png_infop   info_ptr;

	void Encode();
	const char *get_png() const;
	int get_png_len() const;
private:
	static void PngWriteCallback(png_structp png_ptr, png_bytep data, png_size_t length);
};

PngEncoder::PngEncoder(unsigned char *d, int w, int h){
	width   = w;
	height  = h;
	data    = d;
	png     = NULL;
	png_len = 0;
	mem_len = 0;
}

PngEncoder::~PngEncoder() {
	free(png);
}

void PngEncoder::PngWriteCallback(png_structp png_ptr, png_bytep data, png_size_t length){
	PngEncoder *p = (PngEncoder *)png_get_io_ptr(png_ptr);

	if (!p->png) {
		p->png = (char *)malloc(sizeof(p->png) * 41); // from tests pngs are at least 41 bytes
		if (!p->png)
			throw "malloc failed in png (PngEncoder::png_chunk_producer)";
		p->mem_len = 41;
	}

	if (p->png_len + length > p->mem_len) {
		char *new_png = (char *)realloc(p->png, sizeof(char)*p->png_len + length);
		if (!new_png)
			throw "realloc failed in png (PngEncoder::png_chunk_producer).";
		p->png = new_png;
		p->mem_len += length;
	}
	memcpy(p->png + p->png_len, data, length);
	p->png_len += length;
}

void PngEncoder::Encode(){
	png_bytep *row_pointers;
	try {
		png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
		if (png_ptr == NULL){
			throw "png_create_write_struct failed.";
		}
		info_ptr = png_create_info_struct(png_ptr);
		if (info_ptr == NULL) {
			png_destroy_write_struct(&png_ptr, (png_infopp)NULL);
			throw "png_create_info_struct failed.";
		}

		png_set_IHDR(png_ptr, info_ptr, width, height, 8,
			PNG_COLOR_TYPE_RGB,
			PNG_INTERLACE_NONE,
			PNG_COMPRESSION_TYPE_DEFAULT,
			PNG_FILTER_TYPE_DEFAULT);

		png_set_write_fn(png_ptr, (void *)this, PngWriteCallback, NULL);
		png_write_info(png_ptr, info_ptr);
		png_set_invert_alpha(png_ptr);

		row_pointers = (png_bytep *)malloc(sizeof(png_bytep) * height);
		if (!row_pointers)
			throw "malloc failed in node-png (PngEncoder::encode).";

		for (int i = 0; i < height; i++)
			row_pointers[i] = data + 3 * i*width;

		png_write_image(png_ptr, row_pointers);
		png_write_end(png_ptr, NULL);
		png_destroy_write_struct(&png_ptr, &info_ptr);
		free(row_pointers);
	}
	catch (const char *err) {
		png_destroy_write_struct(&png_ptr, &info_ptr);
		free(row_pointers);
	}
}

const char *PngEncoder::get_png() const {
	return png;
}

int PngEncoder::get_png_len() const {
	return png_len;
}