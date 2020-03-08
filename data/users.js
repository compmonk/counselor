const MUUID = require('uuid-mongodb');
const _ = require("underscore");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(8);

const collections = require("./index");
const stellarService = require("../services/stellarService");

const users = collections.users;

async function addUser(newUser) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newUser === undefined || _.isEmpty(newUser)) {
        errors['user'] = "user object not defined";
        error.http_code = 400
    } else if (typeof newUser !== "object") {
        errors['user'] = "invalid type of user";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("firstName")) {
        errors['firstName'] = "missing property";
        error.http_code = 400
    } else if (typeof newUser['firstName'] !== "string") {
        errors['firstName'] = "invalid type of firstName";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("lastName")) {
        errors['lastName'] = "missing property";
        error.http_code = 400
    } else if (typeof newUser['lastName'] !== "string") {
        errors['lastName'] = "invalid type of lastName";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("email")) {
        errors['email'] = "missing property";
        error.http_code = 400
    } else if (typeof newUser['email'] !== "string") {
        errors['email'] = "invalid type of email";
        error.http_code = 400
    }

    if (!newUser.hasOwnProperty("password")) {
        errors['password'] = "missing property";
        error.http_code = 400
    } else if (typeof newUser['password'] !== "string") {
        errors['password'] = "invalid type of password";
        error.http_code = 400
    }
    if (!newUser.hasOwnProperty("currency")) {
        errors['currency'] = "missing property";
        error.http_code = 400
    } else if (typeof newUser['currency'] !== "string") {
        errors['currency'] = "invalid type of currency";
        error.http_code = 400
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    newUser._id = MUUID.v4();
    newUser.hashedPassword = bcrypt.hashSync(newUser.password, salt);
    delete newUser.password;
    newUser.published = [];
    newUser.purchased = [];
    newUser.rewards = [];
    newUser.spent = [];
    newUser.courses = [];
    newUser.balance = 0;


    const usersCollection = await users();

    const user = await usersCollection.findOne({email: newUser.email});

    if (user) {
        errors['email'] = "email unavailable";
        error.http_code = 400;
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    const insertInfo = await usersCollection.insertOne(newUser);

    if (insertInfo.insertedCount === 0) {
        error.message = JSON.stringify({
            'error': "could not create user",
            'object': newUser,
            'errors': errors
        });
        error.http_code = 400;
        throw error
    }

    const newId = insertInfo.insertedId.toString();

    const keyPair = await stellarService.createAccount();
    newUser.publicKey = keyPair.publicKey();
    newUser.keyPair = keyPair;

    try {
        return await usersCollection.updateOne({_id: MUUID.from(newId)}, {$set: newUser})
            .then(async function (updateInfo) {
                if (updateInfo.modifiedCount === 0) {
                    error.message = JSON.stringify({
                        'error': "could not update user",
                        'object': newUser,
                        'errors': errors
                    });
                    error.http_code = 400;
                    throw error
                }
                return await getUserById(newId);
            });
    } catch (e) {
        throw e
    }
}

async function updateUser(userId, updatedUser, partial = false) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (updatedUser === undefined || _.isEmpty(updatedUser)) {
        errors['article'] = "article object not defined";
        error.http_code = 400
    } else if (typeof updatedUser !== "object") {
        errors['article'] = "invalid type of article";
        error.http_code = 400
    }

    if (!partial && !updatedUser.hasOwnProperty("firstName")) {
        errors['firstName'] = "missing property";
        error.http_code = 400
    } else if (updatedUser.hasOwnProperty("firstName") && typeof updatedUser["firstName"] !== "string") {
        errors['firstName'] = "invalid type";
        error.http_code = 400
    }

    if (!partial && !updatedUser.hasOwnProperty("lastName")) {
        errors['lastName'] = "missing property";
        error.http_code = 400
    } else if (updatedUser.hasOwnProperty("lastName") && typeof updatedUser["lastName"] !== "string") {
        errors['lastName'] = "invalid type";
        error.http_code = 400
    }

    if (!partial && !updatedUser.hasOwnProperty("email")) {
        errors['email'] = "missing property";
        error.http_code = 400
    } else if (updatedUser.hasOwnProperty("email") && typeof updatedUser["email"] !== "string") {
        errors['email'] = "invalid type";
        error.http_code = 400
    }

    if (!partial && !updatedUser.hasOwnProperty("password")) {
        errors['password'] = "missing property";
        error.http_code = 400
    } else if (updatedUser.hasOwnProperty("password") && typeof updatedUser["password"] !== "string") {
        errors['password'] = "invalid type";
        error.http_code = 400
    }

    if (!partial && !updatedUser.hasOwnProperty("currency")) {
        errors['currency'] = "missing property";
        error.http_code = 400
    } else if (updatedUser.hasOwnProperty("currency") && typeof updatedUser["currency"] !== "string") {
        errors['currency'] = "invalid type";
        error.http_code = 400
    }


    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    try {
        const oldUser = await getUserById(userId);

        const usersCollection = await users();

        return await usersCollection.updateOne({_id: MUUID.from(userId)}, {$set: updatedUser})
            .then(async function (updateInfo) {
                if (updateInfo.modifiedCount === 0) {
                    error.message = JSON.stringify({
                        'error': "could not update user",
                        'object': updatedUser,
                        'errors': errors
                    });
                    error.http_code = 400;
                    throw error
                }
                return await getUserById(userId);
            });
    } catch (e) {
        throw e
    }
}

