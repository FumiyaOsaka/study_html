const http = require("http"),
    fs = require("fs");

const port = 8080;

const logger = fun => console.log(`[${new Date()}] ${fun.call(null)}`);

const server = http.createServer((request, response) => {
    request.setEncoding("utf-8");
    let body = '';
    
    request.on("data", chunk => {
        body += chunk;
    })


    request.on("end", () => {
        if(body){
            let result = {};

            const parameters = body.split("&");
        
            for( var i = 0; i < parameters.length; i++ )
            {
                // パラメータ名とパラメータ値に分割する
                var element = parameters[ i ].split( '=' );
        
                var paramName = decodeURIComponent( element[ 0 ] );
                var paramValue = decodeURIComponent( element[ 1 ] );
        
                // パラメータ名をキーとして連想配列に追加する
                 if(result[ paramName ]){
                    result[ paramName ] = result[ paramName ] + "," + paramValue
                 } else{
                    result[ paramName ] = paramValue;
                 }
            }
        
            fs.readFile(`.${request.url}`,"utf-8",(error,html) => {
                if(error) throw error;
                response.writeHead(200,{'Content-Type':'text/html'});
                Object.keys(result).forEach(key => {
                    html = html.replace(`@${key}`,result[key]);
                });
                response.write(html);
                response.end();
            });
        }
    })

});

server.on("request", (request, response) => {
    const socket = request.socket;
    logger(() => `client connected[${socket.remoteAddress}:${socket.remotePort}] URL[${request.url} ${request.httpVersion}] Method[${request.method}]`);
});

server.listen(port);

logger(() => "Server startup");

/*
server.close();
logger(() => "Server shutdown");
*/