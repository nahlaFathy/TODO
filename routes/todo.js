const _=require('lodash');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User =require('../schema/user')
const Todo = require('../schema/todo');
const auth=require('../middleware/auth')


//////////////////////////////////////////  1 ///////////////////////////////////////

router.post('/',
body('title').isLength({ min: 1 })
.withMessage('title is required')
, body('body').isLength({ min: 1 })
.withMessage('body is required'),auth,
 async(req, res) => {
  
       const errors = validationResult(req); 
       if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg }); 
       if(!mongoose.Types.ObjectId.isValid(req.user._id))
       return res.status(400).send({error: 'invalid user id' }); 
       const userid= await User.findById(req.user._id)
       if(!userid)   return res.status(400).send({error: 'this  user id is not exist' }); 
  
       const todo =new Todo({
          userId:req.user._id,
          title:req.body.title,
          body:req.body.body,
          status:req.body.status,
       })
    try{
     
        await todo.save()
       res.send({todo}) 
    }
    catch(err){
        res.send({error:err}) 
    }
    
  })

  //////////////////////////////////////// 2 ////////////////////////////////////////////
  router.get('/',auth,  async(req, res)=> {
    
    const loginedID=req.user._id
    console.log(loginedID);
    const todo= await Todo.find({userId:loginedID})
      if(todo) return res.send(todo)
 
    })




////////////////////////// 4  /////////////////////////////////////////////

router.patch('/:id',auth, async(req, res) => {
       let todo
        try{
           todo= await Todo.findById(req.params.id)
        }
       catch(ex)
       {
        return res.send({error:'this todo id is not exist'})
       }
  
      if(todo.userId==req.user._id)
        {
          if(!mongoose.Types.ObjectId.isValid(req.user._id))
          return res.status(400).send({error: 'invalid user id' }); 
          const userid=await User.findById(req.user._id)
          if(!userid) return res.status(404).send('this user id is not exist')
          const updated= await Todo.updateOne(todo,{
            $set:{
             userId:req.user._id,
             title:req.body.title,
             body:req.body.body,
             status:req.body.status,
             updatedAt:new Date()
            }
        },{new:true});
            if(updated)
              return res.send({message:'Todo was edited successfully',todo:todo})
          
        }
        else return res.send({Error:'you can only edit your todos'})
     
     

   })

  ////////////////////////////// 5 //////////////////////////

   router.delete('/:id',auth,async(req, res) => {

        const todo= await Todo.findById(req.params.id);
        console.log(todo.userId)
        console.log(req.user._id)
        if(!todo) return res.send({error:'this todo id is not exist'})
        if(todo.userId==req.user._id)
        {
           await Todo.deleteOne(todo)
           return res.send({message:'todo deleted successfuly'})
          
        }
        else return res.send({Error:'you can only delete your todos'})
       
   })

   module.exports=router;
