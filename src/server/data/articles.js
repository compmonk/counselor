const _ = require("underscore");
const stellarService = require("../services/stellarService");
const articleConfig = require("../../settings").articleConfig;
const stellarConfig = require("../../settings").stellarConfig;
const userModel = require("./models/user");
const articleModel = require("./models/article");
const mongoose = require("mongoose");

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
    const projection = {
      balance: true,
    };
    const upd = await userDao.getUserById(authorId, projection);
    const result = test1
      .save()
      .then((result) => {
        const newId = result._id;
        //adding published
        userModel
          .updateOne(
            { _id: authorId },
            {
              $push: {
                published: {
                  articleId: result._id,
                  cost: articleConfig.initialCost,
                },
              },
            }
          )
          .exec()
          .then((res) => {
            return res;
          })
          .catch((error) => {
            console.log(error);
            return error.message;
          });

        //adding balance

        var bal = upd.balance;
        bal = bal + parseInt(articleConfig.initialCost);
        const updbal = {
          balance: bal,
        };
        userModel
          .updateOne({ _id: authorId }, { $set: updbal })
          .exec()
          .then((doc) => {
            return doc;
          })
          .catch((err) => {
            throw (errors["message"] = err.message);
            // return err.message;
          });
        return get(newId);
      })
      .catch((error1) => {
        throw (errors["message"] = error1.message);
        // return error.message;
      });
    let transResult = await stellarService.transfer(
      stellarConfig.masterPrivateKey,
      author.privateKey,
      articleConfig.initialCost
    );
    if (!transResult)
      throw (errors["message"] = "Can not successfully transfer payment");
    return result;
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
      { _id: articleId },
      projection
    );

    if (articleInfo == null) {
      errors["message"] = `Article with Id ${articleId} does not exist`;
      error.http_code = 400;
      error.message = JSON.stringify({ errors: errors });
      throw error;
    }
    return articleInfo._doc;
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

  if (error.http_code !== 200) {
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }

  if (articleId === undefined || articleId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }

  try {
    const change = await articleModel.update(
      { _id: articleId },
      { $set: updatedArticle }
    );
    if (change.nModified == 0) {
      errors["message"] = `Cannot update Article with ID ${articleId}`;
      error.http_code = 400;
      error.message = JSON.stringify({ errors: errors });
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

//Updated
module.exports = {
  create,
  get,
  update,
  getAll,
};
