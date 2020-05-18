const express = require("express");
const router = express.Router();
const articles = require("../data/articles");
const articleService = require("../services/articleService");

const redisClient = require("../core/redisClient");

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
    const personIdx = await redisClient.hmgetAsync(
      "ArticleIds",
      request.params.id
    );
    if (personIdx[0] === null) {
      // person = await data.getById(request.params.id);
      article_res = await articles.get(request.params.id);
      if (article_res == null) {
        throw "Article Id not found";
      }
      await redisClient.rpushAsync("ArticleList", JSON.stringify(article_res));
      const idx = await redisClient.llenAsync("ArticleList");
      await redisClient.hmsetAsync(
        "ArticleIds",
        article_res._id.toString(),
        idx
      );
    } else {
      article_res = await redisClient.lrangeAsync(
        "ArticleList",
        personIdx[0] - 1,
        personIdx[0] - 1
      );
      await redisClient.rpushAsync("ArticleList", article_res[0]);
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
    const article = await articleService.purchase(
      request.params.id,
      // "5eb9bb4afda1a60b18bc8040"
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
    const article = await articles.update(request.params.id, request.body);
    response.status(201).json(article);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

module.exports = router;
