const MUUID = require("uuid-mongodb");
const _ = require("underscore");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(8);

const collections = require("./index");
const stellarService = require("../services/stellarService");
const stellarConfig = require("../settings").stellarConfig;
const users = collections.users;
const articles = collections.articles;
var mongoose = require("mongoose");
require("mongoose-uuid2")(mongoose);
var uuid = require("node-uuid");
require("mongoose-uuid2")(mongoose);
const uuidv5 = require("uuid/v5");
var UUID = mongoose.Types.UUID;
const mongoConfig = require("../settings");
const User123 = require("../models/users");
const Article123 = require("../models/articles");
// const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const conn = mongoose.connect(mongoConfig.env.serverUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: mongoConfig.env.database,
});

mongoose.connection
  .once("open", () =>
    console.log("Connected to Atlas Using Mongoose inside data/users")
  )
  .on("error", (error) => {
    console.log("error is: " + error);
  });

// async function addKeyPair(Id){
//     try{
//     const keyPair = await stellarService.createAccount();
//     const updateOps = {
//         privateKey:keyPair.privateKey,
//         publicKey: keyPair.publicKey
//     }
//     const sanam = User123.update({_id: Id}, { $set: updateOps})
//     .exec()
//     .then((doc) => {
//         return doc;
//     })
//     .catch((err) => {
//         console.log(err);
//         return err.message;
//     });
//     return sanam;
//     } catch (e){
//         console.log(e)
//     }

// }

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

  // Added by sanam to implement mongoose user creation
  const keyPair = await stellarService.createAccount();

  const test1 = new User123({
    _id: MUUID.v4(),
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    currency: newUser.currency,
    hashedPassword: bcrypt.hashSync(newUser.password, salt),
    published: [],
    purchased: [],
    // rewards: [],
    // spent: [],
    courses: [],
    balance: parseInt(stellarConfig.startingBalance),
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
  });
  console.log("Printing user details inside data/users/addUser => " + test1);

  //   newUser._id = MUUID.v4();
  //   newUser.hashedPassword = bcrypt.hashSync(newUser.password, salt);
  delete newUser.password;
  //   newUser.published = [];
  //   newUser.purchased = [];
  //   newUser.rewards = [];
  //   newUser.spent = [];
  //   newUser.courses = [];
  //   newUser.balance = parseInt(stellarConfig.startingBalance);
  const sanam = test1
    .save()
    .then((result) => {
      const newId = MUUID.from(result._id).toString();
      return getUserById(newId);
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });
  console.log(sanam._id);
  return sanam;
  //   const usersCollection = await users();

  //   const user = await usersCollection.findOne({ email: newUser.email });

  //   if (user) {
  //     errors["email"] = "email unavailable";
  //     error.http_code = 400;
  //     error.message = JSON.stringify({ errors: errors });
  //     throw error;
  //   }

  //   const insertInfo = await usersCollection.insertOne(newUser);

  //   if (insertInfo.insertedCount === 0) {
  //     error.message = JSON.stringify({
  //       error: "could not create user",
  //       object: newUser,
  //       errors: errors,
  //     });
  //     error.http_code = 400;
  //     throw error;
  //   }

  //   const newId = insertInfo.insertedId.toString();

  //   const keyPair = await stellarService.createAccount();
  //   newUser.privateKey = keyPair.privateKey;
  //   newUser.publicKey = keyPair.publicKey;

  //   try {
  //     return await usersCollection
  //       .updateOne({ _id: MUUID.from(newId) }, { $set: newUser })
  //       .then(async function (updateInfo) {
  //         if (updateInfo.modifiedCount === 0) {
  //           error.message = JSON.stringify({
  //             error: "could not update user",
  //             object: newUser,
  //             errors: errors,
  //           });
  //           error.http_code = 400;
  //           throw error;
  //         }
  //         return await getUserById(newId);
  //       });
  //   } catch (e) {
  //     throw e;
  // }
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

  if (error.http_code !== 200) {
    error.message = JSON.stringify({ errors: errors });
    throw error;
  }

  try {
    const oldUser = await getUserById(userId);

    const usersCollection = await users();

    return await usersCollection
      .updateOne({ _id: MUUID.from(userId) }, { $set: updatedUser })
      .then(async function (updateInfo) {
        if (updateInfo.modifiedCount === 0) {
          error.message = JSON.stringify({
            error: "could not update user",
            object: updatedUser,
            errors: errors,
          });
          error.http_code = 400;
          throw error;
        }
        return await getUserById(userId);
      });
  } catch (e) {
    throw e;
  }
}

