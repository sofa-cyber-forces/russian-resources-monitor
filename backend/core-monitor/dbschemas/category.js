import mongoose from "mongoose";
const Schema = mongoose.Schema;

export let categorySchema = new Schema({
    name: String,    
    urls:[{
        type:Schema.Types.ObjectId,
        ref:"url"
    }]
})

module.exports = mongoose.model("category", categorySchema);