const express=require('express');
const { PostModel } = require('../model/post.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const postRouter=express.Router();

postRouter.use(authMiddleware);

postRouter.post("/add",async(req,res)=>{
    try{
        const added=new PostModel(req.body);
        await added.save();
        res.status(200).send({"msg":"post added"});
    }
    catch(err){
        res.status(400).send({"msg":"error posting"});
    }
})

postRouter.get("/",async(req,res)=>{
    try{
        const find=await PostModel.find({userid:req.body.userid});
       if(find){
        res.status(200).send({"msg":find});
       }
       else{
        res.status(200).send({"msg":"no posts exist"});
       }
    }
    catch(err){
        res.status(400).send({"msg":"error getting posts"});
    }
})

postRouter.patch("/patch/:id",async(req,res)=>{
    let id=req.params.id;
try{
const findId=await PostModel.findOne({_id:id});
if(!findId) return res.status(400).send({ msg: 'Post not found' });

if(req.body.userid==findId.userid){
    await PostModel.findByIdAndUpdate({_id:id},req.body);
    res.status(200).send({"msg":"patched successfully"});
}else{
    res.status(400).send({"msg":"u are not authorized to update this"});
}
}
catch(err){
    res.status(400).send({"msg":"error patching"})
}
})

postRouter.delete("/delete/:id",async(req,res)=>{
    let id=req.params.id;
try{
const findId=await PostModel.findOne({_id:id});
if(!findId) return res.status(400).send({ msg: 'Post not found' });

if(req.body.userid==findId.userid){
    await PostModel.findByIdAndDelete({_id:id});
    res.status(200).send({"msg":"deleted successfully"});
}else{
    res.status(400).send({"msg":"u are not authorized to delete this"});
}
}
catch(err){
    res.status(400).send({"msg":"error deleting"})
}

})  
module.exports={postRouter};