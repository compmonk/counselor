const express = require("express");
const bodyParser = require("body-parser");
const {isLoggedIn} = require("../core/login");
const users = require("../data/users");
const canvas = require("../data/canvas");
const sessions = require("../data/sessions");
const articles = require("../data/articles");
const stellarService = require("../services/stellarService");
const recommendationService = require("../services/recommendationService");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

router.get("/transactions", async (request, response) => {
    try {
        const transactions = await stellarService.getTransactions(
            request.session.user.publicKey
        );
        response.send(transactions);
    } catch (e) {
        response.setHeader("content-type", "application/json");
        response.status(e.http_code).send(e.message);
    }
});

router.get("/balance", async (request, response) => {
    try {
        const balance = await stellarService.getBalance(request.session.user.privateKey);
        response.send(balance);
    } catch (e) {
        response.setHeader("content-type", "application/json");
        response.status(e.http_code).send(e.message);
    }
});

router.post("/integrate", async (request, response) => {
    try {
        const courses = await canvas.sendCoursesToDb(
            request.session.userID,
            request.body.token
        );
        response.send(courses);
    } catch (e) {
        response.setHeader("content-type", "application/json");
        response.status(e.http_code).send(e.message);
    }
});

router.get("/courses", async (request, response) => {
    try {
        const courses = await users.getcoursesByuserId(request.session.userID);
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

router.get("/detail", async (request, response) => {
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
        const articles = await recommendationService.recommend(
            request.session.userID
        );
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

router.put("/:articleId/update", async (request, response) => {
    try {
        const article = await articles.updateByAuthor(
            request.params.articleId,
            request.body,
            request.session.userID
        );
        response.status(201).json(article);
    } catch (e) {
        response.setHeader("content-type", "application/json");
        response.status(e.http_code).send(e.message);
    }
});

module.exports = router;
