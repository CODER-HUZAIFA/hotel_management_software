import { Router } from "express";
import { hotelHandler, hotelRoomHandler } from "../controllers/hotel.controller.js";
import { billMiddleware, hotelAuth, hotelVerified, roomValidator } from "../middlewares/hotel.middleware.js";
import { checkOutHandler, roomBooking } from "../controllers/room.controller.js";

const router = Router()

router.get("/", hotelAuth, (req, res) => {
    res.render("hotelCreate", {
        user: req.user,
    })
})

router.get("/:hotelId/dashboard", hotelAuth, hotelVerified, billMiddleware, (req, res) => {
    res.render("hotelDashboard", {
        user: req.user,
        hotel: req.hotel,
    })
});

router.get("/:hotelId/today_bills", hotelAuth, hotelVerified, billMiddleware, (req, res) => {
    res.render("customerHistory", {
        user: req.user,
        hotel: req.hotel,
        bill: req.bill
    });
})

router.get("/:hotelId/room/:roomId", hotelAuth, hotelVerified, roomValidator, (req, res) => {
    res.render("roomsManage", {
        user: req.user,
        hotel: req.hotel,
        room: req.room,
        time: req.time,
    })
})

router.post("/:hotelId/room/:roomId/room_booking", hotelAuth, hotelVerified, roomValidator, roomBooking);
router.post("/create", hotelHandler)
router.post("/:hotelId/room", hotelRoomHandler)
router.post("/:hotelId/room/:roomId/checkout", hotelAuth, hotelVerified, roomValidator, checkOutHandler)

export default router