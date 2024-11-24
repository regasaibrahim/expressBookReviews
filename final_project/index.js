const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const auth=(req,res,next)=>{
    if(req.session.authorization){
        let token =req.session.authorization['accessToken']
        jwt.verify(token,'access',(err,decod)=>{
            if(!err){
                req.user=decod
                next()
            }else{
                res.status(403).json({message:'user not authenticated'})
            }
        })
        
    }else{
        res.status(401).send('Please LOg in First')
    }


}

app.use("/customer/auth/*", auth);

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
module.exports.auth=auth