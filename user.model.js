const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true }, 
        firstName: { type: String, required: true }, 
        lastName: { type: String, required: true }, 
        middleName: { type: String }, 
        email: { type: String, required: true, unique: true, lowercase: true }, 
        password: { type: String, required: true }, 
        
    },
    { collection: "user-data" } 
);

module.exports = mongoose.model("User", UserSchema);