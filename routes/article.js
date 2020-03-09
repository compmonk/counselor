const express = require("express");
const router = express.Router();
const MUUID = require('uuid-mongodb');
const articles = require('../data/articles');
const users = require("../data/users");
const articleService = require("../services/articleService");

router.get("/", async (request, response) => {
    try {
        const articleList = await tasks.getAll(request.query.take, request.query.skip);
        response.json(tasksList);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

router.get("/:id", async (request, response) => {
    try {
        const article = await articles.get(request.params.id);
        response.json(article);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

router.post("/", async (request, response) => {
    try {
        const article = await articles.create(request.body, request.session.userID);
        response.status(201).send(article);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

router.post("/:id/purchase", async (request, response) => {
    try {
        const article = articleService.purchase(request.params.id, request.session.userID);
        response.status(201).json(article);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

router.put("/:id", async (request, response) => {
    try {
        const article = await articles.update(request.params.id, request.body, true);
        response.status(201).json(article);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});


module.exports = router;