
const User = require('../models/user');
const validationToken=async(req,res,next)=>{
    const access_token=req.headers.authorization;
  
   try{
    const user=await User.findById(access_token);
    if(!user)
    {
      return res.status(400).json({message:"invalid access token"})
    }
    req.user=user;
    next();
  }
  catch(error)
  {
    console.error("error:", error);
    return res.status(500).json({message:"error occured"});
  }
  };
module.exports = validationToken;
