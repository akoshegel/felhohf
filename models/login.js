var mongoose = require('mongoose');

const user = 'h0gw3q';
const password = 'TICr9j7h4hUMOI4iHRcXowGBKCrXnkQf9mAVNN9otcOUH8xkMAYOYHSXWreHNJ9x6whaPswS761YhGy8BzzISA==';
const connectionString = `mongodb://${user}.documents.azure.com:10255/hf`;

class Model {

    constructor() {
        mongoose.createConnection(`${connectionString}?ssl=true&replicaSet=globaldb`, {
            auth: {
                user: user,
                password: password
            },
            useNewUrlParser: true
        })
        .then((conn) => {
            console.log('successfully connected to the database (login model)')
            this._connection = conn
            this.setUpSchemas()
        })
        .catch(err => {
            console.log(err)
            console.log('unable to connect to the database (login model)')
        })
    }

    setUpSchemas() {
        this.userSchema = this._connection.model('login', new mongoose.Schema({
            _class: String,
            email: String,
            password: String,
            storageId: String
        }), 'logindata');
        
        
        this.loggedInSchema = this._connection.model('loggedIn', new mongoose.Schema({
            _class: String,
            email: String,
            loggedInTime: Date
        }), 'logindata');
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            this.loggedInSchema.findOne({
                _class: '_logged.d',
                email: email
            }, (err, document) => {
                if(err) {
                    reject({
                        code: 1,
                        msg: 'Connection error.'
                    });
                }
                else if(document == null) {
                    this.userSchema.findOne({
                        _class: '_user.d',
                        email: email,
                        password: password
                    }, (err, document) => {
                        if(err) {
                            reject({
                                code: 2,
                                msg: 'Connection error.'
                            });
                        }
                        else {
                            if(document == null || document.password != password) {
                                resolve({
                                    code: 3,
                                    msg: 'Incorrect username or password.'
                                });
                            }
                            else {
                                const newLoginUser = new this.loggedInSchema({
                                    _class: '_logged.d',
                                    email: email
                                });
                                newLoginUser.save(err => {
                                    if(err) {
                                        reject({
                                            code: 6,
                                            msg: 'Connection error.'
                                        });
                                    }
                                    else {
                                        resolve({
                                            code: 4,
                                            msg: 'Successfully logged in.',
                                            storageId: document.storageId
                                        });
                                    }
                                });
                            }
                        }
                    })
                }
                else {
                    resolve({
                        code: 5,
                        msg: 'Already logged in.'
                    });
                }
            })
        })
    }

    logout(email) {
        return new Promise((resolve, reject) => {
            this.loggedInSchema.deleteOne({
                _class: '_logged.d',
                email: email
            }, (err) => {
                if(err) {
                    reject({
                        code: 1,
                        msg: 'Connection error.'
                    });
                }
                else {
                    resolve({
                        code: 2,
                        msg: 'Successfully logged out.'
                    });
                }
            })
        })
    }

    isLoggedIn(email) {
        return new Promise((resolve, reject) => {
            this.loggedInSchema.findOne({
                _class: '_logged.d',
                email: email
            }, (err, document) => {
                if(err) {
                    reject({
                        code: 1,
                        msg: 'Connection error.'
                    });
                }
                else {
                    if(document == null) {
                        resolve({
                            code: 2,
                            msg: 'User is not logged in.'
                        });
                    }
                    else {
                        resolve({
                            code: 3,
                            msg: 'User is logged in.'
                        });
                    }
                }
            })
        }) 
    }
}

module.exports = new Model();