const http = require('http');

const requestListener = function (req, res) {
  res.writeHead(200);
  res.write('<h1>Hello, World!</h1>');
  res.end();
}

const server = http.createServer(requestListener);
console.log("Listening on 8080")
server.listen(8080);