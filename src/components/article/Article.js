import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import Rating from "react-rating";
import { useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../../sass/App.css";
import axios from "axios";
let updateArticle = {};
let flag = false;
let star = 0;
const Author = ({ article }) => {
  return (
    <Form className="col-sm-8 col-md-8 col-lg-8 counselor-form">
      <Form.Group as={Col} controlId="formBasicEmail">
        <Form.Text className="text-muted">
          You can Update Article here.
        </Form.Text>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Title </Form.Label>
        <Form.Control
          type="text"
          placeholder={article.title}
          onChange={(e) => (updateArticle.title = e.target.value)}
        />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Text</Form.Label>
        <Form.Control
          type="text"
          placeholder={article.text}
          onChange={(e) => (updateArticle.text = e.target.value)}
        />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>HTML</Form.Label>
        <Form.Control
          type="text"
          placeholder={article.html}
          onChange={(e) => (updateArticle.html = e.target.value)}
        />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Keywords</Form.Label>
        <Form.Control
          type="text"
          placeholder={article.keywords}
          onChange={(e) => (updateArticle.keywords = e.target.value.split(","))}
        />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Total Read</Form.Label>
        <Form.Control disabled type="text" value={article.read} />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Cost</Form.Label>
        <Form.Control type="text" value={article.cost} />
      </Form.Group>
      <br />
      {/* Rate this article -{" "}
      <Rating
        onClick={(value) => {
          star = value;
        }}
        placeholderRating={star}
      ></Rating> */}
      <Button
        type="submit"
        onClick={async (e) => {
          {
            console.log("updated values", updateArticle);
            let uri = `/api/user/${article._id}/update`;
            let res = await axios.put(uri, updateArticle);
            if (res) alert("Updated");
            e.preventDefault();
          }
        }}
      >
        Update
      </Button>
    </Form>
  );
};

const NotAuthor = async ({ article, userState }) => {
  return (
    <Form className="col-sm-8 col-md-8 col-lg-8 counselor-form">
      <Form.Group as={Col} controlId="formBasicEmail">
        <Form.Text className="text-muted">
          You can only read Article here.
        </Form.Text>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" value={article.title} disabled />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Text</Form.Label>
        <Form.Control disabled type="text" value={article.text} />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>HTML</Form.Label>
        <Form.Control disabled type="text" value={article.html} />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Keywords</Form.Label>
        <Form.Control disabled type="text" value={article.keywords} />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Total Read</Form.Label>
        <Form.Control disabled type="text" value={article.read} />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Cost</Form.Label>
        <Form.Control disabled type="text" value={article.cost} />
      </Form.Group>
      <br />
      Rate this article -{" "}
      <Rating
        onClick={async (value) => {
          star = value;

          if (article && article.ratings.length) {
            article.ratings.map((ratingObject) => {
              if (ratingObject.reviewerId === userState._id) {
                ratingObject.rating = value;
                flag = true;
                return;
              }
            });
          } else if (!flag) {
            let ratingObject = {
              reviewerId: userState._id,
              rating: value,
            };
            article.ratings[0] = ratingObject;
          }
          let sent = await axios.put(`/api/articles/${article._id}`, article);
          if (sent) alert("Rating submitted");
          else alert("Rating Submission Failed");
        }}
        placeholderRating={star}
      ></Rating>
    </Form>
  );
};

function Article() {
  const [article, setArticle] = useState({});
  var isAuthor = false;
  var currentUser = null;
  let { articleId } = useParams();

  useEffect(() => {
    async function fetch() {
      let art = (await axios.get(`/api/articles/${articleId}`)).data;
      if (!art) alert("View Failed");
      currentUser = (await axios.get("/api/user/detail")).data;
      setArticle(art);
      if (art.author === currentUser._id) {
        isAuthor = true;
      } else {
        isAuthor = false;
      }
    }
    fetch();
  }, []);

  if (!article) return <Page404></Page404>;

  return (
    <div className="row justify-content-center">
      {/* {isAuthor ? NotAuthor : Author} */}
      {isAuthor ? (
        <Author article={article} />
      ) : (
        <NotAuthor article={article} userState={currentUser} />
      )}
    </div>
  );
}
export default Article;
