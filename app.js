if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const port=8080;

//const MONGODB_URL='mongodb://127.0.0.1:27017/wanderlust'
const dbURL=process.env.MONGO_ATLAS_URI;

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}




main()
    .then(()=>{
        console.log("conncted to mongodb");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(dbURL);
}

// app.get("/",(req,res)=>{
//     res.send("hii");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");   //saved in locals ,so we can use in ejs files
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"abc@gmail.com",
//         username:"rashmitha",
//     });
//     let registeredUser=await User.register(fakeuser,"helloworld");   //helloworld->password
//     res.send(registeredUser); 
// })

app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter);
app.use("/",userRouter);


// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found"));
// });

app.use((err,req,res,next)=>{
    let {statusCode=500,message="error occured"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.get("/", (req, res) => {
    res.send("Welcome to WanderLust!");
});

app.listen(port,()=>{
    console.log(`port is running at ${port}`);
});