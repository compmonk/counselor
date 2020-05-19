import React, {useContext} from "react";
import {useState, useEffect} from "react";
import {Form, Button, Col} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {AuthContext} from "../auth/AuthContext";
import "../../sass/App.css";
import axios from "axios";
import Rating from "react-rating";


function Article() {
    const {currentUser, cookies} = useContext(AuthContext)
    const [article, setArticle] = useState({});
    let {articleId} = useParams();
    let isAuthor = false;
    let userRating = {}

    useEffect(() => {
        async function fetchData() {
            const {data} = await axios.get(`/api/articles/${articleId}`)
            setArticle(data);
        }

        fetchData();
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();
        let updatedArticle = article;

        if (userRating && userRating.rating) {
            if (!userRating.hasOwnProperty("reviewerId")) {
                userRating.reviewerId = currentUser._id
                updatedArticle.ratings.push(userRating);
            } else {
                updatedArticle.ratings.map(rating => rating.reviewerId === userRating.reviewerId ? userRating : rating);
            }
        }


        if (isAuthor) {
            const {title, text, html, keywords, rating} = e.target.elements;
            updatedArticle["title"] = title.value
            updatedArticle["text"] = text.value
            updatedArticle["html"] = html.value
            updatedArticle["keywords"] = keywords.value.split(",")

            const {data} = await axios.put(`/api/user/${updatedArticle._id}/update`, updatedArticle, {
                withCredentials: true,
                headers: cookies
            })
        } else {
            const {data} = await axios.put(`/api/articles/${articleId}`, updatedArticle, {
                withCredentials: true,
                headers: cookies
            })
        }

        window.location.href = `/articles/${articleId}`;

    }

    if (currentUser && article) {
        isAuthor = article.author === currentUser._id
        userRating = article.ratings ? article.ratings.filter((rating) => (rating.reviewerId === currentUser._id))[0] : {}
    }

    return (
        <Form className="container-fluid col-sm-8 col-md-8 col-lg-8 counselor-form" onSubmit={onSubmit}>
            <Form.Group as={Col}>
                <Form.Text className="text-muted">
                    {isAuthor ? "You can update the Article here." : "You can rate the Article here."}
                </Form.Text>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridTitle">
                <Form.Label>Title </Form.Label>
                <Form.Control disabled={!isAuthor} type="text" name="title" defaultValue={article.title}
                />

            </Form.Group>
            <Form.Group as={Col} controlId="formGridText">
                <Form.Label>Text</Form.Label>
                <Form.Control disabled={!isAuthor} as="textarea" name="text" type="input" defaultValue={article.text}
                />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridHtml">
                <Form.Label>Html</Form.Label>
                <Form.Control disabled={!isAuthor} as="textarea" name="html" defaultValue={article.html}
                />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridKeywords">
                <Form.Label>Keywords</Form.Label>
                <Form.Control disabled={!isAuthor} as="textarea" name="keywords" defaultValue={article.keywords}
                />
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Total Read</Form.Label>
                <Form.Control disabled type="text" value={article.read}/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Cost</Form.Label>
                <Form.Control disabled type="text" value={article.cost}/>
            </Form.Group>
            <Form.Row as={Col}>
                <Form.Group as={Col}>
                    <Form.Label>Your Rating</Form.Label>
                    <Form.Group as={Col}><Rating
                        name="rating" onChange={(rating) => {
                        userRating ? userRating.rating = rating : userRating = {rating}
                    }}
                        placeholderRating={userRating && userRating.rating ? userRating.rating : 0}/></Form.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Average Rating</Form.Label>
                    <Form.Group as={Col}><Rating readonly={true} initialRating={article.rating}/></Form.Group>
                </Form.Group>
            </Form.Row>
            <Button type="submit">
                {isAuthor ? "Update" : "Rate"}
            </Button>
        </Form>
    )
}

export default Article;
