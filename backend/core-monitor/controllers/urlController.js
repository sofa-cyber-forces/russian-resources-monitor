import { urlModel } from '../models'

export let urlController = {
    getAllWithCategories: async(req, res)=>{
        let allUrls = urlModel.find().populate("category");
        res.json(allUrls);
    },

    getAll: async()=>{
        return urlModel.find();
    },

    update: async(url)=>{
        urlModel.updateOne({_id:url._id}, url);
    }
}