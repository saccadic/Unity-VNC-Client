#include <node.h>
#include <node_buffer.h>
#include "jpegEncoder.h"
#include "PngEncoder.h"


using namespace v8;
using namespace node;

Handle<Value> png_to_memory(const Arguments& args) {
	HandleScope scope;
	int w, h;
	int len;

	w = args[0]->Int32Value();
	h = args[1]->Int32Value();

	Local<Object>	bufferObj    = args[2]->ToObject();
	char*			bufferData   = Buffer::Data(bufferObj);
	size_t          bufferLength = Buffer::Length(bufferObj);

	PngEncoder png((unsigned char*)bufferData, w, h);
	png.Encode();
	
	len = png.get_png_len();
	Buffer *buf = Buffer::New(len);
	memcpy(Buffer::Data(buf->handle_),png.get_png(),len);

	return scope.Close(buf->handle_);
}

Handle<Value> jpeg_to_memory(const Arguments& args) {
	HandleScope scope;
	int w, h, i_c, q;
	int len;

	w   = args[0]->Int32Value();
	h   = args[1]->Int32Value();
	i_c = args[2]->Int32Value();
	q   = args[3]->Int32Value();

	Local<Object>	bufferObj = args[4]->ToObject();
	char*			bufferData = Buffer::Data(bufferObj);
	size_t          bufferLength = Buffer::Length(bufferObj);

	jpegEncoder jpg;
	jpg.SetOption(w, h, i_c, q);
	jpg.Encode((unsigned char*)bufferData);

	len = jpg.get_jpeg_len();
	Buffer *buf = Buffer::New(len);
	memcpy(Buffer::Data(buf->handle_), jpg.get_jpag() , len);

	return scope.Close(buf->handle_);
}


void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("write_png_to_memory"), FunctionTemplate::New(png_to_memory)->GetFunction());
	exports->Set(String::NewSymbol("write_jpag_to_memory"), FunctionTemplate::New(jpeg_to_memory)->GetFunction());
}

NODE_MODULE(NodeImageGenerator, init)