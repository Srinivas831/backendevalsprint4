const mongoose=require("mongoose");

const blackSchema=mongoose.Schema({
    token:String
},{
    versionKey:false
})

const BlackModel=mongoose.model("blacklist",blackSchema);

module.exports={BlackModel};