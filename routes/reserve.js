const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const reserveController=require("../controllers/reserve.js");


router
    .route("/:id")
    .get(wrapAsync(reserveController.showReservationPage))
    .post(wrapAsync(reserveController.processReservation));

module.exports=router;