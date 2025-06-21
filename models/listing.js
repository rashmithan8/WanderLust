const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { string } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
    },
    img:{
        url:String,
        filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{       //this is triggered when findByIdAndDelete is performed listingSchema
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;
