const articles = require("../data/articles");
const users = require("../data/users");
const articleService = require("../services/articleService");
const canvasfunction = require("../data/canvas");
const Collection = require("../data/index");

async function recommend(userId) {
  try {
    const allArticles = await articles.getAll();
    //allArticles = Object.values(allArticles);
    let value = {};
    allArticles.map((item) => {
      item.keywords.map((i) => {
        //includes user courses and  
        if (!i.includes("CS5") && !i.includes("CS554") && !value[item.title]) {
          value[item.title] = Number.NEGATIVE_INFINITY;
        } else {
          if (isNaN(value[item.title])) value[item.title] = 1;
          else value[item.title] += 1;
        }
      });
    });
    allArticles.sort((x, y) => {
      let xPoint = value[x.title] * x.rating * x.read;
      let yPoint = value[y.title] * y.rating * y.read;
      return yPoint - xPoint;
    });
    
    
    //User's purchased and published IDs that need to be removed.
    
    const purchased_PublishedId = await users.getRecommendation(userId);
    canvasfunction.getAssignmentKeywordsByUserId(userId);

    return allArticles;
  } catch (e) {
    console.log(e);
  }
}
module.exports = {recommend};
