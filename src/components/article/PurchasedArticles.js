import React from "react";
import {useState, useEffect, useContext} from "react";
import {Card, Button, Modal} from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import "../../sass/App.css";
import axios from "axios";
import {AuthContext} from "../auth/AuthContext";
import StarRatings from "react-star-ratings";
import FourZeroFour from "../others/FourZeroFour";

function PurchasedArticles() {
    const [articles, setArticles] = useState([]);
    const {currentUser, setCurrentUser} = useContext(AuthContext);

    let list;
    useEffect(() => {
        async function fetch() {
            const {data} = await axios.get("/api/user/articles");
            setArticles(data);
        }

        fetch();
    }, []);

    if (!articles) {
        return <FourZeroFour/>;
    }

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

                                <div>
                                <Card.Text>Rating</Card.Text>
                                <StarRatings
                                    rating={article.rating}
                                    starRatedColor="yellow"
                                    starDimension="20px"
                                    isSelectable={false}
                                />
                                </div>
                                <Button size="small" type="button" onClick={() => {
                                    window.location.href = `/articles/${article._id}`
                                }}>
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
