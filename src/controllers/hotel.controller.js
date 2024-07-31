import { Hotel } from "../models/hotel.models.js"
import { User } from "../models/user.models.js";
import { tokenVerify } from "../utils/auth.js";
import { client } from "../utils/redis_client.js";

const hotelHandler = async (req, res) => {
    const id = tokenVerify(req.cookies.uid)

    const owner = await  User.findOne({ _id: id.objectId })

    const hotel = await Hotel.create({
        name: req.body.name,
        address: req.body.address,
        owner: id.objectId,
        phoneNumber: req.body.phoneNumber,
    });


    owner.hotels.push(hotel._id)
    await owner.save();
    res.redirect(`/user/${owner._id}/hotel/${hotel._id}/dashboard`)
}

const hotelRoomHandler = async (req, res) => {
    const owner = tokenVerify(req.cookies.uid)
    if(!owner) return res.send("Error");

    const hotel = await Hotel.findOne({ _id: req.params.hotelId })
    await client.del(`user:${hotel.owner}:hotel:${hotel._id}`)

    const room = {
        roomNumber: req.body.roomNumber,
        price: req.body.price,
        capacity: req.body.capacity,
        type: req.body.type
    }
    
    hotel.rooms.push(room)
    await hotel.save()

    res.redirect(`/user/${owner.objectId}/hotel/${hotel._id}/dashboard`)
}

export {
    hotelHandler,
    hotelRoomHandler
}