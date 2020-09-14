import UserModel from "./user.model";
const fs = require('fs');
var mongoose = require('mongoose');
import settings from '../config/settings';
let config = require('./../config/' + settings.environment + '.config').default;
const jwt = require('jsonwebtoken');
const UserService = {
  getUser: async (id) => {
    try {
      const User = await UserModel.findById(mongoose.Types.ObjectId(id));
      return User;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },
  getUserByName: async (name) => {
    try {
      const User = await UserModel.find({ name: name });
      return User;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },
  createUser: async (name) => {
    try {
      var newUser = {
        name: name,
        points: 0
      }
      var user = await new UserModel(newUser).save();
      var payload = {
        id: user._id,
        name: user.name,
        points: user.points
      }
      var token = await jwt.sign(payload, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      return token
    } catch (error) {
      console.log(error)
      throw error;
    }
  },
  updateUser: async (userId, updateObj) => {
    try {
      const update = await UserModel.findOneAndUpdate({
        _id: userId
      }, updateObj, {
        strict: true,
        new: true
      });
      return update;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },
  first10Place: async () => {
    try {
      var users = await UserModel.find({}).sort({ points: -1, createdAt: -1 }).limit(10).lean()
      var place = 0;
      var result = users.map(data => {
        place++;
        return {
          name: data.name,
          place: place,
          points: data.points
        };
      });
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },
  getUserPlace: async (user) => {
    try {
      var topUserCount = await UserModel.find({ points: { $gt: user.points } }).count();
      var usersSamepoints = await UserModel.find({ points: user.points }).sort({ createdAt: -1 });
      var findIndex = usersSamepoints.findIndex(x => String(x._id) == user.id)
      return topUserCount + 1 +findIndex
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
};
export default UserService;