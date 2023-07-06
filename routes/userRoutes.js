const express = require('express');
const {validationResult } = require('express-validator');
const User=require('../models/user')
const  userValidationSchema = require('../validator/userValidator');
const  validationToken= require('../middleware/auth');
const userController = require('../controller/userController');
const app = express();

app.use(express.json());

//route for user registration
app.post('/user/register',userValidationSchema,userController.registerUser);

//route for user login and generate token
app.post('/user/login',userController.loginUser);

//route for get user data
app.get('/user/get',validationToken,userController.getUser);

//route for deleting user
app.put('/user/delete',validationToken,userController.deleteUser);

// route for give list of user 
app.get('/user/list/:page',userController.getUserList);

//route for add user address 
app.post('/user/userAddress',validationToken,userController.userAddress);

//route for get all users along with addresss.
app.get('/user/get/:id',validationToken,userController.getUserById);


app.listen(4000)
console.log("server is ruuning 4000")