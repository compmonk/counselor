import React from "react";
import { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import "../../sass/App.css";
import axios from "axios";

function PurchasedArticles() {
  const [articles, setArticles] = useState([]);
  const [show, setShow] = useState({view:false, id:100});
  let list;
  useEffect(() => {
    async function fetch() {
      list = (await axios.get("/api/user/articles")).data;
      setArticles(list);
    }
    fetch();
  }, []);

  const handleClose = () => {
    console.log("calling handleClose again?xxxxxxxxx")
    setShow({view:false, id:show.id});
  };
  const handleShow = () => {
    setShow({view:true,id:(show.id+1)});
  };

  if (!articles) return <Page404></Page404>;
  return (
    <div className="flex">
      {(articles &&
        articles.map((article, index) => {
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {index + 1}.{article.title}
                  </Card.Title>
                  <Card.Text>Article - {article.text}</Card.Text>
                  <Card.Text>Read Count {article.read}</Card.Text>

                  <Card.Text>Ratings {article.rating}</Card.Text>
                  <Button type="button" onClick={handleShow}>
                    Show Details
                  </Button>
                </Card.Body>
              </Card>
              <Modal key={index} id={show.id} show={show.view} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>{article.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{article.text}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          );
        })) ||
        "No Data"}
    </div>
  );
}
export default PurchasedArticles;
