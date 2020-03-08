const express = require("express");
const router = express.Router();
const MUUID = require('uuid-mongodb');
const articles = require('../data/articles');
const users = require("../data/users");

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
        request.body.author=request.session.userID.toString();
        const article = await articles.create(request.body);
        response.status(201).json(article);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});
router.post("/:id/purchase", async (request, response) => {
    try {

        let article= await articles.get(request.params.id);
        if(article.author===request.session.userID){
            throw "publisher can't purchase the same article"
        }

        let user= await users.getUserById(request.session.userID)
        for(i=0;i<user.purchased.length;i++){
            if(user.purchased[i].articleId===MUUID.from(request.params.id)){
                throw "article is already purchased"
            }
        }
        if(user.balance<article.cost){
            throw "insufficient balance";
        }

        let purchasedArticle={
            "articleId":MUUID.from(request.params.id),
            "cost": article.cost
        }

        user.purchased.push(purchasedArticle)
        let updatedUser={
            "purchased": user.purchased,
            "balance": (user.balance-article.cost)
        }
        await users.updateUser(request.session.userID,updatedUser,true)
        let updatedArticle={
            "read": (article.read+1)
        }
        let user2= await users.getUserById(article.author)
        for(i=0;i<user2.rewards.length;i++){
            if(user2.rewards[i].articleId===MUUID.from(request.params.id)){
                user2.rewards[i].reward=user2.rewards[i].reward+article.cost;
            }
        }
        let updateduser2={
            "rewards": user2.rewards,
            "balance": (user2.balance+article.cost)
        }
        await users.updateUser(article.author,updateduser2,true)
        article=await articles.update(MUUID.from(request.params.id),updatedArticle,true)

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