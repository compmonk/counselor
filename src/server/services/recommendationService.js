const articles = require("../data/articles");
const users = require("../data/users");
const articleService = require("../services/articleService");
const canvasfunction = require("../data/canvas");
const userDao = require("../data/users");
const _ = require("underscore");

async function recommend(userId) {
  try {
    const allArticles = await articles.getAll();

    const MyPurchasedPublished = await users.getRecommendation(userId);

    //filter by own articles
    let recommendations = _.filter(allArticles, (article) => {
      return !MyPurchasedPublished.includes(article._id+"");
    });

    //get Keywords
    let intrestedKeywords = await canvasfunction.getAssignmentKeywordsByUserId(userId);
    intrestedKeywords = Array.from(intrestedKeywords);
    // const user = await userDao.getUserById(userId);

    let value = {};
    //sort
    recommendations.map((article) => {
      if(!value[article.title])value[article.title] = 1;
      article.keywords.map((i) => {
        if(intrestedKeywords.includes(i)){
          value[article.title] += 10; 
        }
      });
    });
    
    recommendations.sort((x, y) => {
      let xPoint = value[x.title] * x.rating * x.read + x.read ;
      let yPoint = value[y.title] * y.rating * y.read + x.read ;
      return yPoint - xPoint;
    });
    return recommendations;
  } catch (e) {
    console.log(e);
  }
}
module.exports = { recommend };
