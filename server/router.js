const controllers = require('./controllers');
const mid = require('./middleware');

function router(app) {
    app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/account', mid.requiresLogin, controllers.Account.getCurrentAccount);
    app.post('/account', mid.requiresLogin, controllers.Account.updateBattleInfo);

    app.post('/battles', mid.requiresLogin, controllers.Battle.resolve);
    app.get('/battles', mid.requiresLogin, controllers.Battle.showBattles);

    app.get('/players', mid.requiresLogin, controllers.Player.getPlayer);
    app.post('/players', mid.requiresLogin, controllers.Player.createPlayer);

    app.post('/damageHand', mid.requiresLogin, controllers.Hand.damageHand);


    app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
}

module.exports = router;