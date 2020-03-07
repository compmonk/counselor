const MUUID = require('uuid-mongodb');
const collections = require("./index");
const _ = require('underscore');
const articles = collections.articles;
async function create(newArticle) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newArticle === undefined || _.isEmpty(newArticle)) {
        errors['task'] = "task object not defined";
        error.http_code = 400
    } else if (typeof newArticle !== "object") {
        errors['task'] = "invalid type of task";
        error.http_code = 400
    }

    if (!newArticle.hasOwnProperty("title")) {
        errors['title'] = "missing property";
        error.http_code = 400
    } else if (typeof newArticle["title"] !== "string") {
        errors['title'] = "invalid type";
        error.http_code = 400
    }

    if (!newArticle.hasOwnProperty("text")) {
        errors['text'] = "missing property";
        error.http_code = 400
    } else if (typeof newArticle["text"] !== "string") {
        errors['text'] = "invalid type";
        error.http_code = 400
    }

    if (!newArticle.hasOwnProperty("html")) {
        newArticle["html"] = "";
    } else if (typeof newArticle["html"] !== "string") {
        errors['html'] = "invalid type";
        error.http_code = 400
    }

    if (!newArticle.hasOwnProperty("author")) {
        errors['author'] = "missing property";
        error.http_code = 400
    } else if (typeof newArticle["author"] === "string") {
        try {
            newArticle["author"] = MUUID.from(newArticle["author"]);
        } catch (e) {
            errors['author'] = e.message;
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    } else {
        try {
            newArticle["author"] = MUUID.from(newArticle["author"]);
        } catch (e) {
            errors['author'] = "id is not defined";
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    }

    if (!newArticle.hasOwnProperty("keywords")) {
        newArticle["keywords"] = []
    } else if (!Array.isArray(newArticle["keywords"])) {
        errors['keywords'] = "invalid type";
        error.http_code = 400
    }

    newArticle._id = MUUID.v4();
    newArticle.ratings=0;
    newArticle.cost=1;
    newArticle.read=0;
    const articleCollection = await articles();

    const insertInfo = await articleCollection.insertOne(newArticle);

    if (insertInfo.insertedCount === 0) {
        error.message = JSON.stringify({
            'error': "could not create task",
            'object': newArticle,
            'errors': errors
        });
        error.http_code = 400;
        throw error
    }

    const newId = insertInfo.insertedId.toString();

    return await get(newId);
}
async function get(articleId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (articleId === undefined || articleId === null) {
        errors['id'] = "id is not defined";
        error.http_code = 400
    }

    if (typeof articleId === "string") {
        try {
            articleId = MUUID.from(articleId);
        } catch (e) {
            errors['id'] = e.message;
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    } else {
        try {
            articleId = MUUID.from(articleId);
        } catch (e) {
            errors['id'] = "id is not defined";
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    }
    const articleCollection = await articles();

    let article = await articleCollection.findOne({_id: articleId});

    if (article === null) {
        errors['id'] = `article with id ${articleId} doesn't exists`;
        error.http_code = 404;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }
    article._id = MUUID.from(article._id).toString();
    article.author = MUUID.from(article.author).toString();

    return article;
}
module.exports = {
    create,
    get
};