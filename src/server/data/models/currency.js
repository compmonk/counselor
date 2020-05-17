const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: mongoose.Schema.Types.String,
    currency: mongoose.Schema.Types.String,
});

module.exports = mongoose.model("currency", currencySchema, "currency");