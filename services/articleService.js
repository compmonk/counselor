const articles = require("../data/articles");
const userfunction = require("../data/users");
const usersmodel = require("../data/models/users");
const articlesmodel = require("../data/models/articles");
const ObjectId = require("mongodb").ObjectId;

async function purchase(articleId, purchaserId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  if (typeof articleId === "string") {
    articleId = new ObjectId(articleId);
  }
  let article = await articles.get(articleId);
  let purchaser = await userfunction.getUserById(purchaserId);

  if (article.author === purchaser._id) {
    errors["article"] = "publisher can't purchase the same article";
    error.http_code = 400;
  }

  if (error.http_code !== 200) {
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }

  for (let i = 0; i < purchaser.purchased.length; i++) {
    if (purchaser.purchased[i].articleId === articleId) {
      errors["article"] = "article is already purchased";
      error.http_code = 400;
      break;
    }
  }

  if (error.http_code !== 200) {
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }

  if (purchaser.balance < article.cost) {
    errors["article"] = "insufficient balance";
    error.http_code = 400;
  }

  if (error.http_code !== 200) {
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }
  purchaser.purchased.push({
    articleId: articleId,
    cost: article.cost,
  });
  purchaser.balance -= article.cost;

  await userfunction.updateUser(
    purchaserId,
    {
      purchased: purchaser.purchased,
      balance: purchaser.balance,
    },
    true
  );

  let author = await userfunction.getUserById(article.author);

  for (let i = 0; i < author.published.length; i++) {
    if (author.published[i].articleId === articleId) {
      author.published[i].cost += article.cost;
    }
  }
  author.balance += article.cost;

  await userfunction.updateUser(
    article.author,
    {
      published: author.published,
      balance: author.balance,
    },
    true
  );

  const artupd = await articles.get(article._id);
  artupd.read += 1;

  const result = await articles.update(artupd._id, artupd, true);
  console.log("purchase finished", result);
  // return await articles.update(article._id, { read: article.read + 1 }, true);
  return result.nModified;
}

module.exports = {
  purchase,
};
