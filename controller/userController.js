const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const connectDB=require('../connection/database')
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

    const access_token = user._id;
    res.status(200).json({ access_token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Please fix the error.' });
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
    return res.status(500).json({ message: 'An error occurred during user deletion.' });
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
    res.status(500).json({ message: 'Error getting users.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  getUserList,
};
