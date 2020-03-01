const http = require("http");
const fs = require("fs");

const mimeType = {
  "html": "text/html",
  "css" : "text/css",
  "js" : "text/javascript"
}

http.createServer(function(request, response) {

  //ファイルのpathを取得
  let path = "";

  if(request.url === "/"){
    path = "./index.html";
  }
  else{
    path = "." + request.url;
  }

  //拡張子を取得
  let tmp = path.split(".");
  const fileExt = tmp[tmp.length-1];


  //ファイルを読み込んでレスポンス
	fs.readFile( path, "utf-8", function(error, data) {
		response.writeHead(200, { "Content-Type": mimeType[fileExt]});
		response.end(data,'utf-8');
  });

}).listen((port = 8000));
