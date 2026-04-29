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
async function startGame(e, roomName){
    e.preventDefault();
    
    //i GET the current account
    const account = await helper.getAccount();
    //i then call a POST to createPlayer, they send that back and i work with that for the games themselves
    await helper.sendPost('/players', {account: account._id});

    //i get the player that was just made to send it back
    const player = await fetch('/players'); 
    const playerData = await player.json();
    //the player now exists for this account
    //which then means the Game can get the player for display
    //let io know a player is ready
    //i'm throughlining the account username too
    socket.emit('ready', roomName);
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

    //if both players are ready
    //i'm gonna load in both player entities here
    socket.on('ready', async (accounts) => {
        const player = await loadPlayer();
        const playerInfo = accounts.find((acc) => acc.id === player.account);
        const enemInfo = accounts.find((acc) => acc.id !== player.account);
        console.log(enemInfo)
        const enemy = await loadOpponent(enemInfo.id);
        const root = createRoot(document.getElementById('game'));
        root.render(<Game player={player} username={playerInfo.username} enemy={enemy} enemyUsername={enemInfo.username}/>);
    })
    
    //now we have an array with both accounts

    return (
        <div>
            <h1 id="roomTitle">Room {room}</h1>
            <h2 id="users">Players:</h2>
            {accounts.map((acc) => <p className='accountName'>{acc.username}</p>)}
            <button id="startGame" onClick={(e) => startGame(e, room)}>Start Game</button>
        </div>
    );
}

async function loadPlayer() {
    const response = await fetch('/players');
    const data = await response.json();
    return data.player; //it gives you an array
}
async function loadOpponent(enem) {
    const response = await fetch(`/players?accountId=${enem}`);
    const data = await response.json();
    return data.player; //it gives you an array
}

//all of these would ideally be different pages and i would have the socket thingy that attaches to account implemented but
//i really just wanna get the main game working before i look into that
//and that would still break room functionality bc the original socket is what's joining the room anyway
function MainGame(props) {
    const [playerUpdate, setPlayerUpdate] = useState(false); //gonna use this for damage updating
    const [player, setPlayer] = useState(props.player);
    const [opponent, setOpponent] = useState(props.enemy);
    const [playerUsername, setPlayerUsername] = useState(props.username);
    const [opponentUsername, setOpponentUsername] = useState(props.enemyUsername);

    //in the startGame function that runs, i create the player and emit ready to the socket
    //then on ready (also in the room), i render game in the root
    //i could pass the player created to the ready emit, have io send it back as is, pass it through game as a prop, pass that through maingame as a prop, and then access it via props.player
    //so it takes a throughline across all of my room stuff 
    
    //this will update the visual of the player by getting it from the server when their data is changed (damage is taken or something)
    //we will have a separate function that calls on the existing damageHand func to deal our damage
    useEffect(async () => {
        setPlayer(await loadPlayer());
        setOpponent(await loadOpponent(opponent.account));
        const playAcc = await helper.getAccount();
        const oppAcc = await helper.getAccount(opponent.account);
        console.log(props.enemy)
        setPlayerUsername(playAcc.username)
        setOpponentUsername(oppAcc.username)
    }, [props.updatePlayers])

    //I GOT IT oh my GOD i hate react
    //ok now i gotta actually deal damage!
    //i have a damage handler already, i just have to make a way to select it
    //and when i do that i'll send a request over

    //i have the other socket holding the other account (and therefore the other player) in io
    //so i must simply retrieve that account id by getting it from the other socket in the room
    //and i can get that by checking the only room the socket should be in (minus its personal one)
    //and sending back the *other* id (we already have our own id)
    //so we can setOpponent by getting that other player
    //this doesn't need to be in useEffect bc it'll run when the socket asks it to run

    return (
        <div>
            <h1 id="theGame">This is the Game!</h1>
            <div id="playerInfo">
            <h2 id="playerText">{playerUsername} (You)</h2>
                <p id="playerLeft">🫲 {player.left.health}</p>
                <p id="playerRight">🫱 {player.right.health}</p>
            </div>
            <div id="opponentInfo">
            <h2 id="opponentText">{opponentUsername} (Opponent)</h2>
                <p id="opponentLeft">🫲 {opponent.left.health}</p>
                <p id="opponentRight">🫱 {opponent.right.health}</p>
            </div>
            <form action="/damageHand" method="post">
            <h2>Left Hand</h2>
                <select name="leftThrow" id="leftThrow">
                    <option value="rock">👊</option>
                    <option value="paper">🖐️</option>
                    <option value="scissors">✌️</option>
                </select>
                <select name="leftTarget" id="leftTarget">
                    <option value={opponent.left}>Left</option>
                    <option value={opponent.right}>Right</option>
                </select>
            <h2>Right Hand</h2>
                <select name="rightThrow" id="rightThrow">
                    <option value="rock">👊</option>
                    <option value="paper">🖐️</option>
                    <option value="scissors">✌️</option>
                </select>
                <select name="rightTarget" id="rightTarget">
                    <option value={opponent.left}>Left</option>
                    <option value={opponent.right}>Right</option>
                </select>
                <input type="submit" value="Attack!"/>
            </form>
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

//an overseer type function that'll essentially hold all of the game's props
function Game(props) {
    const [playerUpdate, setPlayerUpdate] = useState(false);

    return(
        <MainGame 
        reload={() => {setPlayerUpdate(!playerUpdate)}} 
        updatePlayers={playerUpdate} 
        player={props.player} 
        username={props.username}
        enemy={props.enemy}
        enemyUsername={props.enemyUsername}/>
    )
}

function init() {
    const root = createRoot(document.getElementById('game'));
    root.render(<Menu/>);
};

window.onload = init;