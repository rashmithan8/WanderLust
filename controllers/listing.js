const Listing=require("../models/listing")

module.exports.index = async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listing/index.ejs",{allListings});
}

module.exports.renderNewForm = async(req,res)=>{
    res.render("listing/new.ejs");
}

module.exports.createListing = async(req,res,next)=>{
    //let {title,image,price,location,country}=req.body
    let url=req.file.path;
    let filename=req.file.filename;

    let newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.img={url,filename};
    await newlisting.save();
    req.flash("success","New listing created");
    res.redirect("/listing");
}

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listings){
        req.flash("error","listing you are requesting for not found");
        return res.redirect("/listing");
    }
    //console.log(listings)
    res.render("listing/show.ejs",{listings});
}

module.exports.renderEditForm = async(req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    if(!listings){
        req.flash("error","listing you are requesting for not found");
        return res.redirect("/listing");
    }

    let originalImageUrl = listings.img.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("listing/edit.ejs",{listings,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});  //The ... spread operator pulls all the properties inside listing and puts them directly into the update

    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.img={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);  //triggers findOnedAndDelete() which is defined in model>>listing.js
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
}


module.exports.filterByCategory = async (req, res) => {
    let { category } = req.query;  //query bez filter?category=something  this is how url looks like here
    // Return all listings if no category is passed
    let query = category ? { category } : {};
    let allListings = await Listing.find(query);
    res.render("listing/index", { allListings });
}


module.exports.search=async (req, res) => {
    let query = req.query.q;
        // Case-insensitive partial match using regex
    let allListings = await Listing.find({
        title: { $regex: query, $options: "i" }  //Find listings where the title matches the user's search query, using a regular expression ($regex) that is case-insensitive ($options: "i")
    });
    if(!allListings){
        req.flash("error","No listings found.");
        return res.redirect("/listing");
    }
    res.render("listing/index", { allListings });
}