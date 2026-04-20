const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

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
async function handlePlayer(e){
    const account = helper.getAccount();
    //i then call a POST to createPlayer, they send that back and i work with that for the games themselves
    helper.sendPost(e.target.action, {account: account._id});
    //now the player exists, with their blank hand and stuff
    //so later i can GET that player for use with the game
    return false;
}

function Game(props) {
    const [player, setPlayer] = useState({});
    //this will update the visual of the player by getting it from the server when their data is changed (damage is taken or something)
    useEffect(() => {
        async function loadPlayer() {
            const response = await fetch('/player');
            const data = response.json();
            setPlayer(data.player);
        }
        loadPlayer();
    }, [props.updatePlayer]);
    //alright so now...
    //the player object up there has the player in it
    //...but i need another player or else how are we doing any damage.
    //THIS IS THE MAIN SNAG. I NEED THE OTHER PLAYER IN ORDER TO DEAL ANY DAMAGE.
    //should i handle that in io?
    //really what i need is for io to give me the Player of the other user in the room
    //that would be perfect, bc then i can use that for enemy display pretty easily (it's the other socket, i can give it an id based on that)
    //and i can send the requests to the damage controller that exists within... Hand, since that's what takes damage

    //i think i have something for this
    //but i'll look at it again tomorrow it's too late for me to think straight rn
    //i'll tank the milestone deduction since i didn't even get the core function in
    //also a lot of these comments are my in-the-moment thoughts that are entirely out of order and unlabeled
    //i'll take em out when it's finished
}