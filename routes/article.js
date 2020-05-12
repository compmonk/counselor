const express = require("express");
const router = express.Router();
const MUUID = require("uuid-mongodb");
const articles = require("../data/articles");
const users = require("../data/users");
const articleService = require("../services/articleService");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/", async (request, response) => {
  try {
    var skip = 0;
    var take = 20;
    if (request.query.skip) {
      skip = parseInt(request.query.skip);
      if (isNaN(skip)) throw "Value of skip should be a number";
    }
    if (request.query.take) {
      take = parseInt(request.query.take);
      if (isNaN(take)) throw "Value of take should be a number";
    }
    const articleList = await articles.getAll();
    response.json(articleList.slice(skip).slice(0, take));
  } catch (e) {
    // response.setHeader("content-type", "application/json");
    // response.status(e.http_code).send(e.message);
    response.status(400).json({ error: e });
  }
});

router.get("/:id", async (request, response) => {
  try {
    let article_res;
    const personIdx = await client.hmgetAsync("ArticleIds", request.params.id);
    if (personIdx[0] === null) {
      // person = await data.getById(request.params.id);
      article_res = await articles.get(request.params.id);
      if (article_res == null) {
        throw "Article Id not found";
      }
      await client.rpushAsync("ArticleList", JSON.stringify(article_res));
      const idx = await client.llenAsync("ArticleList");
      await client.hmsetAsync("ArticleIds", article_res.id, idx);
    } else {
      article_res = await client.lrangeAsync(
        "ArticleList",
        personIdx[0] - 1,
        personIdx[0] - 1
      );
      await client.rpushAsync("ArticleList", article_res[0]);
      article_res = JSON.parse(article_res[0]);
    }

    response.json(article_res);
  } catch (e) {
    // response.setHeader("content-type", "application/json");
    // response.status(e.http_code).send(e.message);
    response.status(400).json({ error: e });
  }
});

router.post("/", async (request, response) => {
  try {
    const article = await articles.create(request.body, request.session.userID);
    response.status(201).send(article);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.post("/:id/purchase", async (request, response) => {
  try {
    const article = articleService.purchase(
      request.params.id,
      request.session.userID
    );
    response.status(201).json(article);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.put("/:id", async (request, response) => {
  try {
    const article = await articles.update(
      request.params.id,
      request.body,
      true
    );
    response.status(201).json(article);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

module.exports = router;
