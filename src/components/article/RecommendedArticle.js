import React from "react";
import {useState, useEffect} from "react";
import {Card, Button} from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import "../../sass/App.css";
import axios from "axios";
import StarRatings from "react-star-ratings";
import FourZeroFour from "../others/FourZeroFour";

function Recommend() {
    const [articles, setArticles] = useState([]);
    let list = undefined;
    useEffect(() => {
        async function fetch() {
            list = await axios.get("/api/user/recommendation");
            setArticles(list.data);
        }

        fetch();
    }, []);

    const buy = async (e) => {
        let articleId = e.target.value;
        try {
            const response = await axios.post(`/api/articles/${articleId}/purchase`);
            console.log(response)
            if (response.status === 201) {
                window.location.href = `/articles/${articleId}`
            }
        } catch (e) {
            console.log(e)
            alert("Transaction failed");
        }
    }

    if (!articles) {
        return <FourZeroFour/>;
    }
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

                                    <Card.Text>Rating</Card.Text>
                                    <StarRatings
                                        rating={article.rating}
                                        starRatedColor="yellow"
                                        starDimension="20px"
                                        isSelectable={false}
                                    />
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
