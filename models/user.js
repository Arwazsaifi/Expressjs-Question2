const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username:
    {
        type: String,
        unique:true
    },

    password:String,

    email:
    {
    type: String,
    unique:true
    },

    firstname: String,
    lastname: String,
});

//user model
const User=mongoose.model('User',userSchema);

module.exports = User;