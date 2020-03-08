const express = require("express");
const bodyParser = require("body-parser");
const MUUID = require('uuid-mongodb');

const {isLoggedIn} = require("../core/login");
const users = require("../data/users");
const sessions = require("../data/sessions");
const stellarService = require("../services/stellarService");

const router = express.Router();
router.use(bodyParser.json());
// router.use(bodyParser.urlencoded());


router.get("/:id", async (request, response) => {
    try {
        const user = await users.getUserById(request.params.id);
        response.json(user);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

router.put("/:id", async (request, response) => {
    try {
        const user = await users.updateUser(request.params.id, request.body, true);
        response.status(201).json(user);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

router.get("/:id/transactions", async (request, response) => {
    try {
        const user = await users.getUserById(request.params.id);
        const transactions = await stellarService.getTransactions(user.publicKey);
        response.send(transactions)
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

module.exports = router;