async function getUserById(userId, projection) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  if (userId === undefined || userId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }
  // Added By Sanam to Implement Mongoose
  if (typeof userId === "string") {
    try {
      userId = MUUID.from(userId);
    } catch (e) {
      errors["id"] = e.message;
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  } else {
    try {
      MUUID.from(userId);
    } catch (e) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  }
  const proj1 = {
    firstName: true,
    lastName: true,
    email: true,
    currency: true,
  };
  const sanam = User123.findOne({ _id: userId }, projection)
    .exec()
    .then((doc) => {
      // console.log(doc);
      if (doc == null) {
        return "ID does not exist";
      } else {
        // console.log("Inside data/users/getUserById ID EXISTS");
      }
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
      // console.log(err);
      // res.status(500).json({ error: err });
    });
  return sanam;

  //   if (typeof userId === "string") {
  //     try {
  //       userId = MUUID.from(userId);
  //     } catch (e) {
  //       errors["id"] = e.message;
  //       error.http_code = 400;
  //       error.message = JSON.stringify({
  //         errors: errors,
  //       });
  //       throw error;
  //     }
  //   } else {
  //     try {
  //       MUUID.from(userId);
  //     } catch (e) {
  //       errors["id"] = "id is not defined";
  //       error.http_code = 400;
  //       error.message = JSON.stringify({
  //         errors: errors,
  //       });
  //       throw error;
  //     }
  //   }

  //   const usersCollection = await users();

  //   let user;
  //   if (projection.length) {
  //     user = await usersCollection.findOne(
  //       { _id: userId },
  //       { projection: projection }
  //     );
  //   } else {
  //     user = await usersCollection.findOne(
  //       { _id: userId },
  //       {
  //         projection: {
  //           hashedPassword: false,
  //         },
  //       }
  //     );
  //   }

  //   if (user === null) {
  //     errors["id"] = `user with id ${userId} doesn't exists`;
  //     error.http_code = 404;
  //     error.message = JSON.stringify({
  //       errors: errors,
  //     });
  //     throw error;
  //   }

  //   user._id = MUUID.from(user._id).toString();

  //   for (let i = 0; i < user.published.length; i++) {
  //     user.published[i].articleId = MUUID.from(
  //       user.published[i].articleId
  //     ).toString();
  //   }

  //   for (let i = 0; i < user.purchased.length; i++) {
  //     user.purchased[i].articleId = MUUID.from(
  //       user.purchased[i].articleId
  //     ).toString();
  //   }

  //   return user;
}

async function getUserByEmail(email, projection = { hashedPassword: false }) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};

  //   var result = "";
  var res3 = "'" + projection + "'";
  const projection3 = JSON.stringify(projection);
  console.log("Printing Projection => " + projection);

  if (email === undefined) {
    //|| userId === null) {
    errors["email"] = "email is not defined";
    error.http_code = 400;
  }

  if (typeof email === "string") {
    errors["email"] = "invalid type of email";
    error.http_code = 400;
  }
  //   const emailToValidate = "sjenastevens.edu";
  //   const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  //   emailRegexp.test(emailToValidate)
  //   const usersCollection = await users();
  const user = User123.findOne({ email: email }, projection)
    .exec()
    .then((doc) => {
      // console.log(doc);
      if (doc == null) {
        return "ID does not exist";
      } else {
        // console.log("Inside data/users/getUserById ID EXISTS");
      }
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
      // console.log(err);
      // res.status(500).json({ error: err });
    });
  //   return sanam;

  //   if (projection.length) {
  //     user = await usersCollection.findOne(
  //       { email: email },
  //       { projection: projection }
  //     );
  //   } else {
  //     user = await usersCollection.findOne(
  //       { email: email },
  //       {
  //         projection: {
  //           _id: false,
  //           hashedPassword: false,
  //         },
  //       }
  //     );
  //   }

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
  //   if (userId === undefined || userId === null) {
  //     return false;
  //   }
  //   if (typeof userId === "string") {
  //     try {
  //       userId = MUUID.from(userId);
  //     } catch (e) {
  //       return false;
  //     }
  //   } else if (!isUUID(userId)) {
  //     return false;
  //   }

  //   const usersCollection = await users();
  //   return (await usersCollection.findOne({ _id: userId })) !== null;

  // COMMENTED AND ADDED BY SANAM
  if (userId === undefined || userId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }
  // Added By Sanam to Implement Mongoose
  if (typeof userId === "string") {
    try {
      userId = MUUID.from(userId);
    } catch (e) {
      errors["id"] = e.message;
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  } else {
    try {
      MUUID.from(userId);
    } catch (e) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  }
  const sanam = User123.findOne({ _id: userId })
    .exec()
    .then((doc) => {
      // console.log(doc);
      if (doc == null) {
        return "ID does not exist";
      } else {
        // console.log("Inside data/users/getUserById ID EXISTS");
      }
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
      // console.log(err);
      // res.status(500).json({ error: err });
    });
  return sanam;
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

  const usersCollection = await users();

  const user = await usersCollection.findOne({ email: email });

  return user === null;
}

