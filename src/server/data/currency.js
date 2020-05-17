const currencyModel = require("./models/currency");
const mongoose = require("mongoose")

async function getAllCurrencies() {
    try {
        const currencies = await currencyModel.find({})
        return currencies
    } catch (e) {
        throw e
    }
}

module.exports = {
    getAllCurrencies
};
