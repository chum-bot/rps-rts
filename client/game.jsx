const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const socket = io();

//let's just list what i want to do and what i need to be able to do that

//make the socket room
async function createRoom(e) {
    e.preventDefault();
    const roomName = e.target.querySelector('#createName').value;
    if(!roomName){
        helper.handleError('A room name is required');
    }
    socket.emit('create', roomName, await helper.getAccount()); //let io know it's gotta create the room
    const root = createRoot(document.getElementById('game')); //again i'm recreating the root just so i can re-render, this does not seem optimal...
    root.render(<Room/>);
}
//join the socket room
async function joinRoom(e) {
    e.preventDefault();
    const roomName = e.target.querySelector('#joinName').value;
    if(!roomName){
        helper.handleError('A room name is required');
    }
    socket.emit('join', roomName, await helper.getAccount()); //let io know it's gotta add this socket to the room
    const root = createRoot(document.getElementById('game')); //again i'm recreating the root just so i can re-render, this does not seem optimal...
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
            <label htmlFor="createName">Room Name: </label>
            <input type="text" name="createName" id="createName"/>
            <p id="inputInfo">This is the name people will enter to join your room.</p>
            <input type="submit" value="Create Room"/>
        </form>
    );
};
function JoinRoomForm(props){
    return(
        <form action="" id="joinRoom" onSubmit={(e) => joinRoom(e)}>
            <label htmlFor="joinName">Room Name: </label>
            <input type="text" name="joinName" id="joinName"/>
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
//creates the current player it needs to, with the accounts/sockets in the room
//then sends an emit request to socket to check for each socket account's existence
//and if both are there, load the game page for both players
async function startGame(e){
    e.preventDefault();
    
    //i GET the current account
    const account = await helper.getAccount();
    console.log(account)
    //i then call a POST to createPlayer, they send that back and i work with that for the games themselves
    await helper.sendPost('/players', {account: account[0]._id});

    //the player now exists for this account
    //which then means the Game can get the player for display
    
}
//we'll have io emit the account name of each of the sockets in the room to the room itself
//i think i have a way to do that? i can have each user emit their account, and then io can just 
//show the thingies right there on room join once it has them
function Room (props){
    //when the room is created/a user joins the room, we want to give back the name
    //and the account that created it, so we can use that in the display and for the players themselves
    let [room, setRoom] = useState('');
    let [accounts, setAccounts] = useState([]);

    socket.on('created', async (roomName, account) => {
    
        setRoom(roomName);  
        //react is kind of annoying with this icl
        //why can't i just accounts.push why do i have to setAccounts and make a whole other array for that
        setAccounts([
            ...accounts,
            account
        ]);
    });

    socket.on('joined', async (roomName, socketAccs) => {
        //we're gonna get the other account and list its name here
        //because look! there it is right there! as a parameter!
        //actually changed this so io is directly sending me an array with the accounts in the room here
        setRoom(roomName);
        setAccounts(socketAccs);
    });
    //now we have an array with both accounts

    return (
        <div>
            <h1 id="roomTitle">Room {room}</h1>
            <h2 id="users">Players:</h2>
            {accounts.map((acc) => <p className='accountName'>{acc.username}</p>)}
            <button id="startGame" onClick={startGame}>Start Game</button>
        </div>
    );
}
//GAME.JSX
//this shall hold all of our actual game components and functionality
//I SHOULD REALLY GET AT LEAST THIS WORKING FOR THE MILESTONE
//this will take a lot longer so uh nah not right now

//so what do we need
//a Player for each Account (handled in the handlePlayer function, and getAccount handles... getting an account)
//we need the visual display of what players are doing, which has: 
//two hands, filled with information that is contained within Player
//i would want to make a hand component probably, just to make things a bit easier?
//we need the functionality of clicking a hand, selecting a throw, and selecting an opposing hand to target
//but in order to do that we need the hands themselves
//and in order to do that we need the player
//which we have! but for one player.
//noooooo ok wait
//alright in order to actually manipulate the values i don't need to have them specifically send back the hand do i?
//i can have the object they return send back their throw, and the target of either left or right!
//because i have them listed as left and right right???
//no i would still need the other hand anyway, to update its info
//BUT WAIT CAN I GET IT FROM THE SERVER SIDE?
//i'm thinking right
//the only connection i have to the other player is via the socket right
//what does the socket have in it tho? whatever i send to it? but i want to send server info BACK to it.

function Game(props) {
    const [player, setPlayer] = useState({});
    const [opponent, setOpponent] = useState({});

    //this will update the visual of the player by getting it from the server when their data is changed (damage is taken or something)
    useEffect(() => {
        async function loadPlayer() {
            const response = await fetch('/player');
            const data = response.json();
            setPlayer(data.player);
        }
        loadPlayer();
    }, [props.updatePlayer]);
    //i have the other socket holding the other account (and therefore the other player) in io
    //so i must simply retrieve that account id by getting it from the other socket in the room
    //and i can get that by checking the only room the socket should be in (minus its personal one)
    //and sending back the *other* id (we already have our own id)
    //so we can setOpponent by getting that other player
    socket.emit('game time');
    socket.on('enemy', async (enem) => {
        const response = await fetch(`/player?accountId=${enem}`)
        const data = response.json();
        setOpponent(data.player);
    })
    return (
        <div>
            <h1 id="theGame">This is the Game!</h1>
            <h2 id="playerText">Player</h2>
            <div id="playerInfo">
                <p id="playerLeft">🫲 {player.left.health}</p>
                <p id="playerRight">🫱 {player.right.health}</p>
            </div>
        </div>
    )
}

function dynamicListener(e, component) {
    //but i'm recreating the root each time with this no?
    //suboptimal, but i can't do it with init because the buttons are dynamic
    //and i want them to be dynamic sooooo idk how else i'd do this for right now
    const root = createRoot(document.getElementById('game'));
    e.preventDefault();
    root.render(component);
    return false;
}

function init() {
    const root = createRoot(document.getElementById('game'));
    root.render(<Menu/>);
};

window.onload = init;