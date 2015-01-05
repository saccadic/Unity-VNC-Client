{
	'targets': [
		{
			'target_name' : 'NodeImageToBuffer',
			'sources' : [ 
				'./src/main.cc',
				'./src/PngEncoder.h',
				'./src/jpegEncoder.h',
			],
			'Libraries' : [
				'-l<./src/lib/x86/libpng16.lib>',
				'-l<./src/lib/x86/zlib.lib>',
				'-l<./src/lib/x86/jpeg.lib>',				
			],
		},
	],
}