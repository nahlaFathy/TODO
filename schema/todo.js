
const mongoose = require('mongoose');

const todoSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'  ,
        required:true 
    },
    title:{type:String,required:true,minlength:5,maxlength:20},
    body:{type:String,required:true,minlength:10,maxlength:500},
    status:{type:String,default:'Pending'},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date}
  
})

const Todo=mongoose.model('todo',todoSchema)

module.exports=Todo;