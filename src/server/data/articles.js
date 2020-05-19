const _ = require("underscore");
const stellarService = require("../services/stellarService");
const articleConfig = require("../../settings").articleConfig;
const stellarConfig = require("../../settings").stellarConfig;
const userModel = require("./models/user");
const articleModel = require("./models/article");
const mongoose = require("mongoose");
const redisClient = require("../core/redisClient");

const userDao = require("./users");

async function create(newArticle, authorId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newArticle === undefined || _.isEmpty(newArticle)) {
        errors["task"] = "task object not defined";
        error.http_code = 400;
    } else if (typeof newArticle !== "object") {
        errors["task"] = "invalid type of task";
        error.http_code = 400;
    }

    if (!newArticle.hasOwnProperty("title")) {
        errors["title"] = "missing property";
        error.http_code = 400;
    } else if (typeof newArticle["title"] !== "string") {
        errors["title"] = "invalid type";
        error.http_code = 400;
    }

    if (!newArticle.hasOwnProperty("text")) {
        errors["text"] = "missing property";
        error.http_code = 400;
    } else if (typeof newArticle["text"] !== "string") {
        errors["text"] = "invalid type";
        error.http_code = 400;
    }

    if (!newArticle.hasOwnProperty("html")) {
        newArticle["html"] = "";
    } else if (typeof newArticle["html"] !== "string") {
        errors["html"] = "invalid type";
        error.http_code = 400;
    }

    if (!newArticle.hasOwnProperty("keywords")) {
        newArticle["keywords"] = [];
    } else if (!Array.isArray(newArticle["keywords"])) {
        errors["keywords"] = "invalid type";
        error.http_code = 400;
    }

    try {
        if (authorId === undefined || authorId === null) {
            errors["id"] = "id is not defined";
            error.http_code = 400;
        }

        if (typeof authorId === "string") {
            try {
                authorId = new mongoose.Types.ObjectId(authorId);
            } catch (e) {
                throw e;
            }
        }

        const test1 = new articleModel({
            _id: new mongoose.Types.ObjectId(),
            title: newArticle.title,
            text: newArticle.text,
            html: newArticle.html,
            keywords: newArticle.keywords,
            ratings: [],
            author: authorId,
            cost: articleConfig.initialCost,
            read: 0,
            rating: 0,
        });
        // const projection = {
        //   balance: true,
        // };
        const author = await userDao.getUserById(authorId);
        const article = await test1.save();
        const userPubupd = await userModel.updateOne(
            {_id: authorId},
            {
                $push: {
                    published: {
                        articleId: article._doc._id,
                        cost: articleConfig.initialCost,
                    },
                },
            }
        );

        //adding balance
        var bal = author.balance;
        bal = bal + parseInt(articleConfig.initialCost);
        const updbal = {
            balance: bal,
        };
        const addbal = await userModel.updateOne(
            {_id: authorId},
            {$set: updbal}
        );

        let transResult = await stellarService.transfer(
            stellarConfig.masterPrivateKey,
            author.privateKey,
            articleConfig.initialCost
        );
        if (!transResult)
            throw (errors["message"] = "Can not successfully transfer payment");
        return article;
    } catch (e) {
        throw e;
    }
}

async function get(articleId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (articleId === undefined || articleId === null) {
        errors["id"] = "id is not defined";
        error.http_code = 400;
    }

    const projection = {
        __v: false,
    };
    try {
        const articleInfo = await articleModel.findOne(
            {_id: articleId},
            projection
        );

        if (articleInfo == null) {
            errors["message"] = `Article with Id ${articleId} does not exist`;
            error.http_code = 400;
            error.message = JSON.stringify({errors: errors});
            throw error;
        }
        return articleInfo._doc;
    } catch (e) {
        throw e;
    }
}

async function updateByAuthor(
    articleId,
    updatedArticle,
    updaterId,
    partial = false
) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    try {
        const getArt = await get(articleId);
        if (getArt.author.toString() === updaterId) {
            return await update(articleId, updatedArticle, partial);
        } else {
            errors[
                "article"
                ] = `User ${updaterId} is not the author of articleId ${articleId}`;
            error.http_code = 403;
            error.message = JSON.stringify({errors: errors});
            throw error;
        }
    } catch (e) {
        throw e;
    }
}

