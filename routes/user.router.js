const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel}=require('../model/user.model')


const UserRouter = express.Router();




UserRouter.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ username, email, password: hashedPassword });

    await user.save();
    
    res.status(201).send({ "msg": "User registered successfully" });
  } catch (err) {

    res.status(500).send({ "error": err.message });
  }
});


UserRouter.post("/api/login",async(req,res)=>{
  const {email,password}=req.body
  try {
    const user = await UserModel.findOne({email}) 
    // console.log(user)
    if(user){
      bcrypt.compare(password, user.password, (err, result)=>{
        const token=jwt.sign({userID:user._id,username:user.username }, 'masai',{expiresIn:"11h"})
      
         if(result){
          res.status(200).json({msg:"Login successfull",token})
         }else{
          res.status(200).json({msg:"wrong Credentials"})
         }
      })
     
    }  else{
      res.status(200).json({msg:"wrong Credentials"})
    }
  } catch (err) {
    res.status(400).json({error:err}) 
  }
})

module.exports = {
    UserRouter
}
