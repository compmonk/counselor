import React, {useContext} from "react";
import {Form, Button, Col} from "react-bootstrap";
import "../../sass/App.css";
import axios from "axios";
import {AuthContext} from "../auth/AuthContext";

function NewArticle() {
    const {cookies} = useContext(AuthContext)
    const onSubmit = async (e) => {
        e.preventDefault();
        const {title, text, html, keywords} = e.target.elements;
        let article = {
            title: title.value,
            text: text.value,
            html: html.value,
            keywords: keywords.value.split(",")
        }
        await axios.post("/api/articles/", article, {
            withCredentials: true,
            headers: cookies
        }).then((response) => {
            window.location.href = `/articles/${response.data._id}`;
        })
    }

    return (
        <Form className="container-fluid col-sm-8 col-md-8 col-lg-8 counselor-form" onSubmit={onSubmit}>
            <Form.Group as={Col} controlId="formBasicEmail">
                <Form.Label>Title</Form.Label>
                <Form.Control required name="title" type="text" placeholder="Suitable Title"/>
                <Form.Text className="text-muted">
                    Note - Title is mandatory*
                </Form.Text>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Text</Form.Label>
                <Form.Control required name="text" type="textarea" placeholder="Your Article here...."/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>HTML</Form.Label>
                <Form.Control as="textarea" name="html" placeholder="Article HTML"/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Keywords</Form.Label>
                <Form.Control as="textarea" name="keywords" placeholder="CS 554, Web Programming, Algorithms"/>
                <Form.Text className="text-muted">
                    Note - Add more keywords to reach out to maximum people*
                </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Create Article
            </Button>
        </Form>
    )
}

export default NewArticle;