async function update(articleId, updatedArticle, partial = false) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (updatedArticle === undefined || _.isEmpty(updatedArticle)) {
        errors["article"] = "article object not defined";
        error.http_code = 400;
    } else if (typeof updatedArticle !== "object") {
        errors["article"] = "invalid type of article";
        error.http_code = 400;
    }

    if (!partial && !updatedArticle.hasOwnProperty("title")) {
        errors["title"] = "missing property";
        error.http_code = 400;
    } else if (
        updatedArticle.hasOwnProperty("title") &&
        typeof updatedArticle["title"] !== "string"
    ) {
        errors["title"] = "invalid type";
        error.http_code = 400;
    }

    if (!partial && !updatedArticle.hasOwnProperty("text")) {
        errors["text"] = "missing property";
        error.http_code = 400;
    } else if (
        updatedArticle.hasOwnProperty("text") &&
        typeof updatedArticle["text"] !== "string"
    ) {
        errors["text"] = "invalid type";
        error.http_code = 400;
    }

    if (!partial && !updatedArticle.hasOwnProperty("html")) {
        errors["html"] = "missing property";
        error.http_code = 400;
    } else if (
        updatedArticle.hasOwnProperty("html") &&
        typeof updatedArticle["html"] !== "string"
    ) {
        errors["html"] = "invalid type";
        error.http_code = 400;
    }

    if (!updatedArticle.hasOwnProperty("keywords")) {
        updatedArticle["keywords"] = [];
    } else if (!Array.isArray(updatedArticle["keywords"])) {
        errors["keywords"] = "invalid type";
        error.http_code = 400;
    }
    if (!partial && !updatedArticle.hasOwnProperty("ratings")) {
        errors["ratings"] = "missing property";
        error.http_code = 400;
    }
    if (updatedArticle.hasOwnProperty("author") && typeof updatedArticle.author === "string") {
        try {
            updatedArticle.author = new mongoose.Types.ObjectId(
                updatedArticle.author
            );
        } catch (e) {
            throw e;
        }
    }
    if (updatedArticle.hasOwnProperty("ratings") && Array.isArray(updatedArticle.ratings)) {
        for (var i = 0; i < updatedArticle.ratings.length; i++) {
            if (typeof updatedArticle.ratings[i].reviewerId === "string") {
                try {
                    updatedArticle.ratings[i].reviewerId = new mongoose.Types.ObjectId(
                        updatedArticle.ratings[i].reviewerId
                    );
                } catch (e) {
                    throw e;
                }
            }
        }
    }
    if (error.http_code !== 200) {
        error.message = JSON.stringify({errors: errors});
        throw error;
    }

    try {
        delete updatedArticle._id;
        if (updatedArticle.hasOwnProperty("ratings") && Array.isArray(updatedArticle.ratings)) {
            let totalRating = 0;
            for (var i = 0; i < updatedArticle.ratings.length; i++) {
                totalRating = totalRating + updatedArticle.ratings[i].rating;
            }
            let avgRating = totalRating / updatedArticle.ratings.length;
            updatedArticle.rating = avgRating;
        }

        const change = await articleModel.update(
            {_id: articleId},
            {$set: updatedArticle}
        );
        if (change.nModified == 0) {
            errors["message"] = `Cannot update Article with ID ${articleId}`;
            error.http_code = 400;
            error.message = JSON.stringify({errors: errors});
            throw error;
        }
        const result = await get(articleId);
        return result;
    } catch (e) {
        throw e;
    }
}

async function getAll() {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    const projection = {
        __v: false,
    };

    try {
        const allart = await articleModel.find({}, projection);
        if (allart.length === 0) {
            errors["users"] = `There are no articles to display`;
            error.http_code = 404;
            error.message = JSON.stringify({
                errors: errors,
            });
            throw error;
        }
        return allart;
    } catch (e) {
        throw e;
    }
}

async function getArticleByIdForUser(articleId, userId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    try {
        const permittedArticles = await userDao.getRecommendation(userId);
        for (var i = 0; i < permittedArticles.length; i++) {
            if (permittedArticles[i].toString() === articleId) {
                const article_res = await get(articleId);
                return article_res;
            }
        }
        errors[
            "article"
            ] = `The user with Id ${userId} is not authorized to view article with ID ${articleId}`;
        error.http_code = 403;
        error.message = JSON.stringify({
            errors: errors,
        });
        throw error;
    } catch (e) {
        throw e;
    }
}

//Updated
module.exports = {
    create,
    get,
    update,
    getAll,
    updateByAuthor,
    getArticleByIdForUser,
};
