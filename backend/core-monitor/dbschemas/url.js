import mongoose from "mongoose";
const Schema = mongoose.Schema;

export let urlSchema = new Schema({
    link: String,
    statusCode: Number,
    error:String,
    duration:Number,
    size:Number,
    updateTime:Date,
    category:{
        type:Schema.Types.ObjectId,
        ref:"category"
    }
})

module.exports = mongoose.model("url", urlSchema);