#include <jpeglib.h>



class jpegEncoder {
public:
	jpegEncoder();
	~jpegEncoder();
	struct jpeg_compress_struct cinfo;
	struct jpeg_error_mgr jerr;

	void SetOption(int w, int h, int i_c, int q);
	void Encode(unsigned char *data);
	const char *get_jpag() const;
	int get_jpeg_len() const;
private:
	unsigned char *jpg = NULL;
	JSAMPARRAY img;
	unsigned long buf_len = 0;
	unsigned int  jpeg_len;
	int i ,j ,offset;
};

jpegEncoder::jpegEncoder(){

}

jpegEncoder::~jpegEncoder(){
	free(jpg);
	free(img);
}

void jpegEncoder::SetOption(int w, int h, int i_c, int q){
	cinfo.err = jpeg_std_error(&jerr);
	jpeg_create_compress(&cinfo);
	jpg = (unsigned char*)malloc(sizeof(unsigned char)*w*h * 3);
	buf_len = sizeof(unsigned char)*w*h*3;
	jpeg_mem_dest(&cinfo, &jpg, &buf_len);
	cinfo.image_width  = w;
	cinfo.image_height = h;
	switch (i_c){
	case 3:
		cinfo.input_components = 3;
		cinfo.in_color_space = JCS_RGB;
		break;
	case 1:
		cinfo.input_components = 1;
		cinfo.in_color_space = JCS_GRAYSCALE;
	default:
		break;
	}
	jpeg_set_defaults(&cinfo);
	jpeg_set_quality(&cinfo, q, TRUE);
}

void jpegEncoder::Encode(unsigned char *data){
	jpeg_start_compress(&cinfo,TRUE);
	img = (JSAMPARRAY)malloc(sizeof(JSAMPARRAY)*cinfo.image_height);
	offset = 0;
	for (i = 0; i < cinfo.image_height; i++) {
		img[i] = (JSAMPROW)malloc(sizeof(JSAMPLE) * 3 * cinfo.image_width);
		for (int j = 0; j < cinfo.image_width; j++) {
			img[i][j * 3 + 0] = data[offset++];
			img[i][j * 3 + 1] = data[offset++];
			img[i][j * 3 + 2] = data[offset++];
		}
	}
	jpeg_write_scanlines(&cinfo,img,cinfo.image_height);
	jpeg_finish_compress(&cinfo);
	jpeg_destroy_compress(&cinfo);
}

const char *jpegEncoder::get_jpag() const {
	return (char *)jpg;
}

int jpegEncoder::get_jpeg_len() const {
	return buf_len;
}
