import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    title:{type:String,required:true},
    category:{type:String,required:true},
    price:{type:String,required:true},
})

export const Product = mongoose.model("Product",productSchema)
