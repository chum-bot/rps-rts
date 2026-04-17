const http = require('http');
const { Server } = require('socket.io');

let io;

//just make a room with the name they wanted
function handleRoomCreation(roomName, socket){
    socket.join(roomName); //should be more random, does not matter at all for now
    //might have some more stuff in here for like error checking or something
}

//if the room name they entered exists let em join it
function handleRoomJoin(roomName, socket){
    if(io.of("/").adapter.rooms[roomName]){
        socket.join(roomName);
    }
}
//leave a room when we want to leave a room
function handleRoomLeave(socket) {
    socket.rooms.forEach(room => {
        if(room === socket.id) return;
        socket.leave(room);
    });
}

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
        
        //ideally for the game itself i would like to make a singleplayer mode, if i ever release this game it will have a singleplayer mode
        //but for the purposes of this project i don't think i can do only that, bc it'd need information to be available to a subset of users

        //basic io stuff
        //.emit essentially sends us a pack of data with a name so our client or server can handle it
        //.on is what we do when we get that thing back
        //and both the client and the server can use these

        //so what do we want?
        //we're not going to have a matchmaking system, it'll be private rooms for now
        //two buttons, create room and join room
        //create room lets you make a room with an 8 digit room code
        //join room lets you enter a room code to join with
        //probably also a leave room button as well

        socket.on("create", (name) => handleRoomCreation(name, socket));

        socket.on('join', (name) => handleRoomJoin(name, socket));

        socket.on('leave', handleRoomLeave(socket));


    });

    return server;
};

module.exports = socketSetup();