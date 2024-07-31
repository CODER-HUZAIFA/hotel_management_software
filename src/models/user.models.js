import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    hotels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
        }
    ],
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);