async function getUserById(userId, ...projection) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (userId === undefined || userId === null) {
        errors['id'] = "id is not defined";
        error.http_code = 400
    }

    if (typeof userId === "string") {
        try {
            userId = MUUID.from(userId);
        } catch (e) {
            errors['id'] = e.message;
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    } else {
        try {
            MUUID.from(userId);
        } catch (e) {
            errors['id'] = "id is not defined";
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    }

    const usersCollection = await users();

    let user;
    if (projection.length) {
        user = await usersCollection.findOne({_id: userId}, {projection: projection});
    } else {
        user = await usersCollection.findOne({_id: userId}, {
            projection: {
                "hashedPassword": false
            }
        });
    }

    if (user === null) {
        errors['id'] = `user with id ${userId} doesn't exists`;
        error.http_code = 404;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }

    user._id = MUUID.from(user._id).toString();

    return user;
}

async function getUserByEmail(email, ...projection) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (email === undefined || userId === null) {
        errors['email'] = "email is not defined";
        error.http_code = 400
    }

    if (typeof email === "string") {
        errors['email'] = "invalid type of email";
        error.http_code = 400;
    }

    const usersCollection = await users();

    let user;
    if (projection.length) {
        user = await usersCollection.findOne({email: email}, {projection: projection});
    } else {
        user = await usersCollection.findOne({email: email}, {
            projection: {
                "_id": false,
                "hashedPassword": false
            }
        });
    }

    if (user === null) {
        errors['id'] = `user with email ${email} doesn't exists`;
        error.http_code = 404;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }

    return user;
}

async function userExists(userId) {
    if (userId === undefined || userId === null) {
        return false
    }
    if (typeof userId === "string") {
        try {
            userId = MUUID.from(userId);
        } catch (e) {
            return false
        }
    } else if (!isUUID(userId)) {
        return false
    }

    const usersCollection = await users();
    return await usersCollection.findOne({_id: userId}) !== null;
}

async function emailAvailable(email) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (email === undefined || email === null) {
        errors['email'] = "email object not defined";
        error.http_code = 400
    } else if (typeof email !== "object") {
        errors['email'] = "invalid type of user";
        error.http_code = 400
    }

    const usersCollection = await users();

    const user = await usersCollection.findOne({email: email});

    return user === null;
}

async function getPurchased(userId) {
    try {
        return await getUserById(userId, {"purchased": true})
    } catch (e) {
        throw e
    }
}

async function getPublished(userId) {
    try {
        return await getUserById(userId, {"published": true});
    } catch (e) {
        throw e
    }
}

async function getRewards(userId) {
    try {
        return await getUserById(userId, {"rewards": true});
    } catch (e) {
        throw e
    }
}

async function getSpent(userId) {
    try {
        return await getUserById(userId, {"spent": true});
    } catch (e) {
        throw e
    }
}

async function isAuthenticated(email, password) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (email === undefined || email === null) {
        errors['username'] = "username not defined";
        error.http_code = 400
    } else if (typeof email !== "string") {
        errors['username'] = "invalid type of username";
        error.http_code = 400
    }

    if (password === undefined || password === null) {
        errors['password'] = "password not defined";
        error.http_code = 400
    } else if (typeof password !== "string") {
        errors['password'] = "invalid type of password";
        error.http_code = 400
    }

    const usersCollection = await users();

    const user = await usersCollection.findOne({email: email});

    if (user === null) {
        errors['username'] = `user with username ${email} not found`;
        error.http_code = 404;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }

    if (!bcrypt.compareSync(password, user.hashedPassword)) {
        errors['password'] = "Invalid password";
        error.http_code = 403;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }
    user._id = MUUID.from(user._id).toString();
    return user;
}

async function getUsers() {
    const usersCollection = await users();

    let usersList = await usersCollection.find({}, {
        projection:
            {
                "_id": false,
                "username": true,
                "firstName": true,
                "lastName": true
            }
    }).toArray();
    return usersList.map(function (user) {
        user.id = user.username;
        user.text = `${user.username} (${user.firstName} ${user.lastName})`;
        return user
    });
}

module.exports = {
    addUser,
    updateUser,
    getUserById,
    getUserByEmail,
    userExists,
    emailAvailable,
    getPurchased,
    getPublished,
    getRewards,
    getSpent,
    isAuthenticated,
    getUsers
};