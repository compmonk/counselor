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
    const result = await articles.getArticleByIdForUser(
      request.params.id,
      request.session.userID
    );
    response.json(result);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
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
