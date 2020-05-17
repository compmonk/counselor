const express = require("express");
const bodyParser = require("body-parser");
const { isLoggedIn } = require("../core/login");
const users = require("../data/users");
const canvas = require("../data/canvas");
const sessions = require("../data/sessions");
const stellarService = require("../services/stellarService");
const recommendationService = require("../services/recommendationService");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

router.get("/transactions", async (request, response) => {
  try {
    const transactions = await stellarService.getTransactions(request.session.user.publicKey);
    response.send(transactions);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/balance", async (request, response) => {
  try {
    const user = await users.getUserById(request.session.userID);
    //const user = await users.getUserById("5eb9bb4afda1a60b18bc8040");
    const balance = await stellarService.getBalance(user.privateKey);
    response.send(balance);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.post("/integrate", async (request, response) => {
  try {
    //const user = await users.getUserById();
    const x= await canvas.sendCoursesToDb("5eb9bb4afda1a60b18bc8040",request.body.token)
    //const balance = await stellarService.getBalance(user.privateKey);
    response.send(x);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/courses", async (request, response) => {
  try {
    //const user = await users.getUserById();
    console.log(request.body.token);
    const courses= await canvas.getCoursesByUserId("5eb9bb4afda1a60b18bc8040");
    console.log(courses);
    //const balance = await stellarService.getBalance(user.privateKey);
    response.send(courses);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});



router.get("/sessions", async (request, response) => {
  try {
    console.log(request.session.userID);
    const sessionsList = await sessions.getSessionByUserId(
      request.session.userID
    );
    // const sessionsList = await sessions.getSessionByUserId(
    //   "5ebfcffa0bf14120998928f7"
    // );
    response.send(sessionsList);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.put("/update", async (request, response) => {
  try {
    const user = await users.updateUser(
      request.session.userID,
      request.body,
      true
    );
    // const user = await users.updateUser(
    //   "5eb9bb4afda1a60b18bc8040",
    //   request.body,
    //   true
    // );
    response.status(201).send(user);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/detail", async (request, response) => {
  try {
    const user = await users.getUserById(request.session.userID);
    // const user = await users.getUserById(request.params.id);
    response.send(user);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/articles", async (request, response) => {
  try {
    const articles = await users.getArticlesByUserId(request.session.userID);
    //const articles = await users.getArticlesByUserId(request.params.id);
    response.send(articles);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/recommendation", async (request, response) => {
  try {
    const articles = await recommendationService.recommend(request.session.userID);
    // const articles = await recommendationService.recommend(
    //   "5eb9bb4afda1a60b18bc8040"
    // );
    response.send(articles);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/purchased", async (request, response) => {
  try {
    const articles = await users.getPurchased(request.session.userID);
    response.send(articles);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/published", async (request, response) => {
  try {
    const articles = await users.getPublished(request.session.userID);
    response.send(articles);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const user = await users.getUserById(request.params.id);
    //const user = await users.getUserById("5eb9bb4afda1a60b18bc8040");
    response.send(user);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.put("/:id", async (request, response) => {
  try {
    const user = await users.updateUser(request.params.id, request.body, true);
    response.status(201).send(user);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

module.exports = router;
