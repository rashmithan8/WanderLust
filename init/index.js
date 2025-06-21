const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGODB_URL='mongodb://127.0.0.1:27017/wanderlust'

main()
    .then(()=>{
        console.log("conncted to mongodb");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(MONGODB_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68510267e12210d31f70e272"}))
    await Listing.insertMany(initData.data);
    console.log("data added");
}

initDB();