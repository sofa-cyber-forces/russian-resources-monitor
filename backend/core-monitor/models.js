import { connectionString } from "./config";
import { categorySchema } from "./dbschemas/category";
import { urlSchema } from "./dbschemas/url"

const mongoose = require("mongoose");
mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true });

export let urlModel = mongoose.model("url", urlSchema)
export let categoriesModel = mongoose.model("category", categorySchema)
