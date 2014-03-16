var http = require('http');
var lame = require('lame');
var speaker = require('speaker');

var options = {
	host: 'api.sndcdn.com',
	port: 80,
	path: '/i1/tracks/119009091/streams?client_id=798808c14d25fc803a4f484e821ca63a'
};

http.get(options, function(res) {
	var response = "";

	res.on("data", function(chunk) {
		response += chunk;
	});

	res.on("end", function() {
		var streamLocation = JSON.parse(response).http_mp3_128_url;
		streamLocation = streamLocation.replace("http://", "");
		decodeAndPlay(streamLocation);
	});
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});

function decodeAndPlay(streamLoc) {
	console.log(streamLoc);

	var options = {
	host: streamLoc.substring(0, streamLoc.indexOf("/")),
	port: 80,
	path: streamLoc.substring(streamLoc.indexOf("/"))
	};

	http.get(options, function(res) {
		var audio = "";

		res.pipe(new lame.Decoder)
		   	.on('format', console.log)
		   	.pipe(new speaker);

	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}
