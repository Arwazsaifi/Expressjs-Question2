const express = require('express');
const {validationResult } = require('express-validator');
//const bcrypt = require('bcryptjs');
const User=require('../models/user')
// const connectDB=require('../connection/database')
const  userValidationSchema = require('../validator/userValidator');
const  validationToken= require('../middleware/auth');
const userController = require('../controller/userController');
const app = express();
// connectDB();
app.use(express.json());


app.post('/user/register',userValidationSchema,userController.registerUser);

app.post('/user/login',userController.loginUser);
app.get('/user/get',validationToken,userController.getUser);
app.put('/user/delete',validationToken,userController.deleteUser);
app.get('/user/list/:page',userController.getUserList);

// app.post('/user/register', userValidationSchema, async (req, res) => {
    
//         try{

//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//               return res.status(400).json({ errors: errors.array() });
//             }
        
//             const {
//             username,
//             password,
//             confirmPassword,
//             email,
//             firstname,
//             lastname,
//            }=req.body;
        
//            //already exist or not checking
//            const userExist=await User.findOne({username});
        
//            if(userExist)
//            {
//             res.status(409).json({error: 'username already exist.'});
//            }
//            const emailExist=await User.findOne({email});
//            if(emailExist)
//            {
//             res.status(409).json({error:"email already exist."});
//            }
//            //check password is matched with confirm password
//            if(password!==confirmPassword)
//            {
//             res.status(400).json({error: 'Password not matched'});
//             }
            
//             // generating hashed password using bcrypt.
//             const hashPass=await bcrypt.hash(password,10);
        
//              const newUser= new User({
//                 username: username,
//                 password:hashPass,
//                 email:email,
//                 firstname:firstname,
//                 lastname:lastname,
//              });
//              //save new user
//              await newUser.save();
//              res.status(201).json({message: 'user registered successfully'});
//            }
//            catch(error){
//             res.status(500).json({error: 'user not resgistered'});
//           }
// });

// //Created login route Method get
// app.post('/user/login', async(req,res)=>{
//   try{
//      const {username,password}=req.body;
 
//      const user=await User.findOne({username});
 
//      if(!user)
//      {
//        return res.status(400).json({message: "Invalid username"})
//      }
//      const passCorrect=await bcrypt.compare(password, user.password);
//      if(!passCorrect)
//      {
//        return res.status(400).json({message:"Password is not correct"})
//      }
//       const access_token = user._id;
//       res.status(200).json({access_token});
//    }
//    catch(error){
//      console.log("error:", error);
//      res.status(500).json({message:'Please fix error'})
//    }
//  });

// app.get('/user/get',validationToken, async (req, res) => {
//     const user=req.user;
//     return res.status(200).json({ user });
// });

// app.put('/user/delete', validationToken, async (req, res) => {
//     const user = req.user;

//     try
//      {
//       await User.findByIdAndDelete(user._id);
//       return res.status(200).json({ message: 'User deleted' });
//      } 
//     catch (error) 
//     {
//       console.error(error);
//       return res.status(500).json({ message: 'An error occurred during user deletion.' });
//     }
// });

// app.get('/user/list/:page', async (req, res) => {
//     try{
//         //get page no.
//         const page=parseInt(req.params.page);
    
//         //user per page limitg
//         const limit =10;
//         const skip=(page-1)*limit;
    
//         const users=await User.find()
//         .skip(skip)
//         .limit(limit);
//         res.status(200).json(users);
//       }
//       catch(error){
//         console.error("error:",error);
//         res.status(500).json({message:"error giving"});
//       }
// });

// module.exports = app;
app.listen(4000)
console.log("server is ruuning 4000")