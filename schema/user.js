const mongoose = require('mongoose');
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true} 
    
})
userSchema.methods.generateAuthToken = (id)=>{
    const token=jwt.sign({_id:id},process.env.SECRET_KEY)
    console.log(this._id)
    return token
}
 const  User=mongoose.model('users',userSchema)

 module.exports=User;
