const Listing=require("../models/listing")
const Reservation = require("../models/reservation");

module.exports.showReservationPage = async (req, res) => {
    let { id } = req.params;
    let { checkin, checkout, guests } = req.query; //bez get method

    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found");
        return res.redirect("/listing");
    }
    let inDate = new Date(checkin);
    let outDate = new Date(checkout);
    let nights = (outDate - inDate) / (1000 * 60 * 60 * 24);
    let price = listing.price * nights;
    let cleaningFee = 50;
    let serviceFee = 35;
    let tax = 20;
    let total = price + cleaningFee + serviceFee + tax;

    res.render("reservation/checkout", {
        listing,
        checkin,
        checkout,
        guests,
        nights,
        total,
        price,
        cleaningFee,
        serviceFee,
        tax
    });
}

module.exports.processReservation = async (req, res) => {
    const { id } = req.params;
    const { checkin, checkout, guests, firstName, lastName, email, phone } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    const nights = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24);
    const total = listing.price * nights + 50 + 35 + 20;

    const reservation = new Reservation({
        listing: listing._id,
        user: req.user._id, // assuming user is logged in
        checkin,
        checkout,
        guests,
        guestName: `${firstName} ${lastName}`,
        email,
        phone,
        amount: total
    });

    await reservation.save();

    req.flash("success", "Booking confirmed!");
    res.redirect("/listing");
};
