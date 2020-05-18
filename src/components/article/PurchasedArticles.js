import React from "react";
import { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import "../../sass/App.css";
import axios from "axios";

function PurchasedArticles() {
  const [articles, setArticles] = useState([]);
  const [show, setShow] = useState(false);

  let list = [];
  useEffect(() => {
    async function fetch() {
      list = (await axios.get("/api/user/articles")).data;

      console.log(typeof list, "list -->", list);

      setArticles(list);
    }
    fetch();
  }, []);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  if (!articles) return <Page404></Page404>;
  return (
    <div className="flex">
      {(articles &&
        articles.map((article, index) => {
          return (
            <div>
              <Card key={index}>
                <Card.Body>
                  <Card.Title>
                    {index + 1}.{article.title}
                  </Card.Title>
                  <Card.Text>Article - {article.text}</Card.Text>
                  <Card.Text>Read Count {article.read}</Card.Text>

                  <Card.Text>Ratings {article.rating}</Card.Text>
                  {/* <Button type="button" class="btn btn-primary">
                    Show Details
                  </Button> */}
                </Card.Body>
              </Card>
              {/* <Modal id={article.title} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>{article.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{article.text}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal> */}
            </div>
          );
        })) ||
        "No Data"}
    </div>
  );
}
export default PurchasedArticles;
