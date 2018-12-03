var loginModel = require('./login')

class Middlewares {

    loggedInRedirect(req, res, next) {
        if(req.session.email) {
            loginModel.isLoggedIn(req.session.email)
            .then(data => {
                loginModel.isLoggedIn(req.session.email)
                .then(data => {
                    if(data.code == 3) {
                        res.redirect('/')
                    }
                    else {
                        next();
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.send({
                        error: true,
                        loggedIn: false
                    });
                })
            })
        }
        else {
            next();
        }
    }

    checkLogin(req, res, next) {
        if(req.session.email) {
            loginModel.isLoggedIn(req.session.email)
            .then(data => {
                loginModel.isLoggedIn(req.session.email)
                .then(data => {
                    if(data.code == 3) {
                        next();
                    }
                    else {
                        res.send({
                            error: false,
                            loggedIn: false
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.send({
                        error: true,
                        loggedIn: false
                    });
                })
            })
        }
        else {
            res.send({
                error: false,
                loggedIn: false
            });
        }
    }

    checkLoginRedirect(req, res, next) {
        if(req.session.email) {
            loginModel.isLoggedIn(req.session.email)
            .then(data => {
                loginModel.isLoggedIn(req.session.email)
                .then(data => {
                    if(data.code == 3) {
                        next();
                    }
                    else {
                        res.redirect('/login');
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
            })
        }
        else {
            res.redirect('/login');
        }
    }

}

module.exports = new Middlewares();