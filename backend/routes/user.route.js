const express=require("express");
const { UserModel } = require("../model/user.model");
const userRouter=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { BlackModel } = require("../model/blacklist.model");

userRouter.post("/register",async(req,res)=>{
    try{
        let obj=req.body;
        const find=await UserModel.findOne({email:req.body.email});
        if(find){
            return res.status(400).send({"msg":"User already exist, please login"});
        }
        bcrypt.hash(req.body.password,2,async(err,hashed)=>{
            if(hashed){
                const registered=new UserModel({...obj,password:hashed});
                await registered.save();
                res.status(200).send({"msg":"userr registerd successfully"});
            }
            else{
                res.status(400).send({"msg":"error hashing password"});
            }
        })

    }
    catch(err){
        res.status(400).send({"msg":"error registering",error:err});
    }
})

userRouter.post("/login",async(req,res)=>{
    try{
        const find=await UserModel.findOne({email:req.body.email});
        if(!find){
            return res.status(400).send({"msg":"this email is not registered"});
        }
        bcrypt.compare(req.body.password,find.password,(err,result)=>{
            if(result){
                const token=jwt.sign({name:find.name,userid:find._id},"secret",{expiresIn:"7d"});
                res.status(200).send({"msg":"loggedin successfully","token":token});
            }
            else{
                res.status(400).send({"msg":"wrong credintials"});
            }
        })
    }
    catch(err){
        res.status(400).send({"msg":"error logging in",err:err});

    }
})

userRouter.get("/logout",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1];
    try{
const blacklist=new BlackModel({token:token});
await blacklist.save();
res.status(200).send({"msg":"loggedout success"});
    }
    catch(err){
        res.status(400).send({"msg":"error logging out",err:err});
    }
})

module.exports={userRouter};