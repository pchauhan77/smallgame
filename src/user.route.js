import express from "express";
import UserController from "./user.controller";
let config = require('./../config/' + settings.environment + '.config').default;
import settings from '../config/settings';
const jwt = require('jsonwebtoken');


const UserRouter = express.Router();

var authorization = function (req, res, next) {
    var token = req.headers['authorization'];

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    var encode = token.split(' ')

    jwt.verify(encode[1], config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.tokenData = decoded;
        next();

    })
}
var flexiableAuthorization = function (req, res, next) {
    var token = req.headers['authorization'];

    if (!token) {
        req.isToken = false
        next()
    }else{
        var encode = token.split(' ')
        jwt.verify(encode[1], config.secret, function (err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            req.tokenData = decoded;
            req.isToken = true
            next();
        })
    }
}

UserRouter.get('/now', function (req, res) {
    res.send({
        timestamp: new Date().getTime()
    });
});

UserRouter.post('/register', UserController.createUser);
UserRouter.get('/me',authorization,UserController.getUser);
UserRouter.post('/game/play',authorization,UserController.userGamePlay);
UserRouter.post('/game/claim_bonus',authorization,UserController.userClaimBonus);
UserRouter.get('/leaderboard',flexiableAuthorization,UserController.getLeaderBoard);

export default UserRouter;