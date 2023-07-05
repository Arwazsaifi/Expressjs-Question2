
const { body, validationResult } = require('express-validator');

var ValidationOfSchema=[
    body('username').notEmpty().withMessage('Username is required'),
  
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be6 chars long'),
  
    body('confirmPassword')
      .notEmpty().withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords not match');
        }
        return true;
      }),
  
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Email invalid'),
  
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
  ];
module.exports = ValidationOfSchema;
