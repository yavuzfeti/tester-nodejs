/* var http = require("http");
//const http = require("http");
var port = 8080;

http.createServer(function(req, res){

    if (req.url == "/admin")
    {
        res.writeHead(200,{"Content-Type":"text/html"});
        res.write("Merhaba admin");
        res.end("bitti");
    }
    else if (req.url == "/")
    {
        res.writeHead(200,{"Content-Type":"text/html"})
        res.write("Ana Sayfa");
    }
    else if (req.url == "/users")
    {
        res.writeHead(200,{"Content-Type":"application/json"});
        res.write(JSON.stringify({"name":"ahmet","surname":"topal"}));
    }

    res.end();

}).listen(port);

console.log("Sunucu başladı " + port); */

import express from "express";
import usersDataRouter from "./usersRouters/usersDataRouter.js";
import postgresClient from "./config/db.js"
import userRouter from "./usersRouters/userRouter.js"
import imageRouter from "./imageRouters/imageRouter.js"
import logger from "./middleWares/logger.js"
import error_h from "./middleWares/errorHandling.js"

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger_output.json', 'utf-8'));

const server = express();
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(express.json());
server.use(logger);
server.use("/users",userRouter)
server.use("/images",imageRouter)
server.use("/usersData",usersDataRouter);

const port = process.env.PORT || 8080

server.get("/" , (req,res) =>
{
    res.send("Anasayfa");
});

//server.use(error_h);

server.listen(port,() =>
{
    console.log("http://localhost:"+port+" adresi başlatıldı.");
    postgresClient.connect(err => {
        if(err)
        {
            console.log("Hata oluştu",err.stack)
        }
        else
        {
            console.log("Veri tabanına bağlanıldı")
        }
    })
});