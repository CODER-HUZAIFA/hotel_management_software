import { Hotel } from "../models/hotel.models.js";
import { User } from "../models/user.models.js";

const billsHandler = async (hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    if(!hotel) throw "Error";

    const todayBill = {
        date: Date(),
        checkInRooms: [],
        checkOutRooms: [],
        business: 0,
        finalAmount: 0,
    }

    await hotel.save();
    return todayBill;
};

const roomsCheckInHandler = async (hotelId, roomId) => {
    const hotel = await Hotel.findById(hotelId._id)
    const room = hotel.rooms.id(roomId._id);

    if(!room) throw "Room not Found";
    const todayDate = new Date();
    let todayBill = hotel.billsHistory.find(bill => todayDate.toDateString() == bill.date.toDateString());
    if(!todayBill) {
        todayBill = await billsHandler(hotel._id);
        hotel.billsHistory.push(todayBill);
    };
    todayBill.checkInRooms.push(room);

    const finalResult = await finalAmountHandler(hotel)
    todayBill.gst = finalResult.gst;
    todayBill.finalAmount = finalResult.totalAmount + finalResult.gst;
    todayBill.business = finalResult.totalAmount;
    await hotel.save();
};

const roomCheckOutHandler = async (hotelId, roomId) => {
    const hotel = await Hotel.findById(hotelId);
    const room = hotel.rooms.id(roomId);

    if(!room) throw "Error: Room not found for CheckOut";
    const todayDate = new Date();
    let todayBill = hotel.billsHistory.find(bill => bill.date.toDateString() == todayDate.toDateString());
    if(!todayBill) {
        todayBill = await billsHandler(hotel._id);
        hotel.billsHistory.push(todayBill);
    };
    todayBill.checkOutRooms.push(room);
    await hotel.save();
    return;
}

const finalAmountHandler = async (hotel) => {
    const todayDate = new Date();
    let todayBill = hotel.billsHistory.find(bill => todayDate.toDateString() == bill.date.toDateString());

    let totalAmount = 0;
    todayBill.checkInRooms.forEach(room => {
        totalAmount += room.price;
    }); 
    const gst = totalAmount * 0.05
    return {
        gst,
        totalAmount
    }
}

export {
    billsHandler,
    roomsCheckInHandler,
    roomCheckOutHandler
}