const bcrypt=require('bcrypt')
const _=require('lodash');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Todo=require('../schema/todo')
const User = require('../schema/user');
const jwt=require('jsonwebtoken')




router.post('/login',body('email').isLength({ min: 1 })
.withMessage('email is required'),
body('password').isLength({ min: 1 })
.withMessage('password is required')
, async(req, res) => {
    /////// validate req body
       const errors = validationResult(req); 
       if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg });        
       
       //////////////chech if username is registered
       let user=await User.findOne({email:req.body.email})
       if(!user) return res.status(400).send('invalid email or password') 
       
       /////////// chech if password match usename password 
       const validPassword=await bcrypt.compare(req.body.password,user.password)
       if(validPassword===false)return res.status(400).send('invalid email or password') 
    
       ////////////////// get user todos
        const todos=await Todo.findOne({userId:user._id})
        console.log(user._id)
        const token=jwt.sign({_id:user._id},process.env.SECRET_KEY)
       
     return res.header('x-user-token',token).send({message:'user was logined successfully',email:user.email,
         latestTodos:todos ,token:token}) 
    
  })


  module.exports=router