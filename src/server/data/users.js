const _ = require("underscore");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(8);
const mongoose = require("mongoose");

const stellarService = require("../services/stellarService");
const stellarConfig = require("../../settings").stellarConfig;
const redisClient = require("../core/redisClient")
const userModel = require("./models/user");
const articleModel = require("./models/article");
const courseModel = require("./models/course");
async function addUser(newUser) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (newUser === undefined || _.isEmpty(newUser)) {
    errors["user"] = "user object not defined";
    error.http_code = 400;
  } else if (typeof newUser !== "object") {
    errors["user"] = "invalid type of user";
    error.http_code = 400;
  }

  if (!newUser.hasOwnProperty("firstName")) {
    errors["firstName"] = "missing property";
    error.http_code = 400;
  } else if (typeof newUser["firstName"] !== "string") {
    errors["firstName"] = "invalid type of firstName";
    error.http_code = 400;
  }

  if (!newUser.hasOwnProperty("lastName")) {
    errors["lastName"] = "missing property";
    error.http_code = 400;
  } else if (typeof newUser["lastName"] !== "string") {
    errors["lastName"] = "invalid type of lastName";
    error.http_code = 400;
  }

  if (!newUser.hasOwnProperty("email")) {
    errors["email"] = "missing property";
    error.http_code = 400;
  } else if (typeof newUser["email"] !== "string") {
    errors["email"] = "invalid type of email";
    error.http_code = 400;
  }

  if (!newUser.hasOwnProperty("password")) {
    errors["password"] = "missing property";
    error.http_code = 400;
  } else if (typeof newUser["password"] !== "string") {
    errors["password"] = "invalid type of password";
    error.http_code = 400;
  }
  if (!newUser.hasOwnProperty("currency")) {
    errors["currency"] = "missing property";
    error.http_code = 400;
  } else if (typeof newUser["currency"] !== "string") {
    errors["currency"] = "invalid type of currency";
    error.http_code = 400;
  }

  if (error.http_code !== 200) {
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }

  const emailCheck = await emailAvailable(newUser.email);
  if (emailCheck != null) {
    errors["email"] = "email unavailable";
    error.http_code = 400;
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }

  try {
    const keyPair = await stellarService.createAccount();

    const user = new userModel({
      _id: new mongoose.Types.ObjectId(),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      currency: newUser.currency,
      published: [],
      purchased: [],
      courses: [],
      balance: parseInt(stellarConfig.startingBalance),
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
      firebaseId: newUser.firebaseId,
      createdAt: newUser.createdAt,
      lastLoginAt: newUser.lastLoginAt,
    });

    const insertInfo = await user.save();
    return insertInfo._doc;
  } catch (e) {
    throw e;
  }
}

async function updateUser(userId, updatedUser, partial = false) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (updatedUser === undefined || _.isEmpty(updatedUser)) {
    errors["article"] = "article object not defined";
    error.http_code = 400;
  } else if (typeof updatedUser !== "object") {
    errors["article"] = "invalid type of article";
    error.http_code = 400;
  }

  if (!partial && !updatedUser.hasOwnProperty("firstName")) {
    errors["firstName"] = "missing property";
    error.http_code = 400;
  } else if (
    updatedUser.hasOwnProperty("firstName") &&
    typeof updatedUser["firstName"] !== "string"
  ) {
    errors["firstName"] = "invalid type";
    error.http_code = 400;
  }

  if (!partial && !updatedUser.hasOwnProperty("lastName")) {
    errors["lastName"] = "missing property";
    error.http_code = 400;
  } else if (
    updatedUser.hasOwnProperty("lastName") &&
    typeof updatedUser["lastName"] !== "string"
  ) {
    errors["lastName"] = "invalid type";
    error.http_code = 400;
  }

  if (!partial && !updatedUser.hasOwnProperty("email")) {
    errors["email"] = "missing property";
    error.http_code = 400;
  } else if (
    updatedUser.hasOwnProperty("email") &&
    typeof updatedUser["email"] !== "string"
  ) {
    errors["email"] = "invalid type";
    error.http_code = 400;
  }

  if (!partial && !updatedUser.hasOwnProperty("password")) {
    errors["password"] = "missing property";
    error.http_code = 400;
  } else if (
    updatedUser.hasOwnProperty("password") &&
    typeof updatedUser["password"] !== "string"
  ) {
    errors["password"] = "invalid type";
    error.http_code = 400;
  }

  if (!partial && !updatedUser.hasOwnProperty("currency")) {
    errors["currency"] = "missing property";
    error.http_code = 400;
  } else if (
    updatedUser.hasOwnProperty("currency") &&
    typeof updatedUser["currency"] !== "string"
  ) {
    errors["currency"] = "invalid type";
    error.http_code = 400;
  }
  if (!partial && !updatedUser.hasOwnProperty("canvasToken")) {
    errors["canvasToken"] = "missing property";
    error.http_code = 400;
  } else if (
    updatedUser.hasOwnProperty("canvasToken") &&
    typeof updatedUser["canvasToken"] !== "string"
  ) {
    errors["canvasToken"] = "invalid type";
    error.http_code = 400;
  }

  if (error.http_code !== 200) {
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }
  if (userId === undefined || userId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }

  try {
    const userUpdate = await userModel.updateOne(
      { _id: userId },
      { $set: updatedUser }
    );
    if (userUpdate.nModified == 0) {
      errors["message"] = `Cannot update user with ID ${userId}`;
      error.http_code = 400;
      error.message = JSON.stringify({ errors: errors });
      throw error;
    }
    const result = await getUserById(userId);
    return result;
  } catch (e) {
    throw e;
  }
}

