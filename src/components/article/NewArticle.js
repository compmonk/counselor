import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Page404 from "../FourZeroFour";
import "../../sass/App.css";
import axios from "axios";

function UserProfile() {
  const [title, setTitle] = useState({});
  const [text, setText] = useState({});
  const [html, setHtml] = useState({});
  const [keywords, setKeyword] = useState(undefined);

  const handleTitle = function (e) {
    setTitle(e.target.value);
    e.preventDefault();
  };
  const handleText = function (e) {
    setText(e.target.value);
    e.preventDefault();
  };
  const handleHtml = function (e) {
    setHtml(e.target.value);
    e.preventDefault();
  };
  const handleKeywords = function (e) {
    setKeyword(e.target.value);
    e.preventDefault();
  };
  const submitNameChange = async (e) => {
    let arr = keywords.split(" ");
    let article = {
      title: title,
      text: text,
      html: html,
      keywords: arr,
    };
    await axios.post("/api/articles/", article)
  };

  return (
    <div className="row justify-content-center">
      <Form
        className="col-sm-8 col-md-8 col-lg-8 counselor-form"
        onSubmit={submitNameChange}
      >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Suitable Title"
            onChange={handleTitle}
          />
          <Form.Text className="text-muted">
            Note - Title is mandatory*
          </Form.Text>

          <Form.Label>Text</Form.Label>
          <Form.Control
            required
            type="textarea"
            onChange={handleText}
            placeholder="Your Article here...."
          />

          <Form.Label>HTML</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Article HTML"
            onChange={handleHtml}
          />

          <Form.Label>Keywords</Form.Label>
          <Form.Control
            as="textarea"
            onChange={handleKeywords}
            placeholder="Keywords e.g. CS 554, Web Programming, Algorithms"
          />
          <Form.Text className="text-muted">
            Note - Add more keywords to reach out to maximum people*
          </Form.Text>

          <Button variant="primary" type="submit">
            Create Article
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
export default UserProfile;
