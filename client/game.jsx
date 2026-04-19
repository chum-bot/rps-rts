//"And this! This is the game!"
//god where do i start... i'm a little frazzled

const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const socket = io();

//let's just list what i want to do and what i need to be able to do that

//to begin a game, i need each player to create a Player for themselves, using the account they're signed into
//meaning i need a current account looker, i can GET to account for that
async function getAccount(){
    const response = await fetch('/account');
    const data = await response.json();
    if(!data) {
        helper.handleError('Error retrieving account');
        return false;
    }
    return data.accountId;
}

async function handlePlayer(e){
    const accId = getAccount();
    //i then call a POST to createPlayer, they send that back and i work with that for the games themselves
    helper.sendPost(e.target.action, {account: accId});
    //now the player exists, with their blank hand and stuff
    //so later i can GET that player for use with the game
    return false;
}

//make the socket room
function createRoom(e) {
    e.preventDefault();
    const roomName = e.target.querySelector('#roomName').value;
    if(!roomName){
        helper.handleError('A room name is required');
    }
    socket.emit('create', roomName);
}

//if both room members have Players i should only need to call emit once on each of them, so they each emit their own Player to the room
//oh something i should do is make the room forms

//this room create form should, on submit:
//- create the Player for the room owner (? maybe we want to have a separate Start Game button for that one. yeah that'd make more sense)
//- emit the room name to the create room event via the form itself (seen in createRoom function above)
//- emit the account name in the room (so everybody sees it)
function CreateRoomForm(props){
    return( //method/action aren't really needed for this one, since nothing is being created in the server aside from the room which socket handles
        <form action="" id="createRoom" onSubmit={(e) => createRoom(e)}>
            <label htmlFor="roomName">Room Name: </label>
            <input type="text" name="roomName" id="roomName"/>
            <p id="inputInfo">This is the name people will enter to join your room.</p>
        </form>
    );
};

function Room (props){

}

function init() {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);
};

window.onload = init;