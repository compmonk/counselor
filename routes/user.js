const express = require("express");
const bodyParser = require("body-parser");
const MUUID = require("uuid-mongodb");

const { isLoggedIn } = require("../core/login");
const users = require("../data/users");
const sessions = require("../data/sessions");
const stellarService = require("../services/stellarService");

const router = express.Router();
router.use(bodyParser.json());
// router.use(bodyParser.urlencoded());

// router.get("/:id/transactions", async (request, response) => {
//     try {
//         const user = await users.getUserById(request.params.id);
//         const transactions = await stellarService.getTransactions(user.publicKey);
//         response.send(transactions)
//     } catch (e) {
//         response.setHeader('content-type', 'application/json');
//         response.status(e.http_code).send(e.message)
//     }
// });

router.get("/balance", async (request, response) => {
  try {
    const user = await users.getUserById(request.session.userID);
    const balance = await stellarService.getBalance(user.privateKey);
    response.send(balance);
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
    response.status(201).send(user);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/get", async (request, response) => {
  try {
    const user = await users.getUserById(request.session.userID);
    response.send(user);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/articles", async (request, response) => {
  try {
    const articles = await users.getArticlesByUserId(request.session.userID);
    response.send(articles);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/recommendation", async (request, response) => {
  try {
    const articles = await users.getRecommendation(request.session.userID);
    response.send(articles);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

router.get("/purchased", async (request, response) => {
  try {
    return true;
  } catch (e) {
    console.log(e);
  }
});

router.get("/published", async (request, response) => {
  try {
    return true;
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const user = await users.getUserById(request.params.id);
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
