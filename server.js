var http = require('http');
var exec = require('child_process').exec;
var fs = require("fs");

var port = 8090;

var server = http.createServer(function(request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
	
	var url = request.url;
	if (url === '/') {
		url = 'index.html';
	}
	
	url = url.replace("..","");
	
	var paths = [
		"./" + url
	];
	
	for (var i=0;i<paths.length;i++) {
		var path = paths[i];
		if (fs.existsSync(path)) {
			console.log("file " + path + " requested");
		
			fs.createReadStream(path).pipe(response);
			console.log("streaming now");
			return;
		}
	}
	
	if (url === "/favicon.ico") {
		response.end();
		return;
	}
	console.log("Processing " + url);
	var query = url.substr(url.indexOf("?")+1);
	if (url.indexOf("?") === -1) {
		query = "";
	}
	
	var queryElements = query.split("&");
	var params = {};
	for (var i=0;i<queryElements.length;i++) {
		var elem = queryElements[i];
		var elemArr = elem.split("=");
		if (elemArr.length >= 2) {
			params[elemArr[0]] = elemArr[1];
		}
	}
	
	console.log("Got params of " + JSON.stringify(params));
	
	var encodedParams = new Buffer(JSON.stringify(params)).toString('base64');
	var command = "php runScript.php \"" + encodedParams + "\"";
	console.log(command);
	exec(command,function(error, stdout, stderr) {
		if (error !== null) {
			console.log("" + error);
			response.writeHead(500);
		} else {
			response.writeHead(200);
			response.write(stdout);
		}
		console.log("Fin");
		response.end();
	});
	
	
}).listen(port);

console.log("Listening at " + port);