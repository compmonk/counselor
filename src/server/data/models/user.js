const mongoose = require("mongoose");

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: mongoose.Schema.Types.String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Email address is required",
        validate: [validateEmail, "Please fill a valid email address"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    firstName: mongoose.Schema.Types.String,
    lastName: mongoose.Schema.Types.String,
    currency: mongoose.Schema.Types.String,
    published: mongoose.Schema.Types.Mixed,
    purchased: mongoose.Schema.Types.Mixed,
    courses: mongoose.Schema.Types.Mixed,
    balance: mongoose.Schema.Types.Number,
    privateKey: mongoose.Schema.Types.String,
    publicKey: mongoose.Schema.Types.String,
    canvasToken: mongoose.Schema.Types.String,
    canvasUserId: mongoose.Schema.Types.Number,
    firebaseId: mongoose.Schema.Types.String,
    createdAt: mongoose.Schema.Types.Date,
    lastLoginAt: mongoose.Schema.Types.Date
});

module.exports = mongoose.model("users", userSchema);