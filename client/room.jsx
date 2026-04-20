const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const socket = io();

//let's just list what i want to do and what i need to be able to do that

//make the socket room
async function createRoom(e) {
    e.preventDefault();
    const roomName = e.target.querySelector('#roomName').value;
    if(!roomName){
        helper.handleError('A room name is required');
    }
    socket.emit('create', roomName, await helper.getAccount()); //let io know it's gotta create the room
    const root = createRoot(document.getElementById('room')); //again i'm recreating the root just so i can re-render, this does not seem optimal...
    root.render(<Room/>);
}
//join the socket room
function joinRoom(e) {
    e.preventDefault();
    const roomName = e.target.querySelector('#roomName').value;
    if(!roomName){
        helper.handleError('A room name is required');
    }
    socket.emit('join', roomName); //let io know it's gotta add this socket to the room
    const root = createRoot(document.getElementById('room')); //again i'm recreating the root just so i can re-render, this does not seem optimal...
    root.render(<Room/>);
}

//if both room members have Players i should only need to call emit once on each of them, so they each emit their own Player to the room
//oh something i should do is make the room forms

//this room create form should, on submit:
//- emit the room name to the create room event via the form itself (seen in createRoom function above)
//- show the account name in the room (i think i want a separate Room component for that)
function CreateRoomForm(props){
    return( //method/action aren't really needed for this one, since nothing is being created in the server aside from the room which socket handles
        <form action="" id="createRoom" onSubmit={(e) => createRoom(e)}>
            <label htmlFor="roomName">Room Name: </label>
            <input type="text" name="roomName" id="roomName"/>
            <p id="inputInfo">This is the name people will enter to join your room.</p>
            <input type="submit" value="Create Room"/>
        </form>
    );
};
function JoinRoomForm(props){
    return(
        <form action="" id="joinRoom" onSubmit={(e) => joinRoom(e)}>
            <label htmlFor="roomName">Room Name: </label>
            <input type="text" name="roomName" id="roomName"/>
            <p id="inputInfo">Enter a room name to join.</p>
            <input type="submit" value="Join Room"/>
        </form>
    );
};

function Menu(props){
    return (
        <div>
            <button id="createRoom" onClick={(e) => {dynamicListener(e, <CreateRoomForm/>)}}>Create Room</button>
            <button id="joinRoom" onClick={(e) => {dynamicListener(e, <JoinRoomForm/>)}}>Join Room</button>
        </div>
    )
}

//we'll have io emit the account name of each of the sockets in the room to the room itself
//i think i have a way to do that? i can have each user emit their account, and then io can just 
//show the thingies right there on room join once it has them
function Room (props){
    //when the room is created/a user joins the room, we want to give back the name
    //and the account that created it, so we can use that in the display and for the players themselves
    let [room, setRoom] = useState('');
    let [accounts, setAccounts] = useState([]);

    let accounts = []; //i don't want to update this dynamically

    socket.on('created', async (roomName, account) => {
    
        setRoom(roomName);
        //nono because i have the ability to access my socket from here
        //the function is io, so maybe i just have to use the same io syntax to get it?
        //i might have to send it up from server tho... ykw that's just easier imma do that
        setAccount(account);
    });

    socket.on('joined', async (account) => { //don't need the name to be sent back
        //we're gonna get the other account and list its name here
        //because look! there it is right there! as a parameter!
    });

    return (
        <div>
            <h1 id="roomTitle">Room {room}</h1>
            <h2 id="users">Players:</h2>
            
            <p id="account">{account}</p>
            <button id="startGame">Start Game</button>
        </div>
    );
}

function dynamicListener(e, component) {
    //but i'm recreating the root each time with this no?
    //suboptimal, but i can't do it with init because the buttons are dynamic
    //and i want them to be dynamic sooooo idk how else i'd do this for right now
    const root = createRoot(document.getElementById('room'));
    e.preventDefault();
    root.render(component);
    return false;
}

function init() {
    const root = createRoot(document.getElementById('room'));
    root.render(<Menu/>);
};

window.onload = init;