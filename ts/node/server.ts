/**
 * Created by Giles on 06/02/2016.
 */

import http = require("http");
import fs = require("fs");
import path = require("path");

import {ServerResponse} from "http";
import {ServerRequest} from "http";

function serveIndexPage( request: ServerRequest, response: ServerResponse ): void {
    response.writeHead(200, {'Content-Type':"text/html"});
    const filePath: string = path.join( process.cwd(), "index.html" );

    fs.readFile( filePath, (err: NodeJS.ErrnoException, data: Buffer) => {
        if(err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();
            return;
        }

        console.log(`Serving ${filePath} for request ${request.url}`);

        response.write(data, "binary");
        response.end();

    } );
}

function serveTimeStamps( request: ServerRequest, response: ServerResponse ): void {
    console.log(`Serving timestamps for request ${request.url}`);
    response.writeHead(200, {'Content-Type': "text/plain"});
    response.write( "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>Node JS Long Polling</title></head><body><H1>Initial Content</H1>");


    const interval = setInterval( () => {
        console.log("more");
        response.write( "<span>More</span>");
    }, 50 );

    setTimeout(() => {
        clearInterval(interval);
        console.log("ending");
        response.write( "<p>Ending...</p>");
        response.write( "</body></html>");

        response.end();
    }, 4000 )
}

function handleRequest(request: ServerRequest, response: ServerResponse): void {
    switch(request.url){
        case "/":
            serveIndexPage(request,response);
            break;
        case "/timestamps":
            serveTimeStamps(request,response);
            break;
        default:
            console.log( `default response for url ${request.url}` );
            response.end(`it Works ${request.url}`);
    }
}
var server: http.Server = http.createServer(handleRequest);

server.listen(5678, function () {
    console.log("Server listening on port 5678...");
    console.log( `Root folder is ${process.cwd()}` );
});