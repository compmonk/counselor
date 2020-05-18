import React from "react";
import { useState, useEffect, useContext } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import "../../sass/App.css";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function PurchasedArticles() {
  const [articles, setArticles] = useState([]);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  let list;
  useEffect(() => {
    async function fetch() {
      list = (await axios.get("/api/user/articles")).data;
      setArticles(list);
    }
    fetch();
  }, []);
  
  if (!articles) return <Page404></Page404>;
  return (
    <div className="flex">
      {(articles &&
        articles.map((article, index) => {
          return (
            <Card key={index} id={index}>
              <Card.Body>
                <Card.Title>
                  {index + 1}.{article.title}
                </Card.Title>
                <Card.Text>Article - {article.text}</Card.Text>
                <Card.Text>Read Count {article.read}</Card.Text>

                <Card.Text>Ratings {article.rating}</Card.Text>
                <Button type="button" onClick={ ()=> { window.location.href = `/articles/${article._id}`}}>
                  Show Details
                </Button>
              </Card.Body>
            </Card>
          );
        })) ||
        "No Data"}
    </div>
  );
}
export default PurchasedArticles;