async function getUserById(
  userId,
  projection = { hashedPassword: false, __v: false }
) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (userId === undefined || userId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }
  try {
    const userInfo = await userModel.findOne({ _id: userId }, projection);
    // console.log(JSON.stringify(userInfo));
    if (userInfo == null) {
      errors["message"] = `User with Id ${userId} does not exist`;
      error.http_code = 400;
      error.message = JSON.stringify({ errors: errors });
      throw error;
    }
    return userInfo._doc;
  } catch (e) {
    // console.log(e.message);
    throw e;
  }
}

async function getUserByEmail(
  email,
  projection = { hashedPassword: false, __v: false }
) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (email === undefined) {
    errors["email"] = "email is not defined";
    error.http_code = 400;
  }

  if (typeof email !== "string") {
    errors["email"] = "invalid type of email";
    error.http_code = 400;
  }

  try {
    const user = await userModel.findOne({ email: email }, projection);

    if (user === null) {
      errors["email"] = `user with email ${email} doesn't exists`;
      error.http_code = 404;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
    return user._doc;
  } catch (e) {
    throw e;
  }
}

async function userExists(userId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  if (userId === undefined || userId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }

  try {
    const userexist = await userModel.findOne({ _id: userId });
    if (userexist === null) {
      errors["id"] = `user with Id ${userId} doesn't exists`;
      error.http_code = 404;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
    return userexist._doc;
  } catch (e) {
    throw e;
  }
}

async function emailAvailable(email) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (email === undefined || email === null) {
    errors["email"] = "email object not defined";
    error.http_code = 400;
  } else if (typeof email !== "object") {
    errors["email"] = "invalid type of user";
    error.http_code = 400;
  }

  const projection = {
    _id: false,
    firstName: false,
    lastName: false,
    // email: false,
    currency: false,
    hashedPassword: false,
    privateKey: false,
    publicKey: false,
    published: false,
    purchased: false,
    courses: false,
    balance: false,
    __v: false,
    canvasToken: false,
    canvasUserId: false,
    firebaseId: false,
    createdAt: false,
    lastLoginAt: false,
  };
  try {
    const emailavl = await userModel.findOne({ email: email }, projection);
    if (emailavl == null) {
      return emailavl;
    }
    return emailavl._doc;
  } catch (e) {
    throw e;
  }
}

async function getArticlesByUserId(userId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  try {
    if (userId === undefined || userId === null) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
    }
    let allArticles = [];
    let articlesByUser = await articleModel.find({ author: userId });
    if (articlesByUser.length === 0) {
        articlesByUser=[];
    }
    allArticles = articlesByUser;
    const usr = await userModel.findOne({ _id: userId });
    for (let i = 0; i < usr["purchased"].length; i++) {
      let articleId = usr["purchased"][i]["articleId"];
      let article = await articleModel.findOne({ _id: articleId });
      allArticles.push(article);
    }
    return allArticles;
  } catch (e) {
    throw e;
  }
}

async function getRecommendation(userId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  try {
    if (userId === undefined || userId === null) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
    }
    const proj = { _id: true, published: true, purchased: true };
    const published_purch = await getUserById(userId, proj, true);

    var pub_pur_ids = [];
    let counter = 0;
    for (var i = 0; i < published_purch.published.length; i++) {
      pub_pur_ids[i] = published_purch.published[i].articleId;
      counter += 1;
    }
    for (var j = 0; j < published_purch.purchased.length; j++) {
      pub_pur_ids[counter] = published_purch.purchased[j].articleId;
      counter += 1;
    }
    return pub_pur_ids;
  } catch (e) {
    throw e;
  }
}

