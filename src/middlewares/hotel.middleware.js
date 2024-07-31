import mongoose from "mongoose";
import { Hotel } from "../models/hotel.models.js";
import { User } from "../models/user.models.js";
import { tokenVerify } from "../utils/auth.js"
import { billsHandler } from "../utils/bills.js";
import { client } from "../utils/redis_client.js"

const hotelAuth = async (req, res, next) => {
    if (!req.cookies.uid) return res.redirect("/login");

    const user = tokenVerify(req.cookies.uid);
    if (!user) return res.redirect("/login");

    const data = await client.get(`user:${user.objectId}`)
    if (data) {
        const user = JSON.parse(data)
        req.user = user;
        next();
        return;
    }

    const loginUser = await User.findOne({ _id: user.objectId })
        .populate("hotels")
        .select("-password")

    await client.set(`user:${loginUser._id}`, JSON.stringify(loginUser))

    req.user = JSON.parse(loginUser);

    next();
    return;
};

const hotelVerified = async (req, res, next) => {
    const { objectId } = tokenVerify(req.cookies.uid);
    const { hotelId } = req.params

    const hotel = await Hotel.findById(hotelId)
    if (!hotel) return res.redirect(`/user/${objectId}`)

    if (hotel.owner == objectId) {
        const data = await client.get(`user:${hotel.owner}:hotel:${hotel._id}`)
        if (data) {
            req.hotel = JSON.parse(data);
            next();
            return;
        }

        await client.set(`user:${hotel.owner}:hotel:${hotel._id}`, JSON.stringify(hotel))
        req.hotel = hotel;

        next();
        return;
    };

    res.redirect(`/user/${objectId}`)
};

const roomValidator = async (req, res, next) => {
    const { roomId } = req.params;
    let roomFound = false;

    req.hotel.rooms.forEach((room) => {
        if (roomId == room._id.toString()) {
            req.room = room;
            roomFound = true;
        }
    });

    if (roomFound) {
        return next();
    } else {
        return res.status(404).send("Error: Room not found");
    }
};

const billMiddleware = async (req, res, next) => {
    const date = new Date();

    // await client.del(`hotel:${req.hotel._id}:bill:${date.toDateString()}`)
    // const cacheBill = await client.get(`hotel:${req.hotel._id}:bill:${date.toDateString()}`)

    // if (cacheBill) {
    //     const bill = JSON.parse(cacheBill);
    //     bill.date = new Date(bill.date);
    //     console.log(bill)
    //     req.bill = bill;
    //     console.log("Cached")
    //     return next();
    // }

    const hotel = await Hotel.findById(req.hotel._id);
    const bill = hotel.billsHistory.find(bill => bill.date.toDateString() == date.toDateString());
    if (bill) {
        req.bill = bill;
        // await client.set(`hotel:${req.hotel._id}:bill:${date.toDateString()}`, JSON.stringify(bill))
        return next();
    } else {
        const todayBill = await billsHandler(hotel._id);
        hotel.billsHistory.push(todayBill);
        // await client.set(`hotel:${req.hotel._id}:bill:${date.toDateString()}`, JSON.stringify(todayBill))
        await hotel.save()
        return next();
    }
    
};




export {
    hotelAuth,
    hotelVerified,
    roomValidator,
    billMiddleware
}