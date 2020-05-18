import React from "react";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import Rating from "react-rating";
import { useParams } from "react-router-dom";
import "../../sass/App.css";
import axios from "axios";

function Article() {
  const [article, setArticle] = useState({});
  const [rate, setRate] = useState({});
  let { articleId } = useParams();
  useEffect(() => {
    async function fetch() {
      const art = (await axios.get(`/api/articles/${articleId}`)).data;
      setArticle(art);
    }
    fetch();
  }, []);

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
          Rate this article - <Rating onClick={(value) => {alert(value); setRate(value)}} placeholderRating={rate}></Rating>
        </Form.Group>
      </Form>
    </div>
  );
}
export default Article;
