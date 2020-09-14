import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    points: {
        type: Number,
        default:0
    },
    registration_date:{
        type:Date,
        default:new Date()
    },
    last_claim_date:{
        type : Date
    },
    hour_play_count:{
        type:Number,
        default:0
    },
    last_played:{
        type : Date
    },

}, {
    collection: 'user',
    timestamps: true
});

let UserModel = mongoose.model('user', UserSchema);

export default UserModel