const http = require('http');
const { Server } = require('socket.io');

let io;

//just make a room with the name they wanted
function handleRoomCreation(roomName, socket){
    socket.join(roomName); //should be more random, does not matter at all for now
    //might have some more stuff in here for like error checking or something
    socket.to(roomName).emit('created', roomName);
}

//if the room name they entered exists let em join it
//or else... uhhhhhhhhh how do i handle errors here
//emit it to the client that'll handle it
function handleRoomJoin(roomName, socket){
    if(io.of("/").adapter.rooms[roomName]){
        socket.join(roomName);
        socket.to(roomName).emit('joined', roomName);
    }
    else if(io.of("/").adapter.rooms[roomName].length === 2){ //room's full
        socket.emit('full')
    }
    else {
        socket.emit('nonexistent'); //i can use this for error handling
    }
}
//leave a room when we want to leave a room
//(this leaves every room except their personal one, but i don't really want to do that right now so uh nah)
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

        socket.on("create", (name) => handleRoomCreation(name, socket));

        socket.on('join', (name) => handleRoomJoin(name, socket));

        socket.on('leave', handleRoomLeave(socket));


    });

    return server;
};

module.exports = socketSetup();