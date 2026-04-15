const http = require('http');
const { Server } = require('socket.io');

let io;

function socketSetup(app) {
    const server = http.createServer(app);
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log("user connected");

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        //OKAY SO
        //WE CAN CREATE CUSTOM EVENTS HERE
        //this is where we handle what the socket does
        //so like all of our game stuff right? all of our interaction?
    });

    return server;
};

module.exports = socketSetup();