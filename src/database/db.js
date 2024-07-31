import mongoose from "mongoose";

const dbConnection = async () => {
    const db = await mongoose.connect("mongodb://localhost:27017/Hotel_Management")
    console.log(`DataBase is connected Successfuly at ${db.connection.host}`)
}

export default dbConnection;