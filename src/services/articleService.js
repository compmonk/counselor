const MUUID = require("uuid-mongodb");

const articles = require("../data/articles");
const users = require("../data/users");


async function purchase(articleId, purchaserId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    let article = await articles.get(articleId);
    let purchaser = await users.getUserById(purchaserId);

    if (article.author === purchaser._id) {
        errors["article"] = "publisher can't purchase the same article";
        error.http_code = 400;
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    for (let i = 0; i < purchaser.purchased.length; i++) {
        if (purchaser.purchased[i].articleId === MUUID.from(articleId)) {
            errors["article"] = "article is already purchased";
            error.http_code = 400;
        }
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    if (purchaser.balance < article.cost) {
        errors["article"] = "insufficient balance";
        error.http_code = 400;
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    purchaser.purchased.push({
        "articleId": MUUID.from(articleId),
        "cost": article.cost
    });
    purchaser.balance -= article.cost;

    await users.updateUser(purchaserId, {
        "purchased": purchaser.purchased,
        "balance": purchaser.balance
    }, true);

    let author = await users.getUserById(article.author);

    for (let i = 0; i < author.rewards.length; i++) {
        if (author.rewards[i].articleId === MUUID.from(articleId)) {
            author.rewards[i].reward += article.cost;
        }
    }
    author.balance += article.cost;

    await users.updateUser(article.author, {
        "rewards": author.rewards,
        "balance": author.balance
    }, true);

    return await articles.update(article._id, {"read": article.read + 1}, true)
}

module.exports = {
    purchase
};