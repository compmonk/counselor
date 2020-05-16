const _ = require("underscore");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(8);

const collections = require("./index");
const stellarService = require("../services/stellarService");
const stellarConfig = require("../settings").stellarConfig;
const users = collections.users;
const articles = collections.articles;
var mongoose = require("mongoose");

const mongoConfig = require("../settings");
const userssmodel = require("./models/users");
const articlessmodel = require("./models/articles");

mongoose.Promise = global.Promise;

const conn = mongoose.connect(mongoConfig.mongoConfig.serverUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: mongoConfig.mongoConfig.database,
});

mongoose.connection
  .once("open", () =>
    console.log("Connected to Atlas Using Mongoose inside data/users")
  )
  .on("error", (error) => {
    console.log("error is: " + error);
  });

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

  const keyPair = await stellarService.createAccount();

  const test1 = new userssmodel({
    _id: new mongoose.Types.ObjectId(),
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    currency: newUser.currency,
    hashedPassword: bcrypt.hashSync(newUser.password, salt),
    published: [],
    purchased: [],
    courses: [],
    balance: parseInt(stellarConfig.startingBalance),
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
  });
  console.log("Printing user details inside data/users/addUser => " + test1);

  delete newUser.password;

  const res = test1
    .save()
    .then((result) => {
      const newId = result._id;
      return getUserById(newId);
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });

  return res;
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
    const res = userssmodel
      .updateOne({ _id: userId }, { $set: updatedUser })
      .exec()
      .then((doc) => {
        return doc;
      })
      .catch((err) => {
        console.log(err);
        errors["message"]=err.message;
        error.http_code = 400;
        error.message = JSON.stringify({ errors: errors });
        throw error;
        // return err.message;
      });
    return res;
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

  const res = userssmodel
    .findOne({ _id: userId }, projection)
    .exec()
    .then((doc) => {
      if (doc == null) {
        return "ID does not exist";
      }
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });
  return res;
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

  if (typeof email === "string") {
    errors["email"] = "invalid type of email";
    error.http_code = 400;
  }

  const user = userssmodel
    .findOne({ email: email }, projection)
    .exec()
    .then((doc) => {
      if (doc == null) {
        return "ID does not exist";
      }
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });

  if (user === null) {
    errors["id"] = `user with email ${email} doesn't exists`;
    error.http_code = 404;
    error.message = JSON.stringify({
      errors: errors,
    });
    throw error;
  }

  return user;
}

async function userExists(userId) {
  if (userId === undefined || userId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }

  const result = userssmodel
    .findOne({ _id: userId })
    .exec()
    .then((doc) => {
      if (doc == null) {
        return "ID does not exist";
      }
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });
  return result;
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
    canvasUserId: false
  };
  const result = userssmodel
    .findOne({ email: email }, projection)
    .exec()
    .then((doc) => {
      if (doc == null) {
        console.log(doc);
        return doc;
      }
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });
  return result;
}

async function getArticlesByUserId(userId) {
  try {

    if (userId === undefined || userId === null) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
    }

    const result = articlessmodel
      .find({ author: userId })
      .exec()
      .then((doc) => {
        return doc;
      })
      .catch((err) => {
        console.log(err);
        return err.message;
      });
    return result;
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
canvasUserId: false
    };
    const result = userssmodel
      .findOne({ _id: userId }, projection)
      .exec()
      .then((doc) => {
        if (doc == null) {
          return "Nothing has been purchased";
        }

        return doc;
      })
      .catch((err) => {
        console.log(err);
        return err.message;
      });
    return result;
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
      canvasUserId: false
    };
    const published = userssmodel
      .findOne({ _id: userId }, projection)
      .exec()
      .then((doc) => {
        if (doc == null) {
          return "Nothing has been purchased";
        }
        return doc;
      })
      .catch((err) => {
        console.log(err);
        return err.message;
      });
    return published;
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

 
  const auth = userssmodel
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
      console.log(err);
      return err.message;
    });
  return auth;
}
async function changeArticleOwner(articleId, newAuthor) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  if (articleId === undefined || articleId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }


  const value = {
    author: newAuthor,
  };
  const changeowner = articlessmodel
    .update({ _id: articleId }, { $set: value })
    .exec()
    .then((doc) => {
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });

  return changeowner;
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
  const allusers = userssmodel
    .find({}, projection)
    .exec()
    .then((docs) => {
      return docs;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });
  return allusers;
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
  isAuthenticated,
  getUsers,
  getArticlesByUserId,
  getRecommendation,
  changeArticleOwner,
};
