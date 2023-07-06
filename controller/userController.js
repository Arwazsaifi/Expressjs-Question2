const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const connectDB=require('../connection/database')
const AccessToken=require('../models/AccessToken')
const auth=require('../middleware/auth')
const mongoose =require('mongoose');
const md5=require('md5');

connectDB();

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, confirmPassword, email, firstname, lastname } = req.body;

    const userExist = await User.findOne({ username });

    if (userExist) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      firstname: firstname,
      lastname: lastname,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'User not registered.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username.' });
    }

    const passCorrect = await bcrypt.compare(password, user.password);
    if (!passCorrect) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

 // Generate account token using MD5
 const accountToken = md5(username + Date.now());

 // Save the account token in the access_token collection
 const tokenData = new AccessToken({
   user_id: user._id,
   access_token: accountToken,
   expiry: Date.now() + 3600000, // 1 hour expiry
 });
 await tokenData.save();

 res.status(200).json({ access_token: accountToken });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'internal server error during login' });
  }
};

const getUser = async (req, res) => {
  const user = req.user;
  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const user = req.user;

  try {
    await User.findByIdAndDelete(user._id);
    return res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error during deletation of user' });
  }
};

const getUserList = async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'internal server error for getting users list.' });
  }
};

const userAddress= async(req,res)=>
{
  try{
       const{
        user_id,
        address,
        city,
        state,
        pin_code,
        phone_no}=req.body;
        const user = await User.findById(user_id);
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
    
        // Create a new address object
        const newAddress = {
          address,
          city,
          state,
          pin_code,
          phone_no,
        };
    
        // Add the new address to the user's addresses array
        user.addresses.push(newAddress);
    
        // Save the updated user with the new address
        await user.save();
    
        res.status(201).json({ message: 'Address added successfully.' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'internal server Error during adding address.' });
      }
}
const getUserById= async(req,res)=>
{
   try{
      const userId=req.params.id;
      
      const user=await User.findById(userId).populate('addresses');
      if(!user)
      {
        return res.status(404).json({message:"user not found."});
      }
     
      res.status(200).json(user);
      //console.log('working');
   }
   catch(error)
   {
    console.error("error:",error)
    return res.status(500).json({message:"internal server error for getting user by ID"});
   }
}


module.exports = {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  getUserList,
  userAddress,
  getUserById,
};
