const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    username: String,
    password: String
});

module.exports = User = mongoose.model("users", UserSchema);