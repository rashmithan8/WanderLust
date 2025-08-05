// models/reservation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkin: {
        type: Date,
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    guestName: String,
    email: String,
    phone: String,
    amount: Number, // Total amount
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