async function getArticlesByUserId(userId) {
  try {
    const user = await getUserById(userId);

    let articleIds = [];
    for (let i = 0; i < user.published.length; i++) {
      articleIds.push(MUUID.from(user.published[i].articleId));
    }
    for (let i = 0; i < user.purchased.length; i++) {
      articleIds.push(MUUID.from(user.purchased[i].articleId));
    }

    let articleList = [];
    const articleCollection = await articles();

    for (let i = 0; i < articleIds.length; i++) {
      const article = await articleCollection.findOne({ _id: articleIds[i] });
      article._id = MUUID.from(article._id).toString();
      article.author = MUUID.from(article.author).toString();
      articleList.push(article);
    }

    return articleList;
  } catch (e) {
    throw e;
  }
}

async function getRecommendation(userId) {
  // Need to return only the list which are not published and not published by the user.
  const articleCollection = await articles();
  let allArticles = await articleCollection.find({}).toArray();
  allArticles = allArticles.map((article) => {
    article._id = MUUID.from(article._id).toString();
    article.author = MUUID.from(article.author).toString();
    return article;
  });
  const publishedAndPurchasedArticles = await getArticlesByUserId(userId);
  let recommendedArticles = [];
  for (let i = 0; i < allArticles.length; i++) {
    for (let j = 0; j < publishedAndPurchasedArticles; j++) {
      if (allArticles[i]._id === publishedAndPurchasedArticles[j]._id) {
        continue;
      }
    }
    recommendedArticles.push(allArticles[i]);
  }

  return recommendedArticles;
}

async function getPurchased(userId) {
  try {
    const result = await getUserById(userId, { spent: true });
    return result.purchased;
  } catch (e) {
    throw e;
  }
}

async function getPublished(userId) {
  try {
    const result = await getUserById(userId, { spent: true });
    return result.published;
  } catch (e) {
    throw e;
  }
}

// async function getRewards(userId) {
//   try {
//     return await getUserById(userId, { rewards: true });
//   } catch (e) {
//     throw e;
//   }
// }

// async function getSpent(userId) {
//   try {
//     const result = await getUserById(userId, { spent: true });
//     return result.spent;
//   } catch (e) {
//     throw e;
//   }
// }

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

  const usersCollection = await users();

  const user = await usersCollection.findOne({ email: email });

  if (user === null) {
    errors["username"] = `user with username ${email} not found`;
    error.http_code = 404;
    error.message = JSON.stringify({
      errors: errors,
    });
    throw error;
  }

  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    errors["password"] = "Invalid password";
    error.http_code = 403;
    error.message = JSON.stringify({
      errors: errors,
    });
    throw error;
  }
  user._id = MUUID.from(user._id).toString();
  return user;
}
async function changeArticleOwner(articleId, newAuthor) {
  if (articleId === undefined || articleId === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }
  // Added By Sanam to Implement Mongoose
  if (typeof articleId === "string") {
    try {
      articleId = MUUID.from(articleId);
    } catch (e) {
      errors["id"] = e.message;
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  } else {
    try {
      MUUID.from(articleId);
    } catch (e) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  }

  if (newAuthor === undefined || newAuthor === null) {
    errors["id"] = "id is not defined";
    error.http_code = 400;
  }
  // Added By Sanam to Implement Mongoose
  if (typeof newAuthor === "string") {
    try {
      newAuthor = MUUID.from(newAuthor);
    } catch (e) {
      errors["id"] = e.message;
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  } else {
    try {
      MUUID.from(newAuthor);
    } catch (e) {
      errors["id"] = "id is not defined";
      error.http_code = 400;
      error.message = JSON.stringify({
        errors: errors,
      });
      throw error;
    }
  }
  const value = {
    author: newAuthor,
  };
  const sanam = Article123.update({ _id: articleId }, { $set: value })
    .exec()
    .then((doc) => {
      return doc;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });

  return sanam;
}

async function getUsers() {
  //   const usersCollection = await users();

  //   let usersList = await usersCollection
  //     .find(
  //       {},
  //       {
  //         projection: {
  //           _id: false,
  //           username: true,
  //           firstName: true,
  //           lastName: true,
  //         },
  //       }
  //     )
  //     .toArray();
  //   return usersList.map(function (user) {
  //     user.id = user.username;
  //     user.text = `${user.username} (${user.firstName} ${user.lastName})`;
  //     return user;
  //   });

  // commented by sanam
  const sanam = User123.find()
    .exec()
    .then((docs) => {
      return docs;
    })
    .catch((err) => {
      console.log(err);
      return err.message;
    });
  return sanam;
}

async function main() {
  var projection = '"firstName lastName email currency"';
  const proj = {
    firstName: true,
    lastName: true,
    email: true,
    currency: true,
  };

  const resultss = await getUserByEmail("sjena@stevens.edu", proj);
  console.log("Printing result => \n" + resultss);
}

main();
module.exports = {
  addUser,
  updateUser,
  getUserById,
  getUserByEmail,
  userExists,
  emailAvailable,
  getPurchased,
  getPublished,
  //   getRewards,
  //   getSpent,
  isAuthenticated,
  getUsers,
  getArticlesByUserId,
  getRecommendation,
  changeArticleOwner,
};
