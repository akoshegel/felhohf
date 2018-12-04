var express = require('express');
var router = express.Router();
var fileupload = require('express-fileupload');

var middlewares = require('.././models/middlewares');
var blobModel = require('.././models/blob');

router.get('/setup', middlewares.checkLoginRedirect, function(req, res) {
    blobModel.setAccount(req.session.storageId)
    .then(data => {
        if(data.code == 2) {
            res.redirect('/');
        } 
        else {
            res.redirect('/error');
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/error');
    })
});

router.get('/', middlewares.checkLoginRedirect, function(req, res) {
    blobModel.listBlobs(req.session.storageId)
    .then(data => {
        res.render('index', { title: 'Index', data: data.data });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/error');
    })
});

router.post('/fileupload', middlewares.checkLoginRedirect, fileupload(), function(req, res) {
    blobModel.createBlobFromBuffer(req.session.storageId, req.files.txtfile.name, req.files.txtfile.data)
    .then(data => {
        if(data.code == 2) {
            console.log(`${req.files.txtfile.name} is successfully uploaded to ${req.session.storageId}-container storage.`);
            res.redirect('/');
        }
        else {
            res.redirect('/index');
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/error');
    })
});

router.get('/download/:blobName', middlewares.checkLoginRedirect, function(req, res) {
    blobModel.downloadFile(req.session.storageId, req.params.blobName)
    .then(data => {
        if(data.code == 2) {
            res.sendFile(data.file);
        }
    })
    .catch(err => {
        console.log(err);
    })
});

router.get('/delete', middlewares.checkLoginRedirect, function(req, res) {
    blobModel.deleteBlob(req.session.storageId, req.query.blobName.split('.').join('-'))
    .then(data => {
        if(data.code == 2) {
            res.redirect('/');
        }
    })
    .catch(err => {
        console.log(err);
    })
});

module.exports = router;
