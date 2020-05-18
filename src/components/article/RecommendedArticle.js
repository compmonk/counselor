import React from "react";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import "../../sass/App.css";
import axios from "axios";

function Recommend() {
  const [articles, setArticles] = useState([]);
  let list = undefined;
  useEffect(() => {
    async function fetch() {
      list = await axios.get("/api/user/recommendation");
      console.log("list -->", list.data);
      setArticles(list.data);
    }
    fetch();
  }, []);

  const buy = function buy(e) {
    let fetch = async () => {
      let id = e.target.value;
      const uri = `/api/articles/` + id + `/purchase`;
      console.log(uri);
      try {
        list = await axios.post(uri);
        if (list) alert("you have purchased the article", list);
        else throw "Purchase fail";
      } catch (e) {
        alert("transaction failed! please try again later.", e);
      }
    };
    fetch();
  };
  if (!articles) return <Page404></Page404>;
  return (
    <div className="flex row">
      {(articles &&
        articles.map((article, index) => {
          article.text = article.text.substring(0, 100) + "...";
          return (
            <div className="col-sm-4 col-md-4 col-lg-4">
            <Card key={index}>
              <Card.Body>
                <Card.Title>
                  {index + 1}.{article.title}
                </Card.Title>
                <Card.Text>{article.text}</Card.Text>
                <Card.Text>Read Count {article.read}</Card.Text>

                <Card.Text>Ratings {article.rating}</Card.Text>
                <Button variant="primary" value={article._id} onClick={buy}>
                  Buy
                </Button>
              </Card.Body>
            </Card></div>
          );
        })) ||
        "No Data"}
    </div>
  );
}
export default Recommend;
