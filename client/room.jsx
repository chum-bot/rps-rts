const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const socket = io();

//let's just list what i want to do and what i need to be able to do that

//make the socket room
function createRoom(e) {
    e.preventDefault();
    const roomName = e.target.querySelector('#roomName').value;
    if(!roomName){
        helper.handleError('A room name is required');
    }
    socket.emit('create', roomName); //let io know it's gotta create the room
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
        </form>
    );
};

function Menu(props){
    return (
        <div>
            <h1 id="title">DRPS*</h1>
            <h4 id="subtitle">*doubles rock paper scissors</h4>
            <button id="createRoom" onClick={(e) => {dynamicListener(e, <CreateRoomForm/>)}}>Create Room</button>
            <button id="joinRoom">Join Room</button>
        </div>
    )
}

//we'll have io emit the account name of each of the sockets in the room to the room itself
//i think i have a way to do that? i can have each user emit their account, and then io can just 
//show the thingies right there on room join once it has them
function Room (props){
    //when the room is created/a user joins the room, we want to give back the name
    //and the account that created it, so we can use that in the display and for the players themselves
    let room = "";
    socket.on('created', async (roomName) => { 
        room = roomName;
        const account = await helper.getAccount(); //i think imma send this back to io with a created event
        socket.emit('created', {roomName, account})
    });

    return (
        <div>
            <h1 id="roomTitle">Room {room}</h1>
            <button id="startGame">Start Game</button>
        </div>
    );
}

function dynamicListener(e, component) {
    const root = createRoot(document.getElementById('room'));
    console.log("hello?");
    e.preventDefault();
    root.render(component);
    return false;
}

function init() {
    const root = createRoot(document.getElementById('room'));
    root.render(<Menu/>);
};

window.onload = init;