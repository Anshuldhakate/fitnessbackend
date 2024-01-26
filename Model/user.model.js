const mongoose= require("mongoose");

const userSchema= mongoose.Schema({
    username: String,
  pass: String,
  email: String,
  age: Number,
  weight: Number,
  fitnessGoals: String,
  workouts: [
    {
      exerciseType: String,
      duration: Number,
      intensity: String,
    },
  ],
}, {
  versionKey: false
})

const UserModel= mongoose.model("user", userSchema)

module.exports={
    UserModel
}