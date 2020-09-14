import UserService from "./user.service";
import settings from '../config/settings';
var moment = require('moment')

const UserController = {
    getUser: async (req, res) => {
        try {
            let userId = req.tokenData.id;
            const user = await UserService.getUser(userId);
            res.status(200).send({
                name: user.name,
                points: user.points
            });
        } catch (error) {
            res.status(400).send({
                error: 'server error'
            });
        }
    },
    createUser: async (req, res) => {
        try {
            let name = req.body.name;
            if (name) {
                const user = await UserService.getUserByName(name);
                if (user.length > 0) {
                    res.status(201).send({
                        error: 'User is already here'
                    });
                } else {
                    const token = await UserService.createUser(name);
                    res.status(200).send({
                        token: token
                    });
                }
            } else {
                return res.status(201).send({
                    error: 'Name is Required'
                });
            }

        } catch (error) {
            res.status(400).send({
                error: 'server error'
            });
        }
    },
    userGamePlay: async (req, res) => {
        try {
            let userId = req.tokenData.id;
            const user = await UserService.getUser(userId);
            var startHour = moment().startOf('hour');
            var endHour = moment().endOf('hour');
            var hour_play_count = 1;
            var addPoints = randomPoints()
            if (user.last_played) {
                if ((startHour <= moment(user.last_played)) && (endHour >= moment(user.last_played))) {
                    if (user.hour_play_count < 5) {
                        hour_play_count = user.hour_play_count + 1;
                    } else {
                        return res.status(201).send({
                            error: 'User Already played 5 Times'
                        });
                    }
                }
            }
            var updateObj = {
                last_played: new Date(),
                hour_play_count: hour_play_count,
                points: user.points + addPoints
            }
            var updateUser = await UserService.updateUser(userId, updateObj);
            res.status(200).send({
                points_added : addPoints,
                points_total :updateObj.points
            });
        } catch (error) {
            res.status(400).send({
                error: 'server error'
            });
        }
    },
    userClaimBonus:async (req,res)=>{
        try{
            let userId = req.tokenData.id;
            const user = await UserService.getUser(userId);
            var addPoints = randomPoints()
            var updateObj = {
                last_claim_date: new Date(),
                points: user.points + addPoints
            }
            var updateUser = await UserService.updateUser(userId, updateObj);
            res.status(200).send({
                points_added : addPoints,
                points_total :updateObj.points
            });
        } catch (error) {
            res.status(400).send({
                error: 'server error'
            });
        }
    },
    getLeaderBoard:async(req,res)=>{
        try{
            var first10Place = await UserService.first10Place();
            var response = {};
            response.leaders  = first10Place;
            if(req.isToken){
                let userId = req.tokenData.id;
                const user = await UserService.getUser(userId);
                const place = await UserService.getUserPlace(user);
                response.current_user_place = place
            }           
            res.status(200).send(response);
        }catch (error) {
            res.status(400).send({
                error: 'server error'
            });
        }
    }
};

function randomPoints() {
    return Math.floor(Math.random() * 101);
}

export default UserController;