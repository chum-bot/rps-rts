const models = require('../models');
const Account = models.Account;

function loginPage(req, res) {
    return res.render('login');
}

function logout(req, res) {
    req.session.destroy();
    return res.redirect('/');
}

function login(req, res) {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if(!username || !pass){
        return res.status(400).json({error: "All fields are required!"});
    }

    return Account.authenticate(username, pass, (err, account) => {
        if(err || !account) {
            return res.status(401).json({error: 'Wrong username or password!'});
        }

        req.session.account = Account.toAPI(account);

        return res.json({redirect: '/maker'});
    })
}

async function signup(req, res) {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if(!username || !pass || !pass2){
        return res.status(400).json({error: "All fields are required!"});
    }

    if(pass !== pass2){
        return res.status(400).json({error: "Passswords do not match!"})
    }

    try{
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username, password: hash});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({redirect: '/maker'});
    }

    catch (err) {
        console.log(err);
        if(err.code === 11000) {
            return res.status(400).json({error: "Username already in use!"});
        }
        return res.status(500).json({errpr: "An error has occurred!"});
    }
}

module.exports = {
    loginPage, 
    login, 
    logout, 
    signup
}