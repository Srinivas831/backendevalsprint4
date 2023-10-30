const jwt=require("jsonwebtoken");
const { BlackModel } = require("../model/blacklist.model");

const authMiddleware=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(token){
        const findBlack=await BlackModel.findOne({token:token});
        if(!findBlack){
        jwt.verify(token,"secret",(err,decoded)=>{
            if(decoded){
                req.body.name=decoded.name;
                req.body.userid=decoded.userid;
                next();
            }
            else{
                res.status(403).send({"msg":"Token is not valid",err:err});
            }
        })
    }else{
        res.status(400).send({"msg":"login again"});
    }
    }
    else{
        res.status(400).send({"msg":"login fist"});
    }
}

module.exports={authMiddleware};