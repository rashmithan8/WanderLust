const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();    //we have to save if make changes in listing
    console.log("data saved");
    req.flash("success","New review created");
    res.redirect(`/listing/${listing._id}`);  //we can use _id or id
}

module.exports.destroyReview = async(req,res)=>{
    const {id,reviewid}=req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted");
    res.redirect(`/listing/${id}`);

}