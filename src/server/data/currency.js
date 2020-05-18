const currencyModel = require("./models/currency");
const mongoose = require("mongoose")
const redisClient = require("../core/redisClient")

async function getAllCurrencies() {
    try {
        const idx = await redisClient.llenAsync("currencies");
        if (idx !== 0) {
            return await redisClient.lrangeAsync(
                "currencies", 0, -1).map(JSON.parse);
        }
        const currencies = await currencyModel.find({})
        const multi = redisClient.multi()
        currencies.map(JSON.stringify).map((currency) => multi.rpush("currencies", currency))
        await multi.exec()
        return currencies
    } catch (e) {
        throw e
    }
}

module.exports = {
    getAllCurrencies
};
