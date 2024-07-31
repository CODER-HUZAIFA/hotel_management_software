import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: Number,
        require: true,
    },
    persons: {
        type: Number,
        require: true,
    },
    settlementAmount: {
        type: Number,
        require: true,
    },
    roomNo: {
        type: Number,
        required: true,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    }
})

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true,
    },
    capacity: {
        type: Number,
        require: true
    },
    availability: {
        type: String,
        default: "Available",
        enum: ["Available", "Not Available"]
    },
    type: {
        type: String,
        require: true,
        default: "Normal",
        enum: ["Normal", "Luxury"]
    },
    customer: {
        type: customerSchema,
        default: null
    }
});

const billSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date()
    },
    checkInRooms: {
        type: Array,
        default: []
    },
    checkOutRooms: {
        type: Array,
        default: []
    },
    gst: {
        type: Number
    },
    business: {
        type: Number
    },
    finalAmount: {
        type: Number
    }
})

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rooms: [roomSchema],
    customerHistory: {
        type: Array,
        default: []
    },
    billsHistory: {
        type: [billSchema],
        default: []
    }
}, {timestamps: true})

export const Hotel = mongoose.model("Hotel", hotelSchema)