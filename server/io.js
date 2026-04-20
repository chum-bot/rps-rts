const http = require('http');
const { Server } = require('socket.io');

let io;

//just make a room with the name they wanted
function handleRoomCreation(roomName, account, socket){
    socket.join(roomName); //should be more random or code-based or something, does not matter at all for now i just want functionality
    socket.data.account = account;
    io.to(roomName).emit('created', roomName, socket.data.account[0].username);
}

//if the room name they entered exists let em join it
//or else... uhhhhhhhhh how do i handle errors here
//emit it to the client that'll handle it

//okay so.
//here is where i would like to have the accounts recorded and stored for later use
//because that is the key to all of this
//if i simply store the accounts that enter this room, i can have my client read the active Player attached to the other account for opponent data
//i send a fetch for that, my endpoint exists for that
//when a user joins the room, i take their account information (from the client sending a get to the account table) and emit it here
//to be placed into a room-exclusive array or object that will have both accounts in it.
//i cannot associate this with socket ids, because socket ids are regenerated on refresh
//after that, i now have an array with both accounts in it that i can send back to the client for player handling
//so that the player's client can now see the other account, and therefore the other player that is created
//because the player is associated with the account it's with, and it has an active tag that i can check to not mix it up with battle-logged player entities.
//boom? let's try it.
//that room-exclusive array... how am i going to make that?
//can i just... make a let roomAccounts = [] and populate it from the top??? that seems super wrong somehow
//YO I THINK I CAN?
//nah but "room-exclusive" definitely means i gotta make a unique array for each room.
//meaning i cannot have a fully top-level array that every room change populates, because then every room is populating the same array and it no work.
//maybe i store it in an object instead?
//with the room also being there so that each room reads and populates the thing it should be reading and populating?
//but then i have to have that object in a place that both
//wait sockets have an arbitrary data param
//can't i just put the account into their current socket connection once they log in
//and then since these have access to all of the sockets in a room it can just return the accounts they have in them
//bing bang boom account access? wow how wonderful. how stunning how amazing how stellar.
//maybe i do stuff when the login goes through that gets their socket and places it in there

function handleRoomJoin(roomName, account, socket){
    const roomToJoin = io.of("/").adapter.rooms.get(roomName);
    if(roomToJoin){
        socket.join(roomName);
        socket.data.account = account;
        io.to(roomName).emit('joined', roomName, socket.data.account[0].username);
    }
    else if(roomToJoin.size === 2){ 
        socket.emit('full'); //room's full
    }
    else {
        socket.emit('nonexistent'); //room's nonexistent
    }
}
//leave a room when we want to leave a room
//(this leaves every room except their personal one, because i don't want to implement checking for an individual room)
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
        //if they are logged in i want to put that login info into the socket's account data
        //which gets around socket ids not persisting on refresh because if they're logged in they should stay logged in on refresh
        //buuuuuuut i don't know how i would get socket to read the logins
        //each request has a session id right? stored in redis?
        //what if when a socket connects i read that? idk how i would read that tho
        //also they would not stay in a room because socket ids are cleared on refresh
        //so uh yeah nah

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        //so what do we want?
        //we're not going to have a matchmaking system, it'll be private rooms for now
        //two buttons after logging in, create room and join room
        //(and recent battles but that's separate from the game function itself)
        //create room lets you make a room with whatever name
        //join room lets you enter a room code to join with
        //probably also a leave room button as well

        //a way i can get the other player's info is when they join the room or something happens/changes, i just emit it to the room
        //so everybody sees it ez wow amazing
        //but how do i emit it to the room if i don't have it?
        //i can import my other server stuff can't i?
        //if a player has been created already for the account that has joined the room (it will be when the game starts)
        //but with socket all i have is the socket id, how am i gonna get the account with that?
        //i have the redis req.session right
        //and that's put into account right
        //well that would be from the client request, which i can send into the server AND ASSOCIATE THE SOCKET WITH THE ACCOUNT ON CONNECTION!
        //IF THE ACCOUNT IS ADDED ON CONNECTION (long as they're signed in), ANY ROOM THEY ENTER WILL HAVE THE ACCOUNT INFO IN IT!
        socket.on("create", (name, acc) => handleRoomCreation(name, acc, socket));

        socket.on('join', (name, acc) => handleRoomJoin(name, acc, socket));

        socket.on('leave', () => handleRoomLeave(socket));
    });

    return server;
};

module.exports = socketSetup;