import { Hotel } from "../models/hotel.models.js";
import { billsHandler, roomCheckOutHandler, roomsCheckInHandler } from "../utils/bills.js";
import { client, flushDb } from "../utils/redis_client.js";


const roomBooking = async (req, res) => {
    const { name, email, number, person, settle } = req.body;
    const checkIn = new Date();
    
    await client.del(`user:${req.hotel.owner}:hotel:${req.hotel._id}`)

    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }

    // Find the specific room by ID
    const room = hotel.rooms.id(req.params.roomId);

    room.customer = {
        name,
        email,
        phoneNumber: number,
        persons: person,
        settlementAmount: settle,
        checkIn,
        roomNo: room.roomNumber,
    };
    room.availability = "Not Available";
    await hotel.save()
    roomsCheckInHandler(hotel, room);
    return res.redirect(`/user/${req.user._id}/hotel/${req.hotel._id}/dashboard`)
};


const checkOutHandler = async (req, res) => {
    const hotel = await Hotel.findById(req.params.hotelId);
    const checkOut = new Date();

    await client.del(`user:${req.hotel.owner}:hotel:${req.hotel._id}`)

    if(!hotel) {
        res.redirect(`/user/${req.user._id}`)
        return;
    };

    const room = hotel.rooms.find(r => r._id.toString() == req.room._id);
    if(!room) {
        res.redirect(`/user/${req.user._id}/hotel/${req.hotel._id}`);
        return;
    };

    
    room.customer.checkOut = checkOut;
    hotel.customerHistory.push(room.customer);
    
    roomCheckOutHandler(hotel._id, room._id);
    room.customer = null;
    room.availability = "Available";
    await hotel.save();
    
    res.redirect(`/user/${req.user._id}/hotel/${req.hotel._id}/dashboard`);
}

export {
    roomBooking,
    checkOutHandler,
}