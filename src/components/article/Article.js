import React from "react";
import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import Rating from "react-rating";
import { useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../../sass/App.css";
import axios from "axios";

function Article() {
  const [article, setArticle] = useState({});
  const { currentUser } = useContext(AuthContext);
  let { articleId } = useParams();
  useEffect(() => {
    async function fetch() {
      const art = (await axios.get(`/api/articles/${articleId}`)).data;
      setArticle(art);
    }
    fetch();
  }, []);
var star = 1;
  async function submitRating(value) {
    // {
    //     "ratings": [
    //         {
    //             "reviewerId": "5ec202125682b70688231cca",
    //             "rating": 4
    //         },
    //         {
    //             "reviewerId": "5ec20228754c3c35e91065ed",
    //             "rating": 5
    //         }
    //     ]
    // }
    let flag = false;
    if (article && article.ratings.length) {
      article.ratings.map((ratingObject) => {
        if (ratingObject.reviewerId === currentUser._id) {
          ratingObject.rating = value;
          flag = true;
          return;
        }
      });
    } else if (!flag) {
      let ratingObject = {
        reviewerId: currentUser._id,
        rating: value,
      };
      article.ratings[0] = ratingObject;
    }
    console.log("you submitted -- ", article);
    let sent = await axios.put(`/api/articles/${articleId}`, article);
    if(sent) alert("Rating submitted");
    else alert("Rating Submission Failed") 
  }
  if (!article) return <Page404></Page404>;

  return (
    <div className="row justify-content-center">
      <Form className="col-sm-8 col-md-8 col-lg-8 counselor-form">
        <Form.Group controlId="formBasicEmail">
          <Form.Text className="text-muted">
            You can only read Article here.
          </Form.Text>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" disabled value={article.title} />
          <Form.Label>Text</Form.Label>
          <Form.Control disabled type="text" value={article.text} />
          <Form.Label>HTML</Form.Label>
          <Form.Control disabled type="text" value={article.html} />
          <Form.Label>Keywords</Form.Label>
          <Form.Control disabled type="text" value={article.keywords} />
          <Form.Label>Total Read</Form.Label>
          <Form.Control disabled type="text" value={article.read} />
          <Form.Label>Cost</Form.Label>
          <Form.Control disabled type="text" value={article.cost} />
          <br />
          Rate this article -{" "}
          <Rating
            onClick={(value) => {
                star =value;
              submitRating(value);
            }}
            placeholderRating={star}
          ></Rating>
        </Form.Group>
      </Form>
    </div>
  );
}
export default Article;
