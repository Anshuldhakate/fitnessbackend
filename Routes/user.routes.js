const express= require("express")
const bcrypt= require("bcrypt")
const {UserModel}= require("../Model/user.model")
const jwt= require("jsonwebtoken")
const { auth } = require("../Middlewares/authmiddleware")

const userRouter= express.Router()


userRouter.post("/register", async(req, res)=>{
const {username, email, pass}= req.body

try{
bcrypt.hash(pass, 8, async(err, hash)=>{
    if(err){
        res.status(200).json({error:err})
    }
    else{
        const user= new UserModel({username, email, pass:hash})
        await user.save()
        res.status(200).json({msg:"The new user has been registered!"})
    }
})
}
catch(error){
    res.status(400).json({error:err})
}
})

userRouter.post("/login", async(req, res)=>{
    const {email, pass}= req.body
    try{
       const user= await UserModel.findOne({email})
       bcrypt.compare(pass, user.pass, (err, result)=>{
        if(result){
            const token= jwt.sign({userId: user._id, user:user.username}, "masai")
            res.status(200).json({msg:"Logged In!", token})
        }
        else{
            res.status(200).json({error:err})
        }
       })
    }
    catch(error){
        res.status(400).json({error:err})
    }
})

userRouter.put("/profile", auth, async (req, res) => {
    // The auth middleware adds userId and userName to req.body
    const { age, weight, fitnessGoals } = req.body;
  
    try {
      // Update user profile in the database
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.body.userId,
        { $set: { age, weight, fitnessGoals } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ msg: "User profile updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Endpoint for logging workouts (protected with auth middleware)
  userRouter.post("/log-workout", auth, async (req, res) => {
    // The auth middleware adds userId and userName to req.body
    const { exerciseType, duration, intensity } = req.body;
  
    try {
      // Log workout in the database
      const user = await UserModel.findById(req.body.userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      user.workouts.push({ exerciseType, duration, intensity });
      await user.save();
  
      res.status(200).json({ msg: "Workout logged successfully", user });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports={
    userRouter
}