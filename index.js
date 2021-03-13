const express = require('express');
const app = express();
const port=3000;
const mongoose = require('mongoose');
const user =require('./routes/user')
const todo=require('./routes/todo')
const auth=require('./routes/auth')
const cors = require('cors')
require('dotenv').config()
mongoose.set('useFindAndModify', false);
if(!process.env.SECRET_KEY)
{
  console.error('FATAL ERROR: Secret_key is not defined !!')
  ////// 0 exit with succeed otherwisw exit with fail
  process.exit(1)
}

mongoose.connect(process.env.MONGO_DB||'mongodb://localhost/nodedb',{useNewUrlParser: true , useUnifiedTopology: true})
.then(()=> console.log('connected to MongodDB ...'))
.catch((err)=>console.error('can not connect to MongoDB',err))



// a middleware that logs the request url, method, and current time 

app.use((req, res, next) => {
    var time = new Date();
    console.log('Time:', time.getHours(), ':', time.getMinutes(), ':', time.getSeconds())
    console.log('Method:', req.method)
    console.log('URL:', req.url)
    next()
  })
  
  // a global error handler that logs the error 
  
  app.use((err,req, res, next) => {
    console.error(err)
    res.status(500).send({ error: 'internal server error' })
    next(err);
  });
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors())
  app.use('/api/users',user)
  app.use('/api/todos',todo)
  app.use('/api/users',auth)

app.listen(process.env.PORT||port)


