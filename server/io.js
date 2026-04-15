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
        //there is a way to make rooms, meaning 1v1s are possible (put 2 people in a room)
        //matchmaking is a whoooooooooole can of worms, bot games are a whoooooooooooole other can of worms
        //but we'll get there when we get there!
        //rudimentary matchmaking could be completely unbalanced first come first serve type beat

        //basic io stuff
        //.emit essentially sends us a pack of data with a name so our server handles it
        //.on is what we do when we get that thing back
    });

    return server;
};

module.exports = socketSetup();