const MUUID = require("uuid-mongodb");
const collections = require("./index");
const _ = require("underscore");
const stellarService = require("../services/stellarService");
const articleConfig = require("../settings").articleConfig;
const stellarConfig = require("../settings").stellarConfig;
const mongoConfig = require("../settings");
const User123 = require("../models/users");
const Sessions123 = require("../models/sessions");
const Article123 = require("../models/articles");
const mongoose = require("mongoose");

const sessions = collections.sessions;
const userfunction = require("./users");
const conn = mongoose.connect(mongoConfig.env.serverUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: mongoConfig.env.database,
});

mongoose.connection
  .once("open", () =>
    console.log("Connected to Atlas Using Mongoose inside data/articles")
  )
  .on("error", (error) => {
    console.log("error is: " + error);
  });

// const articles = collections.articles;
// const users = collections.users;

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

  //   newArticle._id = MUUID.v4();
  //   let author = null;
  try {
    // authorId = MUUID.from(authorId);

    // const usersCollection = await users();
    // await usersCollection
    //   .updateOne(
    //     { _id: authorId },
    //     {
    //       $push: {
    //         published: {
    //           articleId: newArticle._id,
    //           reward: parseInt(articleConfig.initialCost),
    //         },
    //       },
    //     }
    //   )
    //   .then(async function (updateInfo) {
    //     if (updateInfo.modifiedCount === 0) {
    //       error.message = JSON.stringify({
    //         error: "could not update published article",
    //         errors: errors,
    //       });
    //       error.http_code = 400;
    //       throw error;
    //     }
    //   });
    // await usersCollection
    //   .updateOne(
    //     { _id: authorId },
    //     {
    //       $push: {
    //         rewards: {
    //           articleId: newArticle._id,
    //           reward: parseInt(articleConfig.initialCost),
    //         },
    //       },
    //     }
    //   )
    //   .then(async function (updateInfo) {
    //     if (updateInfo.modifiedCount === 0) {
    //       error.message = JSON.stringify({
    //         error: "could not update published article",
    //         errors: errors,
    //       });
    //       error.http_code = 400;
    //       throw error;
    //     }
    //   });
    // author = await usersCollection.findOne({ _id: authorId });
    // await usersCollection.updateOne(
    //   { _id: authorId },
    //   {
    //     $set: { balance: author.balance + parseInt(articleConfig.initialCost) },
    //   }
    // );
    if (authorId === undefined || authorId === null) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
    }
    // Added By Sanam to Implement Mongoose
    if (typeof authorId === "string") {
      try {
        authorId = MUUID.from(authorId);
      } catch (e) {
        errors["id"] = e.message;
        error.http_code = 400;
        error.message = JSON.stringify({
          errors: errors,
        });
        throw error;
      }
    } else {
      try {
        MUUID.from(authorId);
      } catch (e) {
        errors["id"] = "id is not defined";
        error.http_code = 400;
        error.message = JSON.stringify({
          errors: errors,
        });
        throw error;
      }
    }
    // commented by sanam
    const test1 = new Article123({
      _id: MUUID.v4(),
      title: newArticle.title,
      text: newArticle.text,
      html: newArticle.html,
      keywords: newArticle.keywords,
      ratings: [],
      author: authorId,
      cost: mongoConfig.articleConfig.initialCost,
      read: 0,
      rating: 0,
    });
    const projection = {
      balance: true,
    };
    const upd = await userfunction.getUserById(authorId, projection);
    const sanam = test1
      .save()
      .then((result) => {
        const newId = MUUID.from(result._id).toString();
        //adding published
        User123.updateOne(
          { _id: authorId },
          {
            $push: {
              published: {
                articleId: result._id,
                cost: mongoConfig.articleConfig.initialCost,
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

        // const upd = getUserById(authorId, projection);
        var bal = upd.balance;
        bal = bal + parseInt(mongoConfig.articleConfig.initialCost);
        const jena = {
          balance: bal,
        };
        User123.updateOne({ _id: authorId }, { $set: jena })
          .exec()
          .then((doc) => {
            return doc;
          })
          .catch((err) => {
            console.log(err);
            return err.message;
          });
        return get(newId);
      })
      .catch((error) => {
        console.log(error);
        return error.message;
      });
    return sanam;
  } catch (e) {
    throw e;
  }
  //   newArticle.ratings = [];
  //   newArticle.cost = parseInt(articleConfig.initialCost);
  //   newArticle.read = 0;
  //   newArticle.rating = 0;
  //   newArticle.author = authorId;
  //   const articleCollection = await articles();

  //   const insertInfo = await articleCollection.insertOne(newArticle);

  //   if (insertInfo.insertedCount === 0) {
  //     error.message = JSON.stringify({
  //       error: "could not create task",
  //       object: newArticle,
  //       errors: errors,
  //     });
  //     error.http_code = 400;
  //     throw error;
  //   }

  //   await stellarService.transfer(
  //     stellarConfig.masterPrivateKey,
  //     author.privateKey,
  //     articleConfig.initialCost
  //   );

  //   const newId = insertInfo.insertedId.toString();

  //   return await get(newId);
}

async function getpublishedbyuser(userId) {
  const sanam = await userfunction.getPublished(userId);
  return sanam;
}

async function getpurchasedbyuser(userId) {
  const sanam = await userfunction.getPurchased(userId);
  return sanam;
}

async function get(articleId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (articleId === undefined || articleId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }

  if (typeof articleId === "string") {
    try {
      articleId = MUUID.from(articleId);
    } catch (e) {
      errors["id"] = e.message;
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  } else {
    try {
      articleId = MUUID.from(articleId);
    } catch (e) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  }
  //   const articleCollection = await articles();

  //   let article = await articleCollection.findOne({ _id: articleId });

  //   if (article === null) {
  //     errors["id"] = `article with id ${articleId} doesn't exists`;
  //     error.http_code = 404;
  //     error.message = JSON.stringify({
  //       errors: errors,
  //     });
  //     throw error;
  //   }
  //   article._id = MUUID.from(article._id).toString();
  //   article.author = MUUID.from(article.author).toString();

  //   return article;
  // commented by sanam
  const sanam = Article123.findOne({ _id: articleId })
    .exec()
    .then((doc) => {
      return doc;
    })
    .catch((error) => {
      console.log(error);
      return error.message;
    });
  return sanam;
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

  //   added by sanam
  if (articleId === undefined || articleId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }
  // Added By Sanam to Implement Mongoose
  if (typeof articleId === "string") {
    try {
      articleId = MUUID.from(articleId);
    } catch (e) {
      errors["id"] = e.message;
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  } else {
    try {
      MUUID.from(articleId);
    } catch (e) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  }

  try {
    // const oldArticle = await get(articleId);

    // const articleCollection = await articles();

    // return await articleCollection
    //   .updateOne({ _id: MUUID.from(articleId) }, { $set: updatedArticle })
    //   .then(async function (updateInfo) {
    //     if (updateInfo.modifiedCount === 0) {
    //       error.message = JSON.stringify({
    //         error: "could not update task",
    //         object: updatedArticle,
    //         errors: errors,
    //       });
    //       error.http_code = 400;
    //       throw error;
    //     }
    //     return await get(articleId);
    //   });

    // commented and updated by Sanam to implement mongoose
    const sanam = Article123.updateOne(
      { _id: articleId },
      { $set: updatedArticle }
    )
      .exec()
      .then((doc) => {
        return doc;
      })
      .catch((err) => {
        console.log(err);
        return err.message;
      });
    return sanam;
  } catch (e) {
    throw e;
  }
}

async function main() {
  try {
    const newArticle = {
      title: "CS 513",
      text: "Knowledge Dis & Data Mining",
      html: "html",
      keywords: ["KDD", "DataMining"],
    };
    // const result = await create(
    //   newArticle,
    //   "2f644541-cb03-429f-850b-b61489d79ce1"
    // );
    // const result = await getpublishedbyuser(
    //   "2f644541-cb03-429f-850b-b61489d79ce1"
    // );
    // const result = await getpurchasedbyuser(
    //   "2f644541-cb03-429f-850b-b61489d79ce1"
    // );
    const updatedArticle = {
      title: "CS 513 KDD",
      text: "Knowledge Discovery & Data Mining",
      html: "HTML",
      keywords: ["KDD", "DataMining", "CS513"],
    };
    const result = await update(
      "b7eba257-c7d5-4188-80fa-e494038790bd",
      updatedArticle
    );
    console.log("Result => " + result);
  } catch (error) {
    console.log(error);
  }
}

main();

module.exports = {
  create,
  get,
  update,
};