async function getPurchased(userId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  try {
    if (userId === undefined || userId === null) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
    }

    const projection = {
      _id: false,
      firstName: false,
      lastName: false,
      email: false,
      currency: false,
      hashedPassword: false,
      privateKey: false,
      publicKey: false,
      published: false,
      // purchased: true,
      courses: false,
      balance: false,
      __v: false,
      canvasToken: false,
      canvasUserId: false,
      firebaseId: false,
      createdAt: false,
      lastLoginAt: false,
    };

    const purchasedList = await userModel.findOne({ _id: userId }, projection);
    if (purchasedList.length === 0) {
      errors[
        "Purchased"
      ] = `No articles have been purchased by User Id ${userId} `;
      error.http_code = 404;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
    return purchasedList._doc;
  } catch (e) {
    throw e;
  }
}

async function getPublished(userId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  try {
    if (userId === undefined || userId === null) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
    }

    const projection = {
      _id: false,
      firstName: false,
      lastName: false,
      email: false,
      currency: false,
      hashedPassword: false,
      privateKey: false,
      publicKey: false,
      // published: true,
      purchased: false,
      courses: false,
      balance: false,
      __v: false,
      canvasToken: false,
      canvasUserId: false,
      firebaseId: false,
      createdAt: false,
      lastLoginAt: false,
    };
    const publishedList = await userModel.findOne({ _id: userId }, projection);
    if (publishedList.length === 0) {
      errors[
        "Published"
      ] = `No articles have been published by User Id ${userId} `;
      error.http_code = 404;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
    return publishedList._doc;
  } catch (e) {
    throw e;
  }
}

async function isAuthenticated(email, password) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (email === undefined || email === null) {
    errors["username"] = "username not defined";
    error.http_code = 400;
  } else if (typeof email !== "string") {
    errors["username"] = "invalid type of username";
    error.http_code = 400;
  }

  if (password === undefined || password === null) {
    errors["password"] = "password not defined";
    error.http_code = 400;
  } else if (typeof password !== "string") {
    errors["password"] = "invalid type of password";
    error.http_code = 400;
  }

  const auth = userModel
    .findOne({ email: email })
    .exec()
    .then((doc) => {
      if (doc == null) {
        errors["username"] = `user with username ${email} not found`;
        error.http_code = 404;
        error.message = JSON.stringify({
          errors: errors,
        });
        throw error;
      }
      if (!bcrypt.compareSync(password, doc.hashedPassword)) {
        errors["password"] = "Invalid password";
        error.http_code = 403;
        error.message = JSON.stringify({
          errors: errors,
        });
        throw error;
      }
      return doc;
    })
    .catch((err) => {
      //   console.log(err);
      return err.message;
    });
  return auth;
}

async function getUsers() {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  const projection = {
    _id: false,
    hashedPassword: false,
    privateKey: false,
    publicKey: false,
    __v: false,
  };

  try {
    const allusers = await userModel.find({}, projection);
    if (allusers.length === 0) {
      errors["users"] = `There are no users to display`;
      error.http_code = 404;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
    return allusers;
  } catch (e) {
    throw e;
  }
}

async function getUserByFirebaseId(
  firebaseId,
  projection = { hashedPassword: false, __v: false }
) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (firebaseId === undefined || firebaseId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }

  try {
    const res = await userModel.findOne({ firebaseId: firebaseId }, projection);
    if (res === null) {
      errors["id"] = `There are no users with firebase Id ${firebaseId}`;
      error.http_code = 404;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
    return res._doc;
  } catch (e) {
    throw e;
  }
}
async function getcoursesByuserId(userId){
  try {
    let courses=[]
    const coursesStartIdx = await redisClient.hmgetAsync(
      "coursesStartIdx",
      userId.toString()
    );
    const coursesEndIdx = await redisClient.hmgetAsync(
      "coursesEndIdx",
      userId.toString()
    );
    let startIdx,endIdx;
    if (coursesStartIdx[0] === null &&  coursesEndIdx[0]===null) {
      // person = await data.getById(request.params.id);
      courses = await courseModel.find({UserID: userId})
      startIdx = await redisClient.llenAsync("courseList");
      await redisClient.hmsetAsync(
        "coursesStartIdx",
        userId.toString(),
        startIdx
      );
      const multi = redisClient.multi()
      courses.map(JSON.stringify).map((course) => multi.rpush("courseList", course))
      await multi.exec()
      endIdx = await redisClient.llenAsync("courseList");
      await redisClient.hmsetAsync(
        "coursesEndIdx",
        userId.toString(),
        endIdx
      );
    } else {
      courses= await redisClient.lrangeAsync(
        "courseList", parseInt(coursesStartIdx[0]), parseInt(coursesEndIdx[0])).map(JSON.parse);
     
    }
    return courses;
  }catch(e){
    console.log(e);
    throw e;
  }
}
//Updated
module.exports = {
  addUser,
  updateUser,
  getUserById,
  getUserByEmail,
  userExists,
  emailAvailable,
  getPurchased,
  getPublished,
  isAuthenticated,
  getUsers,
  getArticlesByUserId,
  getRecommendation,
  getUserByFirebaseId,
  getcoursesByuserId
};
