var express = require('express');
var router = express.Router();

var middlewares = require('.././models/middlewares');
var loginModel = require('.././models/login');

router.get('/', middlewares.loggedInRedirect, function(req, res) {
    res.render('login', { title: 'Login' });
});

router.get('/bad', middlewares.loggedInRedirect, function(req, res) {
    res.render('loginError', {title: 'Login error'})
});

router.post('/action', function(req, res) {
    loginModel.login(req.body.email, req.body.password)
    .then(data => {
        if(data.code == 4) {
            req.session.email = req.body.email;
            req.session.storageId = data.storageId;
            res.redirect('/setup');
        }
        else {
            res.redirect('/login/bad');
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/login/bad')
    });
});

router.get('/out', function(req, res) {
    loginModel.logout(req.session.email)
    .then(data => {
        if(data.code == 2) {
            delete req.session.email;
            delete req.session.storageId;
            res.redirect('/login');
        }
        else {
            delete req.session.email;
            delete req.session.storageId;
            res.redirect('/error');
        }
    })
    .catch(err => {
        delete req.session.email;
        delete req.session.storageId;
        console.log(err);
        res.redirect('/error');
    })
});

module.exports = router;
