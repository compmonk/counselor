const articles = require("../data/articles");
const userDao = require("../data/users");
const stellarService = require("./stellarService");
const articleModel = require("../data/models/article");
const ObjectId = require("mongodb").ObjectId;

async function purchase(articleId, purchaserId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    try {
        if (typeof articleId === "string") {
            articleId = new ObjectId(articleId);
        }
        let article = await articles.get(articleId);
        let purchaser = await userDao.getUserById(purchaserId);
        let author = await userDao.getUserById(article.author);

        if (author._id.toString() === purchaser._id.toString()) {
            errors["article"] = "publisher can't purchase the same article";
            error.http_code = 400;
        }

        if (error.http_code !== 200) {
            error.message = JSON.stringify({errors: errors});
            throw error;
        }

        for (let i = 0; i < purchaser.purchased.length; i++) {
            if (purchaser.purchased[i].articleId.toString() === articleId.toString()) {
                errors["article"] = "article is already purchased";
                error.http_code = 400;
                break;
            }
        }

        if (error.http_code !== 200) {
            error.message = JSON.stringify({errors: errors});
            throw error;
        }

        if (purchaser.balance < article.cost) {
            errors["article"] = "insufficient balance";
            error.http_code = 402;
        }

        if (error.http_code !== 200) {
            error.message = JSON.stringify({errors: errors});
            throw error;
        }

        const transferResult = await stellarService.transfer(purchaser.privateKey, author.privateKey, `${article.cost}`)
        if (!transferResult) {
            errors["stellar"] = "Can not successfully transfer payment"
            error.http_code = 402;
            error.message = JSON.stringify({errors: errors});
        }

        purchaser.purchased.push({
            articleId: articleId,
            cost: article.cost,
        });
        purchaser.balance -= article.cost;

        await userDao.updateUser(
            purchaserId,
            {
                purchased: purchaser.purchased,
                balance: purchaser.balance,
            },
            true
        );

        for (let i = 0; i < author.published.length; i++) {
            if (author.published[i].articleId === articleId) {
                author.published[i].cost += article.cost;
            }
        }
        author.balance += article.cost;

        let resultModified = await userDao.updateUser(
            article.author,
            {
                published: author.published,
                balance: author.balance,
            },
            true
        );
        if (resultModified.nModified == 0) {
            errors["message"] = `Cannot update Article with ID ${articleId}`;
            error.http_code = 400;
            error.message = JSON.stringify({errors: errors});
            throw error;
        }

        article.read += 1;

        const result = await articleModel.updateOne(
            {_id: articleId},
            {$set: article}
        );
        if (result.nModified === 0) {
            errors["message"] = `Cannot update Article with ID ${articleId}`;
            error.http_code = 400;
            error.message = JSON.stringify({errors: errors});
            throw error;
        }

        return article;
    } catch (e) {
        throw e
    }
}

module.exports = {
    purchase,
};
